import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

const LoginModal = ({ open, handleClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Handle your login logic here
    console.log("Logging in with:", email, password);
    handleClose(); // Close the modal after login attempt
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="login-modal-title"
      aria-describedby="login-modal-description"
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
        <Typography variant="h5" component="h2" gutterBottom textAlign="center">
          Login to Pitchfork Forms
        </Typography>

        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            onClick={handleLogin}
            fullWidth
            sx={{
              backgroundColor: "#1976D2",
              padding: "12px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#135BA1" },
            }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default LoginModal;
