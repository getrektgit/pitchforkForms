import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import RegisterModal from './RegisterModal';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const LoginModal = ({ open, handleClose, onLoginSuccess }) => {
  const [openRegister, setOpenRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
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

      localStorage.setItem("accessToken", response.data.accessToken);

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      if (onLoginSuccess) {
        onLoginSuccess({ username: formData.username });
      }

      navigate("/");
      handleClose();
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else if (error.request) {
        setError("Nincs válasz, próbáld újra később");
      } else {
        setError("Hiba fordult elő, próbáld újra később");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
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
              required
              value={formData.password}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={handleCheckboxChange}
                style={{ marginRight: '8px' }}
              />
              <label htmlFor="rememberMe">
                <Typography color='black'>Remember me</Typography>
              </label>
            </div>

            {error && (
              <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
                {error}
              </Typography>
            )}

            <Box sx={{ textAlign: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                fullWidth
                sx={{
                  backgroundColor: "#1976D2",
                  padding: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#135BA1" },
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Box>

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
      </form>

      {/* Register Modal */}
      <RegisterModal open={openRegister} handleClose={handleCloseRegister} />
    </>
  );
};

export default LoginModal;
