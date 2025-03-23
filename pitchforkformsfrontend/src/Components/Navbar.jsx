import * as React from 'react';
import { useState } from 'react';
import { AppBar, Toolbar, Box, Avatar, Menu, MenuItem, ListItemIcon, Divider, IconButton, Typography, Tooltip, Button } from '@mui/material';
import Logout from '@mui/icons-material/Logout';
import LoginModal from './LoginModal';
import { useNavigate } from 'react-router';


export default function AccountMenu({ user, onLogout, onLoginSuccess }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [openLogin, setOpenLogin] = useState(false);

    const navigate = useNavigate();

    const handleOpenLogin = () => setOpenLogin(true);
    const handleCloseLogin = () => setOpenLogin(false);

    const open = Boolean(anchorEl);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleLoginSuccess = (userData) => {
        onLoginSuccess(userData); 
        setOpenLogin(false);
    };

    const handleLogoutClick = () => {
        handleClose();
        onLogout(); 
        navigate("/");
    };

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    background: 'linear-gradient(to bottom, rgba(50,50,50,0.8), rgba(30,30,30,0.6))',
                    backdropFilter: 'blur(10px)',
                    boxShadow: 'none',
                    zIndex: 1100,
                }}
            >
                <Toolbar sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', px: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                        <Typography
                            variant="h6"
                            sx={{ cursor: 'pointer', color: 'white', '&:hover': { opacity: 0.8 } }}
                        >
                            About
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{ cursor: 'pointer', color: 'white', '&:hover': { opacity: 0.8 } }}
                        >
                            Contact Us
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: '3rem' }}>
                            {user ? (
                                <>
                                <Typography
                                    sx={{ color: 'white', cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                                >
                                    {user.username || user.email}
                                </Typography>
                                <Tooltip title="Account settings">
                                    <IconButton onClick={handleClick} size="small">
                                        <Avatar sx={{ width: 36, height: 36 }}>
                                            {(user.username || user.email)?.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </IconButton>
                                </Tooltip>
                            </>
                            ) : (
                                <Button
                                    onClick={handleOpenLogin}
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#ffffff',
                                        color: '#333',
                                        fontWeight: 'bold',
                                        padding: '8px 20px',
                                        borderRadius: '8px',
                                        transition: '0.3s ease',
                                        '&:hover': { backgroundColor: '#dddddd' },
                                    }}
                                >
                                    Login
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box sx={{ height: 64 }} />

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            bgcolor: '#333',
                            color: 'white',
                            '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: '#333',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleClose}>
                    <Avatar /> Profile
                </MenuItem>
                <Divider sx={{ borderColor: 'grey' }} />
                <MenuItem onClick={handleLogoutClick}>
                    <ListItemIcon>
                        <Logout fontSize="small" sx={{ color: 'white' }} />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>

            <LoginModal open={openLogin} handleClose={handleCloseLogin} onLoginSuccess={handleLoginSuccess} />
        </>
    );
}
