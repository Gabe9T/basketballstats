import React, { useState, useEffect } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {

};

// Initialize Firebase app
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const App: React.FC = () => {
  const firestore = firebase.firestore();
  const playersRef = firestore.collectionGroup('players');
  const [searchTerm, setSearchTerm] = useState('');
  const [players, setPlayers] = useState<any[]>([]);

  // Load players from local storage on component mount
  useEffect(() => {
    const localPlayers = localStorage.getItem('basketballPlayers');
    if (localPlayers) {
      setPlayers(JSON.parse(localPlayers));
    }
  }, []);

  // Fetch players from Firestore and update local storage
  const [data] = useCollectionData(playersRef, { idField: 'id' });
  useEffect(() => {
    if (data) {
      localStorage.setItem('basketballPlayers', JSON.stringify(data));
      setPlayers(data);
    }
  }, [data]);

  const filteredPlayers = players?.filter((player: any) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Basketball Players Stats</h1>
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div>
        {filteredPlayers?.map((player: any) => (
          <div key={player.name}>
            <h2>{player.name.toUpperCase()}</h2>
            <ul>
              {Object.keys(player).map((key: string) => (
                <li key={key}>
                  <strong>{key}</strong>: {player[key]}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
