import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, IconButton } from '@mui/material';
import PlayerSearch from './PlayerSearch';
import PlayerChart from './PlayerChart';
import GitHubIcon from '@mui/icons-material/GitHub';

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
      <footer style={{ position: 'fixed', bottom: 0, right: 0, padding: '8px', backgroundColor: 'transparent', zIndex: '9999' }}>
        <IconButton href="https://github.com/Gabe9T/basketballstats" target="_blank" rel="noopener noreferrer">
          <GitHubIcon />
        </IconButton>
      </footer>
    </Box>
  );
};

export default App;
