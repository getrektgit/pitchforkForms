import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import Carousel from '../Carousel';
import RegisterModal from '../RegisterModal';
import LoginModal from '../LoginModal';

const MainPage = () => {
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);

  const handleOpenRegister = () => setOpenRegister(true);
  const handleCloseRegister = () => setOpenRegister(false);
  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 8,
        px: 2,
        backgroundColor: '#9FB3DF', // Light blue background
        borderRadius: 4,
        boxShadow: 3,
        minHeight: '100vh',
      }}
    >
      {/* Header Section */}
      <Typography
        variant="h2"
        sx={{
          fontWeight: 800,
          mb: 2,
          color: '#0B1D33', // Dark blue text for the title
        }}
      >
        Pitchfork Forms
      </Typography>

      <Typography
        variant="h6"
        sx={{
          maxWidth: 700,
          mx: 'auto',
          mb: 5,
          color: '#1d2e44', // Grayish-blue text for the subtitle
          fontSize: '1.15rem',
        }}
      >
        Create, share, and evaluate forms with ease. Automate grading, track performance,
        and simplify your workflow in minutes.
      </Typography>

      {/* Carousel Section */}
      <Carousel />

      {/* Call to Action Button */}
      <Box sx={{ mt: 5 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleOpenRegister}
          sx={{
            backgroundColor: '#102E50', // Dark blue button
            px: 4,
            py: 1.5,
            borderRadius: '30px',
            fontWeight: 'bold',
            fontSize: '1rem',
            boxShadow: '0 4px 14px rgba(16, 46, 80, 0.4)',
            '&:hover': {
              backgroundColor: '#0c2342',
            },
          }}
        >
          Get Started
        </Button>
      </Box>

      {/* Features Section */}
      <Box sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#0B1D33' }}>
          What You Can Expect
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4, color: '#1d2e44' }}>
          Discover the benefits designed to help you succeed.
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            {
              title: 'Easy to Use',
              desc: 'Intuitive interface designed for everyone — no tech skills required.',
            },
            {
              title: 'Flexible Templates',
              desc: 'Pre-built forms and layouts you can customize in seconds.',
            },
            {
              title: 'Instant Insights',
              desc: 'Real-time analytics help you make better decisions, faster.',
            },
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={4}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  backgroundColor: 'white', // White background for readability
                  color: '#0B1D33', // Dark text for contrast
                  textAlign: 'left',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {feature.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Steps Section */}
      <Box sx={{ mt: 12, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#0B1D33' }}>
          Just 3 Simple Steps
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4, color: '#1d2e44' }}>
          Get started in minutes with these easy steps.
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {['Sign Up', 'Create a Form', 'Share & Analyze'].map((step, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: 'white', // White background for readability
                  color: '#0B1D33', // Dark text for contrast
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    backgroundColor: '#102E50', // Dark blue circle
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.25rem',
                    mb: 2,
                  }}
                >
                  {index + 1}
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {step}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Call to Action Footer */}
      <Box
        sx={{
          mt: 10,
          p: 5,
          bgcolor: '#102E50', // Dark blue footer background
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Start Building Smarter Forms Today
        </Typography>
        <Button
          variant="outlined"
          color="inherit"
          onClick={handleOpenRegister}
          sx={{
            borderColor: 'white',
            color: 'white',
            '&:hover': {
              backgroundColor: '#0c2342',
              borderColor: 'white',
            },
          }}
        >
          Create Your Free Account
        </Button>
      </Box>

      <RegisterModal
        open={openRegister}
        handleClose={handleCloseRegister}
        handleOpenLogin={handleOpenLogin}
      />
      <LoginModal
        open={openLogin}
        handleClose={handleCloseLogin}
      />
    </Box>
  );
};

export default MainPage;