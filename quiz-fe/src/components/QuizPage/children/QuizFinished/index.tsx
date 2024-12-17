import React from 'react';
import { useNavigate } from 'react-router-dom';
import StyledQuizFinished from './styles';

interface QuizFinishedProps {
  winner: string;
}

const QuizFinished: React.FC<QuizFinishedProps> = ({ winner }) => {
  const navigate = useNavigate();

  const handleRestartClick = () => {
    navigate('/');
  };

  const handleJoinAnotherQuizClick = () => {
    navigate('/');
  };

  return (
    <StyledQuizFinished>
      <div className="quiz-finished-container">
        <h2 className="quiz-finished-message">Quiz Finished!</h2>
        <p className="quiz-finished-congratulations">
          <b>{winner}</b> smashed the quiz!
        </p>
        <p className="quiz-finished-instructions">
          Thank you for participating! You can either restart the quiz or join
          another.
        </p>
        <div className="quiz-finished-buttons">
          <button onClick={handleRestartClick} className="quiz-finished-button">
            Restart quiz
          </button>
          <button
            onClick={handleJoinAnotherQuizClick}
            className="quiz-finished-button"
          >
            Join another quiz
          </button>
        </div>
      </div>
    </StyledQuizFinished>
  );
};

export default QuizFinished;
