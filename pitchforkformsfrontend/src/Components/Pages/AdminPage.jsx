import axios from 'axios';
import React, { useState, useEffect } from 'react';
import FormCard from '../FormCard';
import { Box, Grid, Typography } from '@mui/material';

const AdminPage = () => {
  const [forms, setForms] = useState([]);
  const accessToken = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/form/get-basic-info', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          params: {
            userId: user.id,
          },
        });
        setForms(response.data);
      } catch (error) {
        console.error('Hiba az adatok lekérésekor:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Forms
      </Typography>

      <Grid container spacing={3}>
        {forms.map((form) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={form.id}>
            <FormCard formName={form.name} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminPage;
