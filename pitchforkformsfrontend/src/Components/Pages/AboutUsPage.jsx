import React from 'react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';

const AboutUsPage = () => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 8,
        px: 2,
        backgroundColor: '#9FB3DF', // Matches the main page background
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
          mb: 3,
          color: '#0B1D33', // Matches the main page title color
        }}
      >
        About Pitchfork Forms
      </Typography>

      <Typography
        variant="h6"
        sx={{
          maxWidth: 700,
          mx: 'auto',
          mb: 5,
          color: '#1d2e44', // Matches the main page subtitle color
          fontSize: '1.15rem',
        }}
      >
        Pitchfork Forms is a platform designed to simplify form creation, sharing, and evaluation. 
        Our mission is to empower educators, administrators, and students with tools that streamline workflows 
        and enhance productivity.
      </Typography>

      {/* Key Features Section */}
      <Box sx={{ mt: 6 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#0B1D33', // Matches the main page section header color
          }}
        >
          Key Features
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            {
              title: 'Intuitive Form Builder',
              description: 'Easily create custom forms with various question types and layouts.',
            },
            {
              title: 'Automated Grading',
              description: 'Save time with instant evaluation and feedback for submitted forms.',
            },
            {
              title: 'Role-Based Dashboards',
              description: 'Tailored experiences for admins, educators, and students.',
            },
            {
              title: 'Secure Authentication',
              description: 'Robust JWT-based login system ensures data security and reliability.',
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
                <Typography variant="body2">{feature.description}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Mission Section */}
      <Box sx={{ mt: 10 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#0B1D33', // Matches the main page section header color
          }}
        >
          Our Mission
        </Typography>
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: 'white', // White background for readability
            color: '#0B1D33', // Dark text for contrast
            maxWidth: 700,
            mx: 'auto',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.15rem',
              lineHeight: 1.9,
            }}
          >
            At Pitchfork Forms, we aim to simplify form management and enhance productivity. 
            By automating repetitive tasks and providing intuitive tools, we empower users to focus on what truly matters.
          </Typography>
        </Paper>
      </Box>

      {/* Technologies Section */}
      <Box sx={{ mt: 10 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#0B1D33', // Matches the main page section header color
          }}
        >
          Technologies We Use
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            {
              title: 'Frontend',
              description: 'Built with React and Material-UI for a modern, responsive interface.',
            },
            {
              title: 'Backend',
              description: 'Powered by Node.js and Express, with a MySQL database for secure data management.',
            },
            {
              title: 'Authentication',
              description: 'JWT-based login system with refresh tokens for seamless user sessions.',
            },
          ].map((tech, index) => (
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
                  {tech.title}
                </Typography>
                <Typography variant="body2">{tech.description}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Call to Action Section */}
      <Box
        sx={{
          mt: 10,
          p: 5,
          bgcolor: '#102E50', // Matches the main page footer background
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Ready to Get Started?
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Join us today and experience the smarter way to manage forms.
        </Typography>
        <Button
          variant="outlined"
          color="inherit"
          sx={{
            borderColor: 'white',
            color: 'white',
            '&:hover': {
              backgroundColor: '#0c2342',
              borderColor: 'white',
            },
          }}
        >
          Learn More
        </Button>
      </Box>
    </Box>
  );
};

export default AboutUsPage;