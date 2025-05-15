import React, { useState } from 'react';
import {
  Container, Typography, TextField, Button, Box, Link
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/signup', form);
      navigate('/login');
    } catch (err) {
      alert('Signup failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5">Sign Up</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            name="name"
            label="Name"
            fullWidth
            margin="normal"
            onChange={handleChange}
            required
          />
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
            Sign Up
          </Button>
          <Typography sx={{ mt: 2 }}>
            Already a member?{' '}
            <Link component={RouterLink} to="/login">
              Log in
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;
