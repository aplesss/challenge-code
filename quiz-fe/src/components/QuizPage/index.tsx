import React, { useEffect, useState, useCallback } from 'react';
import QuizQuestion from './children/QuizQuestion';
import LeaderBoard from './children/LeaderBoard';
import { useNavigate } from 'react-router-dom';
import QuizFinished from './children/QuizFinished';
import { useWebsocket } from '../../socketService';
import {
  useAnswerQuestionMutation,
  useLazyGetLeaderBoardQuery,
  useLazyGetQuestionQuery,
  useLazyGetQuizQuery,
} from '../../redux/api';
import { subscribeRealtimeEvent } from '../../socketService/utils';
import StyledQuizPage from './style';

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState<IQuestion>();
  const [result, setResult] = useState<IAnswerResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [finish, setFinish] = useState<boolean>(false);
  const [board, setBoard] = useState<IUserScores>({ leaderboard: [] });
  const websocketService = useWebsocket();
  const [triggerLazyLoadLeaderBoard] = useLazyGetLeaderBoardQuery();
  const [triggerLazyLoadQuestion] = useLazyGetQuestionQuery();
  const [triggerLazyLoadQuiz] = useLazyGetQuizQuery();
  const [answerQuestionMutation] = useAnswerQuestionMutation();

  const handleAnswer = async (optionId: number) => {
    const quizId = sessionStorage.getItem('quizId');
    const userName = sessionStorage.getItem('userName');
    if (!quizId || !userName || !question) return;
    const result = await answerQuestionMutation({
      quizId,
      answer: { userName, questionId: question.questionId, optionId },
    }).unwrap();
    setResult(result);
    if (result.isCorrect) {
      setMessage('Congratulations!');
    } else {
      setMessage('Oops! Try again next time.');
    }
  };

  const handleTimeUp = async () => {
    if (!result) {
      await handleAnswer(-1);
    }
    setResult(null);
    setMessage(null);
    await fetchNextQuestion();
    await fetchLeaderBoard();
  };

  const fetchNextQuestion = useCallback(async () => {
    try {
      const quizId = sessionStorage.getItem('quizId');
      const userName = sessionStorage.getItem('userName');
      if (!quizId || !userName) {
        navigate('/');
        return;
      }
      const quiz = await triggerLazyLoadQuiz(quizId!).unwrap();
      if (!quiz.status) {
        navigate('/');
        return;
      } else if (quiz.status === 'WAITING') {
        navigate('/lobby');
        return;
      } else if (quiz.status === 'FINISHED') {
        setFinish(true);
      }

      const questionData = await triggerLazyLoadQuestion(quizId!).unwrap();
      if (questionData && questionData.isFinished) {
        setFinish(true);
      } else {
        setQuestion(questionData);
      }
    } catch (e) {
      console.log(e);
      navigate('/');
    }
  }, [navigate, triggerLazyLoadQuestion, triggerLazyLoadQuiz]);

  const fetchLeaderBoard = useCallback(async () => {
    const quizId = sessionStorage.getItem('quizId');
    if (quizId) {
      const board = await triggerLazyLoadLeaderBoard(quizId).unwrap();
      setBoard(board);
    }
  }, [triggerLazyLoadLeaderBoard]);

  const listenEvent = (message: any) => {
    if (message.type === 'leader-board-changed') {
      setBoard(message.payload.leaderBoard);
    }
  };

  const subscribeForLeaderBoardChange = useCallback(async () => {
    const quizId = sessionStorage.getItem('quizId');
    const userName = sessionStorage.getItem('userName');
    subscribeRealtimeEvent(websocketService, quizId!, userName!, listenEvent);
  }, [websocketService]);

  useEffect(() => {
    fetchNextQuestion();
    fetchLeaderBoard();
    subscribeForLeaderBoardChange();
  }, [fetchNextQuestion, fetchLeaderBoard, subscribeForLeaderBoardChange]);

  return (
    <StyledQuizPage>
      {question || finish ? (
        <div className="quiz-container">
          <div className="quiz-section">
            {finish ? (
              <QuizFinished winner={board.leaderboard[0].userName} />
            ) : (
              <QuizQuestion
                question={question!}
                result={result!}
                message={message}
                onAnswer={handleAnswer}
                onTimeUp={handleTimeUp}
              />
            )}
          </div>
          <div className="leaderboard-section">
            <LeaderBoard leaderboard={board.leaderboard} />
          </div>
        </div>
      ) : (
        <div className="quiz-container">Some thing went wrong</div>
      )}
    </StyledQuizPage>
  );
};

export default QuizPage;
