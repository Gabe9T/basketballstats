import React, { useState, useEffect } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {

};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const App: React.FC = () => {
  const firestore = firebase.firestore();
  const playersRef = firestore.collectionGroup('players');
  const [searchTermName, setSearchTermName] = useState('');
  const [searchTermYearsActive, setSearchTermYearsActive] = useState('');
  const [searchTermPosition, setSearchTermPosition] = useState('');
  const [searchTermHeight, setSearchTermHeight] = useState('');
  const [searchTermWeight, setSearchTermWeight] = useState('');
  const [searchTermDOB, setSearchTermDOB] = useState('');
  const [searchTermCollege, setSearchTermCollege] = useState('');
  const [players, setPlayers] = useState<any[]>([]);
  const [showActivePlayers, setShowActivePlayers] = useState(true); 

  useEffect(() => {
    const localPlayers = localStorage.getItem('basketballPlayers');
    if (localPlayers) {
      setPlayers(JSON.parse(localPlayers));
    } else {
            //grabs data from db if not already cached
      fetchPlayersFromFirestore();
    }
  }, []);

  const fetchPlayersFromFirestore = () => {
    const [data] = useCollectionData(playersRef, { idField: 'id' });
    if (data) {
      localStorage.setItem('basketballPlayers', JSON.stringify(data));
      setPlayers(data);
    }
  };

  const handleActivePlayersClick = () => {
    setShowActivePlayers(!showActivePlayers);
  };

  const filteredPlayers = players?.filter((player: any) => {
    const startYear = parseInt(player['0'], 10);
    const endYear = parseInt(player['1'], 10);
    const searchYear = parseInt(searchTermYearsActive, 10);
    
    return (
      (!showActivePlayers || (startYear <= new Date().getFullYear() && endYear >= new Date().getFullYear())) &&
      (searchTermName === '' || player.name.toLowerCase().includes(searchTermName.toLowerCase())) &&
      (searchTermYearsActive === '' || (startYear <= searchYear && searchYear <= endYear)) &&
      (searchTermPosition === '' || player['2'].toLowerCase() === searchTermPosition.toLowerCase()) &&
      (searchTermHeight === '' || player['3'].toLowerCase().includes(searchTermHeight.toLowerCase())) &&
      (searchTermWeight === '' || player['4'].toLowerCase().includes(searchTermWeight.toLowerCase())) &&
      (searchTermDOB === '' || player['5'].toLowerCase().includes(searchTermDOB.toLowerCase())) &&
      (searchTermCollege === '' || player['7'].toLowerCase().includes(searchTermCollege.toLowerCase()))
    );
  });

  const positions: string[] = Array.from(new Set(players?.map(player => player['2'].toLowerCase()))) || [];

  return (
    <div>
      <h1>Player Search</h1>
      <div>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTermName}
          onChange={(e) => setSearchTermName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by years active"
          value={searchTermYearsActive}
          onChange={(e) => setSearchTermYearsActive(e.target.value)}
        />
        <select
          value={searchTermPosition}
          onChange={(e) => setSearchTermPosition(e.target.value)}
        >
          <option value="">Select Position</option>
          {positions.map((position, index) => (
            <option key={index} value={position}>{position.toUpperCase()}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search by height"
          value={searchTermHeight}
          onChange={(e) => setSearchTermHeight(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by weight"
          value={searchTermWeight}
          onChange={(e) => setSearchTermWeight(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by DOB"
          value={searchTermDOB}
          onChange={(e) => setSearchTermDOB(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by college"
          value={searchTermCollege}
          onChange={(e) => setSearchTermCollege(e.target.value)}
        />
        <button onClick={handleActivePlayersClick}>
          {showActivePlayers ? 'Show All Players' : 'Show Active Players'}
        </button>
      </div>
      <div>
        {filteredPlayers?.map((player: any) => (
          <div key={player.name}>
            <h2>{player.name.toUpperCase()}</h2>
            <ul>
              <li>Start Year: {player['0']}</li>
              <li>End Year: {player['1']}</li>
              <li>Position: {player['2']}</li>
              <li>Height: {player['3']}</li>
              <li>Weight: {player['4']}</li>
              <li>DOB: {player['5']}</li>
              <li>College: {player['7']}</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
