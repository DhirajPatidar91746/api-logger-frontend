import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  useTheme,
  Paper,
  TableContainer,
  Box,
} from '@mui/material';

const LogsTable = ({
  logs,
  page,
  rowsPerPage,
  total,
  setPage,
  setRowsPerPage,
  loading,
}) => {
  const theme = useTheme();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        display: 'flex',
        flexDirection: 'column',
        height: '100%', 
      }}
    >
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? theme.palette.background.default
                    : theme.palette.grey[200],
              }}
            >
              {['endpoint', 'method', 'statusCode', 'responseTime', 'timestamp'].map(
                (field) => (
                  <TableCell
                    key={field}
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 'bold',
                      textTransform: 'capitalize',
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    {field}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {logs.map((log, idx) => (
              <TableRow
                key={idx}
                sx={{
                  '&:nth-of-type(odd)': {
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? theme.palette.action.hover
                        : theme.palette.action.selected,
                  },
                }}
              >
                <TableCell>{log.endpoint}</TableCell>
                <TableCell>{log.method}</TableCell>
                <TableCell>{log.statusCode}</TableCell>
                <TableCell>{log.responseTime} ms</TableCell>
                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          zIndex: 10,
        }}
      >
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Box>
    </Paper>
  );
};

export default LogsTable;

