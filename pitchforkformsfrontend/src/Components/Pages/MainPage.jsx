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
    <Box sx={{ textAlign: "center", padding: 3 }}>
      {/* Header */}
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        Pitchfork Forms
      </Typography>
      <Typography variant="h6" color="white" sx={{ maxWidth: 600, margin: "auto", mb: 3 }}>
        Get started with Pitchfork Forms to create, share, and evaluate interactive forms with ease.
        Save time with automated grading, track progress effortlessly, and simplify learning like never before.
      </Typography>

      {/* Carousel */}
      <Carousel />

      {/* Get Started Button */}
      <Box sx={{ mt: 3 }}>
        <Button variant="contained" size="large" onClick={handleOpenRegister}>
          Get Started
        </Button>
      </Box>

      {/* General Features Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom>What You Can Expect</Typography>
        <Grid container spacing={3} justifyContent="center">
          {["Easy to Use", "Flexible Templates", "Instant Insights"].map((feature, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Paper elevation={3} sx={{ p: 3, minHeight: 120 }}>
                <Typography variant="h6" fontWeight="bold">{feature}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Simple Steps Section */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>Just 3 Simple Steps</Typography>
        <Grid container spacing={2} justifyContent="center">
          {["Sign up", "Create a Form", "Share & Analyze"].map((step, index) => (
            <Grid item key={index}>
              <Paper elevation={2} sx={{ p: 2, width: 200 }}>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  {index + 1}
                </Typography>
                <Typography variant="subtitle1">{step}</Typography>
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
