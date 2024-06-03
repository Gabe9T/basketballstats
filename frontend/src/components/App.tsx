import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import PlayerSearch from './PlayerSearch';
import PlayerChart from './PlayerChart';

const App = () => {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<PlayerSearch />} />
          <Route path="/PlayerChart" element={<PlayerChart />} />
        </Routes>
      </Router>
    </Box>
  );
};

export default App;
