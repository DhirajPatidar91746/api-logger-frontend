import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
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
  const [requestsPerDay, setRequestsPerDay] = useState(null);
  const [avgResponseTime, setAvgResponseTime] = useState(null);
  const [statusCodeBreakdown, setStatusCodeBreakdown] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [reqDayRes, avgRespRes, statusCodeRes] = await Promise.all([
          API.get('/analytics/requests-per-day'),
          API.get('/analytics/avg-response-time'),
          API.get('/analytics/status-code-breakdown'),
        ]);

        setRequestsPerDay(reqDayRes.data);
        setAvgResponseTime(avgRespRes.data);
        setStatusCodeBreakdown(statusCodeRes.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="60vh"
      >
        <CircularProgress />
      </Box>
    );

  if (!requestsPerDay || !avgResponseTime || !statusCodeBreakdown)
    return <Typography>No data available</Typography>;

  const lineData = {
    labels: requestsPerDay.map(item => item._id),
    datasets: [
      {
        label: 'Requests per Day',
        data: requestsPerDay.map(item => item.count),
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
        tension: 0.3
      }
    ]
  };

  const barData = {
    labels: avgResponseTime.map(item => item._id),
    datasets: [
      {
        label: 'Avg Response Time (ms)',
        data: avgResponseTime.map(item => item.avgTime),
        backgroundColor: 'rgba(75,192,192,0.6)'
      }
    ]
  };

  const pieData = {
    labels: statusCodeBreakdown.map(item => item._id.toString()),
    datasets: [
      {
        label: 'Status Code Breakdown',
        data: statusCodeBreakdown.map(item => item.count),
        backgroundColor: ['#4caf50', '#f44336', '#2196f3', '#ff9800', '#9c27b0']
      }
    ]
  };

  return (
    <Box display="flex" gap={2} justifyContent="space-between" flexWrap="wrap">
      <Paper elevation={3} sx={{ width: '32%', padding: 2 }}>
        <Typography variant="h6" align="center">Avg Response Time</Typography>
        <Bar data={barData} />
      </Paper>

      <Paper elevation={3} sx={{ width: '32%', padding: 2 }}>
        <Typography variant="h6" align="center">Status Code Breakdown</Typography>
        <Pie data={pieData} />
      </Paper>

      <Paper elevation={3} sx={{ width: '70%', padding: 2 }}>
        <Typography variant="h6" align="center">Requests Per Day</Typography>
        <Line data={lineData} />
      </Paper>
    </Box>
  );
};

export default Analytics;
