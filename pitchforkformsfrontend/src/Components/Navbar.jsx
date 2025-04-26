import * as React from 'react';
import { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Box,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    Divider,
    IconButton,
    Typography,
    Tooltip,
    Button,
    Drawer,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Logout from '@mui/icons-material/Logout';
import LoginModal from './LoginModal';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';

export default function Navbar({ user, onLogout, onLoginSuccess }) {
    const rolesEnum = { ADMIN: "admin", STUDENT: "student", NOUSER: "noUser", EVERYONE: "everyone" };

    if (!user) {
        user = { role: rolesEnum.NOUSER }
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const [openLogin, setOpenLogin] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const navigate = useNavigate();

    const links = [
        { role: rolesEnum.NOUSER, label: "Home", route: "/" },
        { role: rolesEnum.NOUSER, label: "About us", route: "/about-us" },
        { role: rolesEnum.STUDENT, label: "Student page", route: "/student" },
        { role: rolesEnum.STUDENT, label: "Completed Forms", route: '/completed-forms' },
        { role: rolesEnum.ADMIN, label: "Create Form", route: "/admin/create-form" },
        { role: rolesEnum.ADMIN, label: "Forms", route: "/admin" },
        { role: rolesEnum.ADMIN, label: "Students", route: "/admin/all-students" },
    ];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleOpenLogin = () => setOpenLogin(true);
    const handleCloseLogin = () => setOpenLogin(false);

    const open = Boolean(anchorEl);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleLoginSuccess = (userData) => {
        onLoginSuccess(userData);
        setCurrentUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setOpenLogin(false);
    };

    const handleLogoutClick = () => {
        try {
            axios.post('/auth/logout', {}, { withCredentials: true });
        } catch (error) {
            console.error("Error during logout:", error);
        }
        handleClose();
        onLogout();
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        setCurrentUser(null);
        navigate("/");
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                Menu
            </Typography>
            <Divider />
            <List>
                {links.filter(link => link.role === user.role || link.role === "everyone").map((link) => (
                    <ListItem button key={link.label} onClick={() => navigate(link.route)}>
                        <ListItemText primary={link.label} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

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
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3 }}>
                    {/* Hamburger ikon mobilra */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ display: { xs: 'block', md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Linkek desktop nézetben */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: '3rem' }}>
                        {links.filter(link => link.role === user.role || link.role === "everyone").map((link) => (
                            <Link to={link.route} key={link.label}>
                                <Button sx={{ color: 'white' }}>{link.label}</Button>
                            </Link>
                        ))}
                    </Box>

                    {/* Jobb oldali rész (login/avatar) */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {currentUser ? (
                            <>
                                <Typography
                                    sx={{ color: 'white', cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                                >
                                    {currentUser.username || currentUser.email}
                                </Typography>
                                <Tooltip title="Account settings">
                                    <IconButton onClick={handleClick} size="small">
                                        <Avatar sx={{ width: 36, height: 36 }}>
                                            {(currentUser.username || currentUser.email)?.charAt(0).toUpperCase()}
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
                </Toolbar>
            </AppBar>

            {/* Drawer mobil nézetben */}
            <Box component="nav">
                <Drawer
                    anchor="left"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Hely fenntartása az AppBar miatt */}
            <Box sx={{ height: 64 }} />

            {/* Profil menü */}
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
                <MenuItem onClick={() => { handleClose(); navigate(`/user/profile/${currentUser.id}`); }}>
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

            {/* Login Modal */}
            <LoginModal open={openLogin} handleClose={handleCloseLogin} onLoginSuccess={handleLoginSuccess} />
        </>
    );
}
