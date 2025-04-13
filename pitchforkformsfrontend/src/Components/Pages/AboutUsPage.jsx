import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';

const AboutUsPage = () => {
  return (
    <Box
      sx={{
        padding: 4,
        maxWidth: '900px',
        margin: 'auto',
        backgroundColor: '#121212', // Dark background
        minHeight: '100vh',
      }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: 4,
          backgroundColor: '#1E1E1E', // Slightly lighter than background
          color: '#f0f0f0', // Light text for contrast
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#90caf9', // Light blue accent
            marginBottom: 2,
          }}
        >
          About Pitchfork Forms
        </Typography>

        <Divider sx={{ backgroundColor: '#90caf9', marginBottom: 3 }} />

        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          Pitchfork Forms is a powerful platform that redefines how forms are created, shared, and graded.
          Designed for educators, students, and admins alike, it offers streamlined workflows,
          automated grading, and a smarter way to manage learning tools.
        </Typography>

        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#bb86fc', marginTop: 4 }}
        >
          Key Features
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          • Form Builder: Intuitive editor for custom forms with various question types.
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          • User Roles: Role-specific dashboards for admins and students.
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          • Automated Grading: Evaluate responses in real-time and deliver instant feedback.
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          • Secure Authentication: JWT and refresh token system ensures reliable and secure sessions.
        </Typography>

        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#bb86fc', marginTop: 4 }}
        >
          Our Mission
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          We aim to equip organizations with intelligent tools that simplify form creation and enhance productivity.
          By cutting down manual processes and prioritizing user experience, we’re making learning and management more efficient.
        </Typography>

        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#bb86fc', marginTop: 4 }}
        >
          Technologies We Use
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          • Frontend: React with Material-UI for a fast, modern interface.
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          • Backend: Node.js + Express, with a MySQL database for data integrity and performance.
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          • Authentication: JWT-based login with token refresh for security and ease of use.
        </Typography>

        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#bb86fc', marginTop: 4 }}
        >
          Get Involved
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          We’re always looking for feedback and contributors. Have ideas or want to help shape the future of Pitchfork Forms?
          Reach out or check out our codebase to join the journey.
        </Typography>
      </Paper>
    </Box>
  );
};

export default AboutUsPage;