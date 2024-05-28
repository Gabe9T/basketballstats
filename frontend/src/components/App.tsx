import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PlayerSearch from './PlayerSearch';
import PlayerChart from './PlayerChart'; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PlayerSearch />} />
        <Route path="/playerChart" element={<PlayerChart />} />
      </Routes>
    </Router>
  );
};

export default App;
