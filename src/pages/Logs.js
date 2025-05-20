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
  Typography,
  CircularProgress,
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
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

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

  const exportJson = () => {
    if (!logs.length) {
      alert('No data to export!');
      return;
    }
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'logs_export.json';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ mt: '64px', px: 3, pb: 3 }}>
      <Topbar
        filters={filters}
        onFilterChange={handleFilterChange}
        onExportJson={exportJson}
      />

      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 4 }}>
        test
      </Typography>
      <Paper elevation={2} sx={{ mt: 2, overflow: 'hidden' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ maxHeight: 500, overflowY: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {['endpoint', 'method', 'statusCode', 'responseTime', 'timestamp'].map((field) => (
                      <TableCell
                        key={field}
                        sx={{
                          fontWeight: 600,
                          textTransform: 'capitalize',
                          backgroundColor: '#f5f5f5',
                          position: 'sticky',
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        {field}
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
            </Box>

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
          </>
        )}
      </Paper>
    </Box>
  );
};

export default Logs;
