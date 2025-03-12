import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import Carousel from './Carousel';
import LoginModal from './LoginModal';
import { useState } from 'react';

const MainPage = () => {
    const [openLogin, setOpenLogin] = useState(false); // Manage the open/close state of the modal
  
    const handleOpenLogin = () => setOpenLogin(true);
    const handleCloseLogin = () => setOpenLogin(false);
  
    return (
      <Box sx={{ textAlign: "center", padding: 3 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Pitchfork Forms
        </Typography>
        <Typography variant="h6" color="white" sx={{ maxWidth: 600, margin: "auto", mb: 3 }}>
          Get started with **Pitchfork Forms** to create, share, and evaluate interactive forms with ease.
          Save time with automated grading, track progress effortlessly, and simplify learning like never before.
        </Typography>
        <Carousel />
        
        {/* Get Started Button */}
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleOpenLogin} // Open the modal when clicked
          >
            Get Started
          </Button>
        </Box>
  
        {/* Login Modal (Popup) */}
        <LoginModal open={openLogin} handleClose={handleCloseLogin} />
      </Box>
    );
  };
  
  export default MainPage;  
