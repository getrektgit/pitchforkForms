import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterModal = ({ open, handleClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    checkPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Közös handleChange minden mezőre
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.checkPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await axios.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        profile_pic: "https://i.pravatar.cc/150?img=1",
      });

      navigate('/');
      handleClose();
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="register-modal-title"
      aria-describedby="register-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          borderRadius: '8px',
          boxShadow: 24,
          padding: 4,
          width: { xs: '90%', sm: '400px' },
        }}
      >
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" component="h2" gutterBottom textAlign="center" color='black'>
            Register to Pitchfork Forms
          </Typography>

          <TextField
            name="username"
            label="Username"
            type="text"
            variant="outlined"
            fullWidth
            value={formData.username}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            name="email"
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={formData.password}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            name="checkPassword"
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            value={formData.checkPassword}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />

          {error && (
            <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}

          <Box sx={{ textAlign: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                backgroundColor: "#1976D2",
                padding: "12px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#135BA1" },
              }}
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default RegisterModal;
