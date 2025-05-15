import React from 'react';
import { AppBar, Toolbar, TextField, MenuItem,Button } from '@mui/material';

const methods = ['GET', 'POST', 'PUT', 'DELETE'];
const statusCodes = [200, 201, 400, 404, 500];

const Topbar = ({ filters = {}, onFilterChange,onExportJson}) => {
  return (
    <AppBar position="static" color="default" sx={{ boxShadow: 'none' }}>
      <Toolbar sx={{ gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Date From"
          type="date"
          value={filters.fromDate || ''}
          onChange={(e) => onFilterChange('fromDate', e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
          sx={{ width: 130 }}
        />
        <TextField
          label="Date To"
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
          {statusCodes.map(code => (
            <MenuItem key={code} value={code}>{code}</MenuItem>
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
          {methods.map(method => (
            <MenuItem key={method} value={method}>{method}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Endpoint"
          value={filters.endpoint || ''}
          onChange={(e) => onFilterChange('endpoint', e.target.value)}
          size="small"
          sx={{ width: 130 }}
        />
        <Button variant="contained" onClick={onExportJson}>
          Export JSON
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
