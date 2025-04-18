import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import Carousel from '../Carousel';
import RegisterModal from '../RegisterModal';

// Recharts imports
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const MainPage = () => {
  const [openRegister, setOpenRegister] = useState(false);

  const handleOpenRegister = () => setOpenRegister(true);
  const handleCloseRegister = () => setOpenRegister(false);

  // Dummy data for graphs
  const barData = [
    { day: 'Mon', responses: 12 },
    { day: 'Tue', responses: 18 },
    { day: 'Wed', responses: 9 },
    { day: 'Thu', responses: 15 },
    { day: 'Fri', responses: 22 },
  ];

  const pieData = [
    { name: 'Completed', value: 65 },
    { name: 'Skipped', value: 20 },
    { name: 'In Progress', value: 15 },
  ];

  const pieColors = ['#4caf50', '#f44336', '#ff9800'];

  return (
    <Box
  sx={{
    textAlign: "center",
    py: 8,
    px: 2,
    backgroundColor: "#9FB3DF", // világosított tengerkék árnyalat
    borderRadius: 4,
    boxShadow: 3,
  }}
>
  <Typography
    variant="h2"
    sx={{
      fontWeight: 800,
      mb: 2,
      color: "#0B1D33", // mélykék szöveg kontraszt
    }}
  >
    Pitchfork Forms
  </Typography>

  <Typography
    variant="h6"
    sx={{
      maxWidth: 700,
      mx: "auto",
      mb: 5,
      color: "#1d2e44", // szürkéskék árnyalat
      fontSize: "1.15rem",
    }}
  >
    Create, share and evaluate forms with ease. Automate grading, track performance,
    and simplify your workflow in minutes.
  </Typography>

  <Carousel />

  <Box sx={{ mt: 5 }}>
    <Button
      variant="contained"
      size="large"
      onClick={handleOpenRegister}
      sx={{
        backgroundColor: "#102E50",
        px: 4,
        py: 1.5,
        borderRadius: "30px",
        fontWeight: "bold",
        fontSize: "1rem",
        boxShadow: "0 4px 14px rgba(16, 46, 80, 0.4)",
        '&:hover': {
          backgroundColor: "#0c2342",
        }
      }}
    >
      Get Started
    </Button>
  </Box>





      {/* General Features Section */}
<Box sx={{ mt: 10, textAlign: 'center' }}>
  <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
    What You Can Expect
  </Typography>
  <Typography variant="subtitle1" sx={{ mb: 4 }}>
    Discover the benefits designed to help you succeed.
  </Typography>
  <Grid container spacing={4} justifyContent="center">
    {[
      {
        title: "Easy to Use",
        desc: "Intuitive interface designed for everyone — no tech skills required."
      },
      {
        title: "Flexible Templates",
        desc: "Pre-built forms and layouts you can customize in seconds."
      },
      {
        title: "Instant Insights",
        desc: "Real-time analytics help you make better decisions, faster."
      }
    ].map((feature, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 4,
            textAlign: 'left',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: 6
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

{/* Simple Steps Section */}
<Box sx={{ mt: 12, textAlign: 'center' }}>
  <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
    Just 3 Simple Steps
  </Typography>
  <Typography variant="subtitle1" sx={{ mb: 4 }}>
    Get started in minutes with these easy steps.
  </Typography>
  <Grid container spacing={4} justifyContent="center">
    {["Sign Up", "Create a Form", "Share & Analyze"].map((step, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'primary.light',
              color: 'white',
              transform: 'translateY(-4px)'
            }
          }}
        >
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '1.25rem',
              mb: 2
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


      {/* Graph Section */}
      <Box sx={{ mt: 10 }}>
        <Typography variant="h4" gutterBottom>Sample Analytics</Typography>

        <Grid container spacing={4} justifyContent="center">
          {/* Bar Chart */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Responses Over Time</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="responses" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Pie Chart */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Submission Types</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {pieColors.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Call to Action Footer */}
      <Box sx={{ mt: 10, p: 5, bgcolor: 'primary.main', color: 'white', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>Start Building Smarter Forms Today</Typography>
        <Button variant="outlined" color="inherit" onClick={handleOpenRegister}>
          Create Your Free Account
        </Button>
      </Box>

      {/* Register Modal */}
      <RegisterModal open={openRegister} handleClose={handleCloseRegister} />
    </Box>
  );
};

export default MainPage;
