import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Container, Typography, FormControl, InputLabel, Select, MenuItem, Button, Box, Grid, List, ListItem } from '@mui/material';
import playerData from '../data/basketball_players_stats_total.json'; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const statLabels = [
  "games",
  "games started",
  "minutes played",
  "field goals",
  "field goal attempts",
  "field goal percentage",
  "3 point field goals",
  "3 point field goals attempts",
  "3 point field goals percentage",
  "2 point field goals",
  "2 point field goals attempts",
  "2 point field goals percentage",
  "effective field goal percentage",
  "free throws",
  "free throw attempts",
  "free throw percentage",
  "offensive rebounds",
  "defensive rebounds",
  "total rebounds",
  "assists",
  "steals",
  "blocks",
  "turnovers",
  "personal fouls",
  "points"
];

const percentageStats = [
  "field goal percentage",
  "3 point field goals percentage",
  "2 point field goals percentage",
  "effective field goal percentage",
  "free throw percentage"
];

const PlayerChart: React.FC = () => {
  const location = useLocation();
  const { selectedPlayers } = location.state || { selectedPlayers: [] };
  const [selectedStat, setSelectedStat] = useState(statLabels[0]);
  const [visiblePlayers, setVisiblePlayers] = useState<string[]>(selectedPlayers);
  const [selectedYear, setSelectedYear] = useState<string>("all");

  const getPlayerStats = (playerName: string) => {
    const player = playerData.find((p: any) => p.player_info.name === playerName);
    return player ? player.player_stats : null;
  };

  const sortStatsByYear = (stats: any) => {
    const sortedYears = Object.keys(stats).sort((a, b) => parseInt(a) - parseInt(b));

    const sortedStats: any = {};
    sortedYears.forEach((year) => {
      sortedStats[year] = stats[year];
    });

    return sortedStats;
  };

  const generateChartData = () => {
    const colors = [
      'rgba(255, 0, 0, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(0, 255, 0, 1)',
      'rgba(255, 255, 0, 1)',
      'rgba(75, 0, 130, 1)',
      'rgba(255, 127, 0, 1)',
      'rgba(148, 0, 211, 1)'
    ];

    const backgroundColors = [
      'rgba(255, 99, 132, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(0, 255, 0, 0.2)',
      'rgba(255, 255, 0, 0.2)',
      'rgba(75, 0, 130, 0.2)',
      'rgba(255, 127, 0, 0.2)',
      'rgba(148, 0, 211, 0.2)'
    ];

    const datasets = visiblePlayers.map((playerName, index) => {
      const stats = getPlayerStats(playerName);
      if (!stats) return null;

      const sortedStats = sortStatsByYear(stats);
      const years = Object.keys(sortedStats);
      const statIndex = statLabels.indexOf(selectedStat) + 3; // this skips  non-numeric stats

      return {
        label: playerName,
        data: years.map((year) => parseFloat(sortedStats[year].stats[statIndex])),
        fill: true,
        borderColor: colors[index % colors.length],
        backgroundColor: backgroundColors[index % backgroundColors.length],
      };
    }).filter(dataset => dataset !== null);

    const labels = Object.keys(sortStatsByYear(getPlayerStats(selectedPlayers[0])));

    return {
      labels,
      datasets,
    };
  };

  const calculateTotals = (year: string) => {
    const totals: any = {};

    visiblePlayers.forEach((playerName) => {
      const stats = getPlayerStats(playerName);
      if (!stats) return;

      const sortedStats = sortStatsByYear(stats);
      const statIndex = statLabels.indexOf(selectedStat) + 3;

      if (year !== "all" && !sortedStats[year]) {
        totals[playerName] = "N/A";
      } else if (percentageStats.includes(selectedStat)) {
        // for  percentage
        let sum = 0;
        let count = 0;
        Object.keys(sortedStats).forEach((yr) => {
          if (year === "all" || yr === year) {
            const value = parseFloat(sortedStats[yr].stats[statIndex]);
            if (!isNaN(value)) {
              sum += value;
              count++;
            }
          }
        });
        totals[playerName] = count > 0 ? (sum / count).toFixed(2) : "N/A";
      } else {
        // for non percentage
        let total = 0;
        Object.keys(sortedStats).forEach((yr) => {
          if (year === "all" || yr === year) {
            const value = parseFloat(sortedStats[yr].stats[statIndex]);
            if (!isNaN(value)) {
              total += value;
            }
          }
        });
        totals[playerName] = total;
      }
    });

    return totals;
  };

  const handlePlayerToggle = (playerName: string) => {
    setVisiblePlayers((prevVisiblePlayers) =>
      prevVisiblePlayers.includes(playerName)
        ? prevVisiblePlayers.filter((name) => name !== playerName)
        : [...prevVisiblePlayers, playerName]
    );
  };

  const chartData = generateChartData();
  const totals = calculateTotals(selectedYear);

  return (
    <Container maxWidth="md">
      <Box textAlign="center" my={4}>
        <Typography variant="h4" gutterBottom>
          Player Chart
        </Typography>
        <FormControl variant="outlined" margin="normal" fullWidth>
          <InputLabel id="selectedStat-label">Select Stat</InputLabel>
          <Select
            labelId="selectedStat-label"
            id="selectedStat"
            value={selectedStat}
            onChange={(e) => setSelectedStat(e.target.value)}
            label="Select Stat"
          >
            {statLabels.map((label) => (
              <MenuItem key={label} value={label}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box my={2}>
          {selectedPlayers.map((playerName) => (
            <Button
              key={playerName}
              variant={visiblePlayers.includes(playerName) ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => handlePlayerToggle(playerName)}
              style={{ margin: '0 5px' }}
            >
              {playerName}
            </Button>
          ))}
        </Box>
        <Line data={chartData} options={{ responsive: true }} />
        <Box my={4}>
          <Typography variant="h5" gutterBottom>
            Totals
          </Typography>
          <FormControl variant="outlined" margin="normal" fullWidth>
            <InputLabel id="selectedYear-label">Select Year</InputLabel>
            <Select
              labelId="selectedYear-label"
              id="selectedYear"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              label="Select Year"
            >
              <MenuItem value="all">All</MenuItem>
              {Object.keys(sortStatsByYear(getPlayerStats(selectedPlayers[0]))).map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <List>
            {Object.entries(totals).map(([player, total]) => (
              <ListItem key={player}>
                <Typography>
                  {player}: {total}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Container>
  );
};

export default PlayerChart;