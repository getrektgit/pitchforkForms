import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Divider,
  InputAdornment,
  IconButton,
  Alert,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import RegisterModal from './RegisterModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StyledModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[24],
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: '450px',
  outline: 'none'
}));

const LoginModal = ({ open, handleClose, onLoginSuccess }) => {
  const [openRegister, setOpenRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
    setError("");
  };

  const handleCheckboxChange = () => {
    setRememberMe(!rememberMe);
  };

  const handleOpenRegister = () => {
    handleClose();
    setOpenRegister(true);
  };

  const handleCloseRegister = () => setOpenRegister(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("/auth/login", formData, {
        withCredentials: true,
      });

      localStorage.setItem("accessToken", response.data.token);
      rememberMe
        ? localStorage.setItem("rememberMe", "true")
        : localStorage.removeItem("rememberMe");

      if (onLoginSuccess) {
        onLoginSuccess({
          id: response.data.id,
          email: formData.email,
          username: response.data.username,
          role: response.data.role,
        });
      }

      if (response.data.role === "admin") {
        navigate("/admin");
      } else if (response.data.role === "student") {
        navigate("/student");
      } else {
        navigate("/");
      }

      handleClose();
    } catch (error) {
      const message = error.response?.data?.message ||
                      error.request ? "No response from server" :
                      "An unexpected error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="login-modal-title"
        aria-describedby="login-modal-description"
      >
        <StyledModalBox>
          <Box textAlign="center" mb={3}>
            <LoginIcon color="primary" sx={{ fontSize: 50 }} />
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 1, fontWeight: 600 }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Login to your Pitchfork Forms account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              name="email"
              label="Email Address"
              type="email"
              variant="outlined"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              required
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={handleCheckboxChange}
                style={{ marginRight: '8px' }}
              />
              <label htmlFor="rememberMe">
                <Typography color="text.primary" fontSize="0.9rem">Remember me</Typography>
              </label>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              size="large"
              sx={{
                py: 1.5,
                mb: 2,
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <Divider sx={{ my: 3 }}>New to Pitchfork?</Divider>

            <Box textAlign="center">
              <Link
                component="button"
                variant="body2"
                underline="hover"
                onClick={handleOpenRegister}
                sx={{ fontWeight: 600 }}
              >
                Create an account
              </Link>
            </Box>
          </form>
        </StyledModalBox>
      </Modal>

      <RegisterModal open={openRegister} handleClose={handleCloseRegister} />
    </>
  );
};

export default LoginModal;
