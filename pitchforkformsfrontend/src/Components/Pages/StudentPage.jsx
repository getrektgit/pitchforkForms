import axios from 'axios';
import React, { useState, useEffect } from 'react';
import FormCard from '../FormCard';
import { Box, Grid, Typography, CircularProgress, Alert } from '@mui/material';

const StudentPage = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accessToken = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/user/pending/${user.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setForms(response.data.forms);
      } catch (error) {
        console.error('Error fetching forms:', error);
        setError(error.response?.data?.message || 'Error loading forms');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [accessToken, user?.id]);


  return (
    <Box sx={{
      padding: { xs: 2, sm: 3, md: 4 },
      minHeight: '80vh'
    }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Available Forms
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress size={60} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : forms.length === 0 ? (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '300px',
          textAlign: 'center',
          gap: 2
        }}>
          <Typography variant="h6" color="#ffffff">
            No forms available for you yet.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {forms.map((form) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={form.id} margin={6}>
              <FormCard formName={form.name} formId={form.id} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default StudentPage;
