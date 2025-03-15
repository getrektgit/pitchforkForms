import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import RegisterModal from './RegisterModal';

const LoginModal = ({ open, handleClose }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [openRegister, setOpenRegister] = useState(false);

  const handleOpenRegister = () => {
    handleClose(); // Close the Login Modal first
    setOpenRegister(true);
  };

  const handleCloseRegister = () => setOpenRegister(false);

  const handleLogin = () => {
    console.log("Logging in with:", username, email, password);
    handleClose(); // Close the modal after login attempt
  };

  return (
    <>
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
          <Typography variant="h5" component="h2" gutterBottom textAlign="center" color='black'>
            Login to Pitchfork Forms
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

          {/* Register Link */}
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              textAlign: "center",
              cursor: "pointer",
              color: "blue",
              textDecoration: "underline",
              "&:hover": { color: "darkblue" }
            }}
            onClick={handleOpenRegister}
          >
            Don't have an account? Register here.
          </Typography>
        </Box>
      </Modal>

      {/* Register Modal */}
      <RegisterModal open={openRegister} handleClose={handleCloseRegister} />
    </>
  );
};

export default LoginModal;
