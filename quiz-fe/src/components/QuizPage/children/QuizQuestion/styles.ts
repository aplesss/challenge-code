import { styled } from 'styled-components';

const StyledQuizQuestion = styled.div`
  .quiz-option-button.choose {
    background-color: #0056b3;
  }

  .quiz-option-button.correct {
    background-color: green;
    color: white;
  }

  .quiz-option-button.incorrect {
    background-color: red;
    color: white;
  }
`;
export default StyledQuizQuestion;
