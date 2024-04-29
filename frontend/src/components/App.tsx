// src/App.tsx
import React from 'react';
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
  const [players, loading, error] = useCollectionData(playersRef, { idField: 'id' });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Basketball Players Stats</h1>
      <div>
        {players && players.map((player: any) => (
          <div key={player.name}>
            <h2>{player.name.toUpperCase()}</h2>
            <ul>
              {Object.keys(player).map((key: string) => {

                return (
                  <li key={key}>
                    <strong>{key}</strong>: {player[key]}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
