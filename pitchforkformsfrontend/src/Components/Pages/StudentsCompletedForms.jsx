import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
} from '@mui/material';
import { Visibility } from '@mui/icons-material';

const StudentsCompletedFormsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchStudentForms = async () => {
      try {
        const response = await axios.get(`/form/admin/students-forms/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setStudentData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching student forms:', error);
        setError(error.response?.data?.message || 'Failed to fetch student forms.');
        setLoading(false);
      }
    };

    fetchStudentForms();
  }, [id, accessToken]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', backgroundColor: '#1A2238', color: '#FFFFFF' }}>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight={600} color="white">
          Forms sent out to - {studentData.username}
        </Typography>
        <Button variant="outlined" color="inherit" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Stack>

      {studentData.forms.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', backgroundColor: '#1A2238', color: '#FFFFFF' }}>
          <Typography variant="h6">No forms found for this student.</Typography>
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          elevation={4}
          sx={{
            borderRadius: 3,
            backgroundColor: '#1A2238',
          }}
        >
          <Table sx={{ minWidth: 750 }} aria-label="completed forms table">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#0F172A' }}>
                {['Form Name', 'Status', 'Submitted At', 'Score'].map((head) => (
                  <TableCell
                    key={head}
                    sx={{
                      color: '#FFFFFF',
                      fontWeight: 'bold',
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {studentData.forms.map((form, index) => (
                <TableRow
                  key={index}
                  hover
                  sx={{
                    transition: 'background-color 0.3s',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' },
                  }}
                >
                  <TableCell sx={{ color: 'rgba(255,255,255,0.87)' }}>{form.formName}</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.87)', textTransform: 'capitalize' }}>
                    {form.status}
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.87)' }}>
                    {form.status === 'completed'
                      ? new Date(form.submitTime).toLocaleString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.87)' }}>
                    {form.status === 'completed'
                      ? `${form.totalScore} / ${form.maxPoints}`
                      : 'N/A'}
                  </TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default StudentsCompletedFormsPage;
