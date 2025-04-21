import React, { useState } from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress,
  Alert,
  Link,
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import HowToRegIcon from '@mui/icons-material/HowToReg';

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

const PasswordStrengthIndicator = ({ password }) => {
  const getStrength = () => {
    if (!password) return 0;
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return Math.min(strength, 5);
  };

  const strength = getStrength();
  const strengthText = ['Very Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong'][strength - 1] || '';
  const color = ['error', 'error', 'warning', 'success', 'success'][strength - 1] || '';

  return (
    <Box sx={{ mt: -1, mb: 2 }}>
      {password && (
        <Typography variant="caption" color={color}>
          Password Strength: {strengthText}
        </Typography>
      )}
    </Box>
  );
};

const RegisterModal = ({ open, handleClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    checkPassword: '',
  });
  const [formErrors, setFormErrors] = useState({
    username: '',
    email: '',
    password: '',
    checkPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateUsername = (username) => {
    return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
    setError("");
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      username: '',
      email: '',
      password: '',
      checkPassword: '',
    };

    if (!formData.username) {
      newErrors.username = "Username is required";
      valid = false;
    } else if (!validateUsername(formData.username)) {
      newErrors.username = "Username must be at least 3 characters and contain only letters, numbers, and underscores";
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      valid = false;
    }

    if (formData.password !== formData.checkPassword) {
      newErrors.checkPassword = "Passwords do not match";
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setError("");
    setLoading(true);

    try {
      const response = await axios.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        profile_pic: "https://i.pravatar.cc/150?img=1",
      });

      // Optional: Auto-login after registration
      localStorage.setItem("accessToken", response.data.token);
      
      navigate('/');
      handleClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.request ? "No response from server" : 
                         "An unexpected error occurred";
      setError(errorMessage);
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
      <StyledModalBox>
        <Box textAlign="center" mb={3}>
          <HowToRegIcon color="primary" sx={{ fontSize: 50 }} />
          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 1, fontWeight: 600 }}>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Join Pitchfork Forms today
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            name="username"
            label="Username"
            type="text"
            variant="outlined"
            fullWidth
            value={formData.username}
            onChange={handleChange}
            error={!!formErrors.username}
            helperText={formErrors.username}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            name="email"
            label="Email Address"
            type="email"
            variant="outlined"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
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
            value={formData.password}
            onChange={handleChange}
            error={!!formErrors.password}
            helperText={formErrors.password}
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
          />
          <PasswordStrengthIndicator password={formData.password} />

          <TextField
            name="checkPassword"
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            value={formData.checkPassword}
            onChange={handleChange}
            error={!!formErrors.checkPassword}
            helperText={formErrors.checkPassword}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

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
            {loading ? 'Creating Account...' : 'Register'}
          </Button>

          <Divider sx={{ my: 3 }}>Already have an account?</Divider>

          <Box textAlign="center">
            <Link 
              component="button" 
              variant="body2" 
              underline="hover"
              onClick={handleClose}
              sx={{ fontWeight: 600 }}
            >
              Sign in instead
            </Link>
          </Box>
        </form>
      </StyledModalBox>
    </Modal>
  );
};

export default RegisterModal;