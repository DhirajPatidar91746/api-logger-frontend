import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Line, Bar, Pie } from 'react-chartjs-2';
import API from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  TimeScale
);

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get('/analytics');
        setAnalytics(res.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      }
    };

    fetchAnalytics();
  }, []);

  if (!analytics) return <Typography>Loading...</Typography>;

  const lineData = {
    labels: analytics.requestsPerDay.map(item => item._id),
    datasets: [
      {
        label: 'Requests per Day',
        data: analytics.requestsPerDay.map(item => item.count),
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
        tension: 0.3
      }
    ]
  };

  const barData = {
    labels: analytics.avgResponseTime.map(item => item._id),
    datasets: [
      {
        label: 'Avg Response Time (ms)',
        data: analytics.avgResponseTime.map(item => item.avgTime),
        backgroundColor: 'rgba(75,192,192,0.6)'
      }
    ]
  };

  const pieData = {
    labels: analytics.statusCodeBreakdown.map(item => item._id),
    datasets: [
      {
        label: 'Status Code Breakdown',
        data: analytics.statusCodeBreakdown.map(item => item.count),
        backgroundColor: ['#4caf50', '#f44336', '#2196f3', '#ff9800', '#9c27b0']
      }
    ]
  };

  return (
    <Box display="flex" gap={2} justifyContent="space-between" flexWrap="wrap">
      <Paper elevation={3} sx={{ width: '32%', padding: 2 }}>
        <Typography variant="h6" align="center">Requests Per Day</Typography>
        <Line data={lineData} />
      </Paper>

      <Paper elevation={3} sx={{ width: '32%', padding: 2 }}>
        <Typography variant="h6" align="center">Avg Response Time</Typography>
        <Bar data={barData} />
      </Paper>

      <Paper elevation={3} sx={{ width: '32%', padding: 2 }}>
        <Typography variant="h6" align="center">Status Code Breakdown</Typography>
        <Pie data={pieData} />
      </Paper>
    </Box>
  );
};

export default Analytics;
