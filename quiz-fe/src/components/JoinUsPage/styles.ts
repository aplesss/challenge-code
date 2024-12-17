import { styled } from 'styled-components';

const StyledSignInPage = styled.div`
  .container {
    width: 350px;
    margin: 50px auto;
    padding: 25px;
    border-radius: 12px;
    text-align: center;
    background-color: #ffffff;
    color: #333;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .inputGroup {
    margin-bottom: 15px;
    text-align: left;
  }

  .input {
    width: calc(100% - 20px);
    padding: 12px; /* Added extra padding */
    border-radius: 6px;
    border: 1px solid #ddd;
    font-size: 14px;
    color: #333;
    background-color: #f9f9f9;
    transition:
      border-color 0.3s,
      box-shadow 0.3s;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .input:focus {
    border-color: #1677ff;
    box-shadow: 0 0 8px rgba(76, 175, 80, 0.3);
    outline: none;
    background-color: #ffffff;
  }

  .button {
    padding: 12px;
    border-radius: 8px;
    border: none;
    background-color: #4096ff;
    color: white;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition:
      background-color 0.3s,
      transform 0.2s;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  }

  .button:hover {
    background-color: #4096ff;
    transform: translateY(-2px);
  }

  .button:active {
    background-color: #4096ff;
    transform: translateY(1px);
  }

  .error {
    color: #e74c3c;
    font-size: 14px;
    margin-top: -10px;
  }

  @media (max-width: 480px) {
    .container {
      width: 90%;
      padding: 20px;
    }

    .button {
      font-size: 14px;
    }
  }
`;
export default StyledSignInPage;
