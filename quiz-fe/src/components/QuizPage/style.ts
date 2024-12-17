import { styled } from 'styled-components';

const StyledQuizPage = styled.div`
  .quiz-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin: 30px auto;
    max-width: 1200px;
    gap: 30px;
    padding: 20px;
    background-color: #fafafa;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  /* Section for the quiz content */
  .quiz-section {
    flex: 0 50%;
    margin-right: 20px;
    border-radius: 10px;
    background: linear-gradient(145deg, #ffffff, #f1f1f1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  /* Leaderboard section */
  .leaderboard-section {
    flex: 0 0 35%;
    padding: 20px;
    border-radius: 10px;
    background-color: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
    max-height: 500px;
    width: 100%;
  }

  /* Question container */
  .quiz-question-container {
    padding: 30px;
    border: 1px solid #ddd;
    border-radius: 10px;
    max-width: 450px;
    background-color: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  /* Style for the question text */
  .quiz-question {
    font-size: 1.8em;
    margin-bottom: 25px;
    font-weight: bold;
    color: #333;
  }

  /* Container for quiz options */
  .quiz-options {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;
  }

  /* Style for individual quiz option buttons */
  .quiz-option-button {
    padding: 12px 20px;
    font-size: 1.1em;
    border: none;
    border-radius: 8px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  }

  .quiz-option-button:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }

  .quiz-option-button:active {
    background-color: #003f7f;
    transform: translateY(1px);
  }

  /* Style for the quiz timer */
  .quiz-timer {
    margin-top: 30px;
    font-size: 1.3em;
    font-weight: bold;
    color: #e74c3c;
    text-align: center;
  }

  /* Responsive design for smaller screens */
  @media (max-width: 768px) {
    .quiz-container {
      flex-direction: column;
      align-items: center;
    }

    .quiz-section {
      flex: 0 0 100%;
      margin-right: 0;
    }

    .leaderboard-section {
      flex: 0 0 100%;
      margin-top: 20px;
    }

    .quiz-question-container {
      max-width: 90%;
    }

    .quiz-question {
      font-size: 1.5em;
    }

    .quiz-option-button {
      padding: 10px 18px;
      font-size: 1em;
    }

    .quiz-timer {
      font-size: 1.1em;
    }
  }
`;
export default StyledQuizPage;
