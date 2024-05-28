import React from 'react';
import { useLocation } from 'react-router-dom';

const PlayerChart: React.FC = () => {
  const location = useLocation();
  const { selectedPlayers } = location.state || { selectedPlayers: [] };

  return (
    <div>
      <h1>Player Chart</h1>
      <div>
        {selectedPlayers.length > 0 ? (
          <ul>
            {selectedPlayers.map((player, index) => (
              <li key={index}>{player}</li>
            ))}
          </ul>
        ) : (
          <p>No players selected for comparison.</p>
        )}
      </div>
    </div>
  );
};

export default PlayerChart;