import { styled } from 'styled-components';

const StyledLeaderBoard = styled.div`
  .leaderboard-title {
    margin-top: 20px;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    color: #333;
  }
  .leaderboard {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .leaderboard-item {
    margin: 10px 0;
    font-size: 18px;
    background-color: #d5d5d5;
    padding: 10px 15px;
    border-radius: 5px;
    color: #333;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 300px;
    text-align: center;
    transition: background-color 0.3s;
  }
  .leaderboard-item:hover {
    transform: translateX(5px);
    background-color: #d0e7f9;
  }

  .leaderboard-item:hover {
    background-color: #e0e0e0;
  }
`;
export default StyledLeaderBoard;
