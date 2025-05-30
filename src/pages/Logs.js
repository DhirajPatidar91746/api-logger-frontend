import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  LinearProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import API from '../services/api';
import Topbar from '../components/Topbar';
import LogsTable from '../components/LogsTable';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';


const Logs = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [exportProgress, setExportProgress] = useState(0);
  const [progressDialogOpen, setProgressDialogOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [s3DownloadUrl, setS3DownloadUrl] = useState(null);

  const intervalIdRef = useRef(null);

  const clearPollingInterval = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
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
  }, [page, rowsPerPage, filters]);

  useEffect(() => {
    return () => {
      clearPollingInterval();
    };
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
    setS3DownloadUrl(null);
  };

  const exportJson = async () => {
    try {
      clearPollingInterval();
      setProgressDialogOpen(true);
      setExportProgress(0);
      setS3DownloadUrl(null);

      const startRes = await API.get('/export-json/start', { params: filters });
      const jobId = startRes.data.jobId;

      intervalIdRef.current = setInterval(async () => {
        try {
          const statusRes = await API.get('/export-json/status', { params: { jobId } });
          const { progress, status } = statusRes.data;

          setExportProgress(progress);

          if (status === 'completed') {
            clearPollingInterval();

            const res = await API.get('/export-json/download', {
              params: { jobId },
              responseType: 'blob',
            });

            const blob = new Blob([res.data], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'logs_export.json');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            setProgressDialogOpen(false);
          } else if (status === 'error') {
            clearPollingInterval();
            alert('Export job failed.');
            setProgressDialogOpen(false);
          }
        } catch (pollErr) {
          clearPollingInterval();
          console.error('Polling failed:', pollErr);
          alert('Failed to track export progress.');
          setProgressDialogOpen(false);
        }
      }, 1000);
    } catch (err) {
      clearPollingInterval();
      console.error('Export failed:', err);
      alert('Failed to start export.');
      setProgressDialogOpen(false);
    }
  };

  const exportCsv = async () => {
    try {
      clearPollingInterval();
      setProgressDialogOpen(true);
      setExportProgress(0);
      setS3DownloadUrl(null);

      const startRes = await API.get('/export-csv/start', { params: filters });
      const jobId = startRes.data.jobId;

      intervalIdRef.current = setInterval(async () => {
        try {
          const statusRes = await API.get('/export-csv/status', { params: { jobId } });
          const { progress, status } = statusRes.data;

          setExportProgress(progress);

          if (status === 'completed') {
            clearPollingInterval();

            const res = await API.get('/export-csv/download', {
              params: { jobId },
              responseType: 'blob',
            });

            const blob = new Blob([res.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'logs_export.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            setProgressDialogOpen(false);
          } else if (status === 'error') {
            clearPollingInterval();
            alert('Export job failed.');
            setProgressDialogOpen(false);
          }
        } catch (pollErr) {
          clearPollingInterval();
          console.error('Polling failed:', pollErr);
          alert('Failed to track export progress.');
          setProgressDialogOpen(false);
        }
      }, 1000);
    } catch (err) {
      clearPollingInterval();
      console.error('Export failed:', err);
      alert('Failed to start CSV export.');
      setProgressDialogOpen(false);
    }
  };

  const exportJsonToS3 = async () => {
    try {
      clearPollingInterval();
      setProgressDialogOpen(true);
      setExportProgress(0);
      setS3DownloadUrl(null);

      const startRes = await API.get('/export-s3/start', { params: filters });
      const jobId = startRes.data.jobId;

      intervalIdRef.current = setInterval(async () => {
        try {
          const statusRes = await API.get('/export-s3/status', { params: { jobId } });
          const { progress, status, downloadUrl } = statusRes.data;

          setExportProgress(progress);

          if (status === 'completed' && downloadUrl) {
            clearPollingInterval();
            setS3DownloadUrl(downloadUrl);
            setProgressDialogOpen(false);
          } else if (status === 'error') {
            clearPollingInterval();
            alert('Export job to S3 failed.');
            setProgressDialogOpen(false);
          }
        } catch (pollErr) {
          clearPollingInterval();
          console.error('Polling failed:', pollErr);
          alert('Failed to track export progress.');
          setProgressDialogOpen(false);
        }
      }, 1000);
    } catch (err) {
      clearPollingInterval();
      console.error('Export to S3 failed:', err);
      alert('Failed to start export.');
      setProgressDialogOpen(false);
    }
  };

  const handleCloseExport = () => {
    clearPollingInterval();
    setProgressDialogOpen(false);
    setExportProgress(0);
  };

  const openS3Url = () => {
    if (s3DownloadUrl) {
      window.open(s3DownloadUrl, '_blank', 'noopener,noreferrer');
      setS3DownloadUrl(null);
    }
  };

  console.log(loading,"loading")

  return (
    <>
      <Dialog open={progressDialogOpen}>
        <DialogTitle
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          Exporting Logs
          <IconButton aria-label="close" onClick={handleCloseExport} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ width: 300, mt: 1 }}>
            <Typography variant="body2">Progress: {exportProgress}%</Typography>
            <LinearProgress variant="determinate" value={exportProgress} />
          </Box>
        </DialogContent>
      </Dialog>

      <Box sx={{ mt: '64px', px: 3, pb: 3 }}>
        <Topbar
          filters={filters}
          onFilterChange={handleFilterChange}
          onExportJson={exportJson}
          onExportJsonS3={exportJsonToS3}
          onExportCsv={exportCsv}
          s3DownloadUrl={s3DownloadUrl}
          onShowJson={openS3Url}
        />

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 4 }}>
          Logs
        </Typography>

        {loading ? (
  <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
    <CircularProgress />
  </Box>
) : (
  <LogsTable
    logs={logs}
    loading={loading}
    page={page}
    total={total}
    rowsPerPage={rowsPerPage}
    setPage={setPage}
    setRowsPerPage={setRowsPerPage}
  />
)}
      </Box>
    </>
  );
};

export default Logs;
