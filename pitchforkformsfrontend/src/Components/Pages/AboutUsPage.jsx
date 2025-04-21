import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';

const AboutUsPage = () => {
  return (
    <Box
      sx={{
        padding: 4,
        maxWidth: '900px',
        margin: 'auto',
        backgroundColor: '#f4f7fb', // Világos, barátságos háttér
        minHeight: '100vh',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 5,
          backgroundColor: '#ffffff',
          color: '#1e1e1e',
          borderRadius: 4,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 800,
            textAlign: 'center',
            color: '#6366f1',
            mb: 3,
          }}
        >
          About Pitchfork Forms
        </Typography>

        <Divider sx={{ backgroundColor: '#c5cae9', mb: 4 }} />

        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.9 }}>
          Pitchfork Forms is a powerful platform that redefines how forms are created, shared, and graded.
          Designed for educators, students, and admins alike, it offers streamlined workflows,
          automated grading, and a smarter way to manage learning tools.
        </Typography>

        <SectionTitle text="Key Features" />
        <FeatureList
          items={[
            "Form Builder: Intuitive editor for custom forms with various question types.",
            "User Roles: Role-specific dashboards for admins and students.",
            "Automated Grading: Evaluate responses in real-time and deliver instant feedback.",
            "Secure Authentication: JWT and refresh token system ensures reliable and secure sessions.",
          ]}
        />

        <SectionTitle text="Our Mission" />
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.9 }}>
          We aim to equip organizations with intelligent tools that simplify form creation and enhance productivity.
          By cutting down manual processes and prioritizing user experience, we’re making learning and management more efficient.
        </Typography>

        <SectionTitle text="Technologies We Use" />
        <FeatureList
          items={[
            "Frontend: React with Material-UI for a fast, modern interface.",
            "Backend: Node.js + Express, with a MySQL database for data integrity and performance.",
            "Authentication: JWT-based login with token refresh for security and ease of use.",
          ]}
        />

        <SectionTitle text="Get Involved" />
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.9 }}>
          We’re always looking for feedback and contributors. Have ideas or want to help shape the future of Pitchfork Forms?
          Reach out or check out our codebase to join the journey.
        </Typography>
      </Paper>
    </Box>
  );
};

// Külön komponens a szekciócímekhez
const SectionTitle = ({ text }) => (
  <Typography
    variant="h5"
    gutterBottom
    sx={{ fontWeight: 'bold', color: '#6c63ff', mt: 5 }}
  >
    {text}
  </Typography>
);

// Külön komponens a felsorolásokhoz
const FeatureList = ({ items }) => (
  <Box component="ul" sx={{ pl: 3, mb: 2 }}>
    {items.map((item, idx) => (
      <Typography key={idx} component="li" variant="body1" sx={{ fontSize: '1.05rem', mb: 1.5 }}>
        {item}
      </Typography>
    ))}
  </Box>
);

export default AboutUsPage;
