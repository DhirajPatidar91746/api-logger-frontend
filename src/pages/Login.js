import React, { useState } from 'react';
import {
  Container, Typography, TextField, Button, Box, Link
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/logs');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5">Log In</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            name="email"
            label="Email"
            fullWidth
            margin="normal"
            onChange={handleChange}
            required
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            onChange={handleChange}
            required
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Log In
          </Button>
          <Typography sx={{ mt: 2 }}>
            Don't have an account?{' '}
            <Link component={RouterLink} to="/signup">
              Sign up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
