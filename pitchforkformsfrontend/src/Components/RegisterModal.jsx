import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

const RegisterModal = ({ open, handleClose }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [checkpassword, setCheckPassword] = useState('');

  const handleRegister = () => {
    // Handle your register logic here
    console.log("Register in with:", username, email, password);
    handleClose(); // Close the modal after register attempt
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
        <Typography variant="h5" component="h2" gutterBottom textAlign="center" color='black'>
          Register to Pitchfork Forms
        </Typography>

        <TextField
          label="Username"
          type="text"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 2 }}
        />


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

        <TextField
          label="Check Password"
          type="password"
          variant="outlined"
          fullWidth
          value={checkpassword}
          onChange={(e) => setCheckPassword(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            onClick={handleRegister}
            fullWidth
            sx={{
              backgroundColor: "#1976D2",
              padding: "12px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#135BA1" },
            }}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default RegisterModal;
