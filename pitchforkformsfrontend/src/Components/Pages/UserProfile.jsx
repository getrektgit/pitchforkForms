import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  CircularProgress,
  Stack,
} from '@mui/material';

const UserProfile = () => {
  const { id } = useParams();
  const accessToken = localStorage.getItem('accessToken');

  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    profile_pic: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/user/userbyid/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setUserData(response.data);
        setFormData({
          email: response.data.email,
          username: response.data.username,
          profile_pic: response.data.profile_pic || '',
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id, accessToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/user/users/${id}`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUserData(formData);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ mt: 10, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!userData) {
    return (
      <Box sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h6">No user data found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 600, margin: 'auto' }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4, backgroundColor: '#fefefe' }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom color="primary">
          User Profile
        </Typography>

        {editMode ? (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Stack spacing={3}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                label="Profile Picture URL"
                name="profile_pic"
                value={formData.profile_pic}
                onChange={handleInputChange}
                fullWidth
              />

              <Stack direction="row" spacing={2} justifyContent="center">
                <Button variant="contained" type="submit" color="primary">
                  Save
                </Button>
                <Button variant="outlined" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Avatar
              src={userData.profile_pic}
              alt="Profile"
              sx={{ width: 100, height: 100, margin: 'auto', mb: 2 }}
            />
            <Typography variant="h6">
              <strong>Email:</strong> {userData.email}
            </Typography>
            <Typography variant="h6">
              <strong>Username:</strong> {userData.username}
            </Typography>
            <Typography variant="h6">
              <strong>Role:</strong> {userData.role}
            </Typography>

            <Button
              variant="contained"
              color="secondary"
              onClick={() => setEditMode(true)}
              sx={{ mt: 3 }}
            >
              Edit Profile
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default UserProfile;
