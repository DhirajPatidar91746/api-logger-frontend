import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
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
  const [lineChartLoading, setLineChartLoading] = useState(true);
  const [requestType, setRequestType] = useState('day'); // default grouping

  useEffect(() => {
    const fetchAllAnalytics = async () => {
      setLoading(true);
      try {
        const [avgRespRes, statusCodeRes] = await Promise.all([
          API.get('/analytics/avg-response-time'),
          API.get('/analytics/status-code-breakdown')
        ]);

        setAvgResponseTime(avgRespRes.data);
        setStatusCodeBreakdown(statusCodeRes.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllAnalytics();
  }, []);

  useEffect(() => {
    const fetchLineChartData = async () => {
      setLineChartLoading(true);
      try {
        const reqDayRes = await API.get(`/analytics/requests-per-day?type=${requestType}`);
        setRequestsPerDay(reqDayRes.data);
      } catch (err) {
        console.error('Failed to fetch line chart data', err);
      } finally {
        setLineChartLoading(false);
      }
    };

    fetchLineChartData();
  }, [requestType]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Box>
    );

  if (!requestsPerDay || !avgResponseTime || !statusCodeBreakdown)
    return <Typography>No data available</Typography>;

  const lineData = {
    labels: requestsPerDay.map(item => item._id),
    datasets: [
      {
        label: `Requests per ${requestType.charAt(0).toUpperCase() + requestType.slice(1)}`,
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
    <Box display="flex" gap={2} flexDirection="column" padding={2}>
      {/* Select Filter */}
      <FormControl sx={{ width: 200 }}>
        <InputLabel>Group By</InputLabel>
        <Select
          value={requestType}
          label="Group By"
          onChange={(e) => setRequestType(e.target.value)}
        >
          <MenuItem value="day">Day</MenuItem>
          <MenuItem value="week">Week</MenuItem>
          <MenuItem value="month">Month</MenuItem>
        </Select>
      </FormControl>

      {/* Charts */}

      <Paper elevation={3} sx={{ width: '95%', padding: 2 }}>
        <Typography variant="h6" align="center">
          Requests Per {requestType.charAt(0).toUpperCase() + requestType.slice(1)}
        </Typography>
        {lineChartLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </Box>
        ) : (
          <Line data={lineData} />
        )}
      </Paper>

      <Box display="flex" gap={2} justifyContent="space-between" flexWrap="wrap">
        <Paper elevation={3} sx={{ width: '32%', padding: 2 }}>
          <Typography variant="h6" align="center">Avg Response Time</Typography>
          <Bar data={barData} />
        </Paper>

        <Paper elevation={3} sx={{ width: '32%', padding: 2 }}>
          <Typography variant="h6" align="center">Status Code Breakdown</Typography>
          <Pie data={pieData} />
        </Paper>
      </Box>
    </Box>
  );
};

export default Analytics;
