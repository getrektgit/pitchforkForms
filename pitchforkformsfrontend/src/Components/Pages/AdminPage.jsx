import axios from 'axios';
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Box, Grid, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const FormCard = lazy(() => import('../FormCard'));
const AddIcon = lazy(() => import('@mui/icons-material/Add'));

const AdminPage = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accessToken = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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
        console.error('Error fetching forms:', error);
        setError(error.response?.data?.message || 'Error loading forms');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken, user?.id]);

  const handleCreateNew = () => {
    navigate('/admin/create-form');
  };

  return (
    <Box sx={{ padding: { xs: 2, sm: 3, md: 4 }, minHeight: '80vh' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          My Forms
        </Typography>
        <Suspense fallback={<span />}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Create New
          </Button>
        </Suspense>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress size={60} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : forms.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            textAlign: 'center',
            gap: 2,
          }}
        >
          <Typography variant="h6" color="#ffffff">
            You don't have any forms yet
          </Typography>
          <Suspense fallback={<span />}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleCreateNew}
            >
              Create your first form
            </Button>
          </Suspense>
        </Box>
      ) : (
        <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}>
          <Grid container spacing={3}>
            {forms.map((form) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={form.id} margin={6}>
                <FormCard
                  formName={form.name}
                  formId={form.id}
                  isEditDisabled={form.isFilledOutAtLeastOnce}
                />
              </Grid>
            ))}
          </Grid>
        </Suspense>
      )}
    </Box>
  );
};

export default AdminPage;