import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Checkbox } from '@mui/material';
import playersData from '../data/basketball_players_names.json';

const PlayerSearch = () => {
  const [searchTermName, setSearchTermName] = useState('');
  const [searchTermYearsActive, setSearchTermYearsActive] = useState('');
  const [searchTermPosition, setSearchTermPosition] = useState('');
  const [searchTermHeight, setSearchTermHeight] = useState('');
  const [searchTermWeight, setSearchTermWeight] = useState('');
  const [searchTermDOB, setSearchTermDOB] = useState('');
  const [searchTermCollege, setSearchTermCollege] = useState('');
  const [players, setPlayers] = useState([]);
  const [showActivePlayers, setShowActivePlayers] = useState(true);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [showCompareButton, setShowCompareButton] = useState(false);

  useEffect(() => {
    setPlayers(playersData);
  }, []);

  useEffect(() => {
    setShowCompareButton(selectedPlayers.length > 0);
  }, [selectedPlayers]);

  const handleActivePlayersClick = () => {
    setShowActivePlayers(!showActivePlayers);
  };

  const handlePlayerSelect = (name) => {
    if (selectedPlayers.includes(name)) {
      setSelectedPlayers(selectedPlayers.filter(player => player !== name));
    } else {
      setSelectedPlayers([...selectedPlayers, name]);
    }
  };

  const handleCompareClick = () => {
    console.log('Selected players:', selectedPlayers);
  };

  const filteredPlayers = players.filter((player) => {
    const startYear = parseInt(player.start, 10);
    const endYear = parseInt(player.end, 10);
    const searchYear = parseInt(searchTermYearsActive, 10);

    return (
      (!showActivePlayers || (startYear <= new Date().getFullYear() && endYear >= new Date().getFullYear())) &&
      (searchTermName === '' || player.name.toLowerCase().includes(searchTermName.toLowerCase())) &&
      (searchTermYearsActive === '' || (startYear <= searchYear && searchYear <= endYear)) &&
      (searchTermPosition === '' || player.position.toLowerCase() === searchTermPosition.toLowerCase()) &&
      (searchTermHeight === '' || player.height.toLowerCase().includes(searchTermHeight.toLowerCase())) &&
      (searchTermWeight === '' || player.weight.toLowerCase().includes(searchTermWeight.toLowerCase())) &&
      (searchTermDOB === '' || player.birthdate.toLowerCase().includes(searchTermDOB.toLowerCase())) &&
      (searchTermCollege === '' || player.college.toLowerCase().includes(searchTermCollege.toLowerCase()))
    );
  });

  const positions = Array.from(new Set(players.map(player => player.position.toLowerCase())));

  return (
    <div style={{ width: '100%', padding: '20px', position: 'relative' }}>
      <Typography variant="h3" align="center" gutterBottom>
        Player Search
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
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
        {filteredPlayers.map((player) => (
          <div key={player.name} style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '10px', width: 'calc(20% - 20px)', position: 'relative' }}>
            <Typography variant="h5" style={{ textTransform: 'uppercase', cursor: 'pointer' }} onClick={() => handlePlayerSelect(player.name)}>{player.name.toUpperCase()}</Typography>
            <Checkbox
              style={{ position: 'absolute', top: 0, right: 0 }}
              checked={selectedPlayers.includes(player.name)}
              onChange={() => handlePlayerSelect(player.name)}
            />
            <ul style={{ listStyle: 'none', paddingLeft: '0', marginTop: '10px' }}>
              <li>Start Year: {player.start}</li>
              <li>End Year: {player.end}</li>
              <li>Position: {player.position}</li>
              <li>Height: {player.height}</li>
              <li>Weight: {player.weight}</li>
              <li>DOB: {player.birthdate}</li>
              <li>College: {player.college}</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerSearch;
