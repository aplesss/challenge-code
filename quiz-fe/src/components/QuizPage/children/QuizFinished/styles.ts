import { styled } from 'styled-components';

const StyledQuizFinished = styled.div`
  .quiz-finished-container {
    text-align: center;
    margin: 20px;
  }

  .quiz-finished-message {
    color: #333;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .quiz-finished-congratulations {
    color: #0056b3;
    font-size: 18px;
    margin-bottom: 20px;
  }

  .quiz-finished-instructions {
    font-size: 18px;
    margin-bottom: 20px;
    color: #0056b3;
  }

  .quiz-finished-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  .quiz-finished-button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    transition: background-color 0.3s;
  }

  .quiz-finished-button:hover {
    background-color: #0056b3;
  }
  .quiz-finished-congratulations b {
    font-size: 1.5rem;
    color: #28a745;
    animation: celebrate 2s ease-in-out infinite;
  }

  @keyframes celebrate {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
`;
export default StyledQuizFinished;
