import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, IconButton, Tooltip } from '@mui/material';
import PlayerSearch from './PlayerSearch';
import PlayerChart from './PlayerChart';
import GitHubIcon from '@mui/icons-material/GitHub';
import InfoIcon from '@mui/icons-material/Info';

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
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            padding: '8px',
            zIndex: '9999',
          }}
        >
          <Tooltip title="Player statistics from earlier years may not always be accurate.">
            <IconButton>
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Routes>
          <Route path="/" element={<PlayerSearch />} />
          <Route path="/PlayerChart" element={<PlayerChart />} />
        </Routes>
      </Router>
      <footer
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          padding: '8px',
          backgroundColor: 'transparent',
          zIndex: '9999',
        }}
      >
        <IconButton
          href="https://github.com/Gabe9T/basketballstats"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon />
        </IconButton>
      </footer>
    </Box>
  );
};

export default App;
