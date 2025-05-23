import React from 'react';
import {
  AppBar,
  Toolbar,
  TextField,
  MenuItem,
  Button,
  useTheme,
  useMediaQuery,
  Box,
} from '@mui/material';

const methods = ['GET', 'POST', 'PUT', 'DELETE'];
const statusCodes = [200, 201, 400, 404, 500];

const Topbar = ({
  filters = {},
  onFilterChange,
  onExportJson,
  onExportJsonS3,
  s3DownloadUrl,
  onShowJson,
}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  console.log(s3DownloadUrl, "s3DownloadUrl")

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#fff',
        borderBottom: '1px solid #ddd',
        width: { sm: 'calc(100% - 240px)' },
        ml: { sm: '240px' },
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          py: 2,
          alignItems: 'center',
        }}
      >
        <TextField
          label="From"
          type="date"
          value={filters.fromDate || ''}
          onChange={(e) => onFilterChange('fromDate', e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
          sx={{ width: 130 }}
        />
        <TextField
          label="To"
          type="date"
          value={filters.toDate || ''}
          onChange={(e) => onFilterChange('toDate', e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
          sx={{ width: 130 }}
        />
        <TextField
          select
          label="Status"
          value={filters.statusCode || ''}
          onChange={(e) => onFilterChange('statusCode', e.target.value)}
          size="small"
          sx={{ width: 130 }}
        >
          {statusCodes.map((code) => (
            <MenuItem key={code} value={code}>
              {code}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Method"
          value={filters.method || ''}
          onChange={(e) => onFilterChange('method', e.target.value)}
          size="small"
          sx={{ width: 130 }}
        >
          {methods.map((method) => (
            <MenuItem key={method} value={method}>
              {method}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Endpoint"
          value={filters.endpoint || ''}
          onChange={(e) => onFilterChange('endpoint', e.target.value)}
          size="small"
          sx={{ width: 160 }}
        />
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="contained" onClick={onExportJson}>
          Export JSON
        </Button>
        <Button variant="contained" onClick={onExportJsonS3}>
          Export JSON To Cloud
        </Button>
        {s3DownloadUrl && (
          <Button variant="outlined" color="primary" onClick={onShowJson}>
            Show JSON
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
