import React, { useState, useEffect } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Checkbox } from '@mui/material';


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const playerSearch = () => {
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
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [showCompareButton, setShowCompareButton] = useState(false);

  useEffect(() => {
    const localPlayers = localStorage.getItem('basketballPlayers');
    if (localPlayers) {
      setPlayers(JSON.parse(localPlayers));
    } else {
      //grabs data from db if not already cached
      fetchPlayersFromFirestore();
    }
  }, []);

  useEffect(() => {
    setShowCompareButton(selectedPlayers.length > 0);
  }, [selectedPlayers]);

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

  const handlePlayerSelect = (name: string) => {
    if (selectedPlayers.includes(name)) {
      setSelectedPlayers(selectedPlayers.filter(player => player !== name));
    } else {
      setSelectedPlayers([...selectedPlayers, name]);
    }
  };

  const handleCompareClick = () => {
    // show stored players
    console.log('Selected players:', selectedPlayers);
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
    <div style={{ width: '100%', padding: '20px', position: 'relative' }}>
      <Typography variant="h3" align="center" gutterBottom>
        Player Search
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <TextField
          label="Search by name"
          variant="outlined"
          value={searchTermName}
          onChange={(e) => setSearchTermName(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <TextField
          label="Search by years active"
          variant="outlined"
          value={searchTermYearsActive}
          onChange={(e) => setSearchTermYearsActive(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <FormControl variant="outlined" style={{ minWidth: '150px', marginRight: '10px' }}>
          <InputLabel>Select Position</InputLabel>
          <Select
            value={searchTermPosition}
            onChange={(e) => setSearchTermPosition(e.target.value)}
            label="Select Position"
          >
            <MenuItem value="">All Positions</MenuItem>
            {positions.map((position, index) => (
              <MenuItem key={index} value={position}>{position.toUpperCase()}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Search by height"
          variant="outlined"
          value={searchTermHeight}
          onChange={(e) => setSearchTermHeight(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <TextField
          label="Search by weight"
          variant="outlined"
          value={searchTermWeight}
          onChange={(e) => setSearchTermWeight(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <TextField
          label="Search by DOB"
          variant="outlined"
          value={searchTermDOB}
          onChange={(e) => setSearchTermDOB(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <TextField
          label="Search by college"
          variant="outlined"
          value={searchTermCollege}
          onChange={(e) => setSearchTermCollege(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        {showCompareButton && (
          <Button variant="contained" onClick={handleCompareClick} style={{ backgroundColor: '#007bff', color: '#fff', marginLeft: '10px', position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: '1' }}>
            Compare
          </Button>
        )}
        <Button variant="contained" onClick={handleActivePlayersClick} style={{ backgroundColor: '#007bff', color: '#fff', marginLeft: '10px' }}>
          {showActivePlayers ? 'Show All Players' : 'Show Active Players'}
        </Button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {filteredPlayers?.map((player: any) => (
          <div key={player.name} style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '10px', width: 'calc(20% - 20px)', position: 'relative' }}>
            <Typography variant="h5" style={{ textTransform: 'uppercase', cursor: 'pointer' }} onClick={() => handlePlayerSelect(player.name)}>{player.name.toUpperCase()}</Typography>
            <Checkbox
              style={{ position: 'absolute', top: 0, right: 0 }}
              checked={selectedPlayers.includes(player.name)}
              onChange={() => handlePlayerSelect(player.name)}
            />
            <ul style={{ listStyle: 'none', paddingLeft: '0', marginTop: '10px' }}>
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

export default playerSearch;
