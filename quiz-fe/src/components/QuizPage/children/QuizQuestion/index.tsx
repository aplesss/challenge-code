import React, { useEffect, useState } from 'react';
import StyledQuizQuestion from './styles';

interface Props {
  question: IQuestion;
  result: IAnswerResult;
  message: string | null;
  onAnswer: (optionId: number) => void;
  onTimeUp: () => void;
}

const QuizQuestion: React.FC<Props> = ({
  question,
  result,
  message,
  onAnswer,
  onTimeUp,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(question.duration);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);

  useEffect(() => {
    setTimeLeft(question.duration);
  }, [question]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      setSelectedOptionId(null);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const handleOptionClick = (optionId: number) => {
    setSelectedOptionId(optionId);
    onAnswer(optionId);
  };

  const getButtonStyle = (optionId: number) => {
    if (result && result.questionId === question.questionId) {
      if (result.correctOptionId === optionId) {
        return 'correct';
      }
      if (selectedOptionId === optionId && !result.isCorrect) {
        return 'incorrect';
      }
    }
    return 'default';
  };

  return (
    <StyledQuizQuestion>
      <div className="quiz-question-container">
        <h2 className="quiz-question">
          {question.questionType}: {question.questionText}
        </h2>
        <div className="quiz-options">
          {question.options.map((option: any) => (
            <button
              key={option.optionId}
              className={`quiz-option-button ${getButtonStyle(option.optionId)}`}
              onClick={() => handleOptionClick(option.optionId)}
              disabled={selectedOptionId !== null}
            >
              {option.optionText}
            </button>
          ))}
        </div>
        <div className="quiz-timer">Time left: {timeLeft} seconds</div>
        <div className="quiz-timer">{message ? message : ''}</div>
      </div>
    </StyledQuizQuestion>
  );
};

export default QuizQuestion;
