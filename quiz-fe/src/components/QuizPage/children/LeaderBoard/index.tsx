import React from 'react';
import StyledLeaderBoard from './styles';

const Leaderboard: React.FC<IUserScores> = ({ leaderboard }) => {
  const scores = leaderboard ? leaderboard : [];
  return (
    <StyledLeaderBoard>
      <h2 className="leaderboard-title">Leaderboard</h2>
      <ul className="leaderboard">
        {scores.map((userScore, index) => (
          <li key={index} className="leaderboard-item">
            {userScore.userName}: {userScore.score} points
          </li>
        ))}
      </ul>
    </StyledLeaderBoard>
  );
};

export default Leaderboard;
