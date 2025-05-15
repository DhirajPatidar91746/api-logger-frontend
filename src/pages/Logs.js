import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Typography
} from '@mui/material';
import API from '../services/api';
import Topbar from '../components/Topbar';
import { useNavigate } from 'react-router-dom';

const Logs = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filters, setFilters] = useState({});
  const [total, setTotal] = useState(0);

  const fetchLogs = async () => {
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        sortBy,
        sortOrder,
        ...filters,
      };
      const res = await API.get('/logs', { params });
      setLogs(res?.data?.logs || []);
      setTotal(res?.data?.total || 0);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [page, rowsPerPage, sortBy, sortOrder, filters]);

  const handleSort = (field) => {
    const isAsc = sortBy === field && sortOrder === 'asc';
    setSortBy(field);
    setSortOrder(isAsc ? 'desc' : 'asc');
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  // Export current filtered logs to JSON file
  const exportJson = () => {
    if (!logs || logs.length === 0) {
      alert('No data to export!');
      return;
    }
    const filename = 'logs_export.json';
    const jsonStr = JSON.stringify(logs, null, 2);

    const blob = new Blob([jsonStr], { type: 'application/json' });
    const href = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        API Logs
      </Typography>

      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Topbar filters={filters} onFilterChange={handleFilterChange} onExportJson={exportJson} />
      </Paper>

      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              {['endpoint', 'method', 'statusCode', 'responseTime', 'timestamp'].map((field) => (
                <TableCell key={field} sx={{ fontWeight: 600 }}>
                  <TableSortLabel
                    active={sortBy === field}
                    direction={sortBy === field ? sortOrder : 'asc'}
                    onClick={() => handleSort(field)}
                  >
                    {field}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log, index) => (
              <TableRow key={index}>
                <TableCell>{log.endpoint}</TableCell>
                <TableCell>{log.method}</TableCell>
                <TableCell>{log.statusCode}</TableCell>
                <TableCell>{log.responseTime} ms</TableCell>
                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>
    </Box>
  );
};

export default Logs;
