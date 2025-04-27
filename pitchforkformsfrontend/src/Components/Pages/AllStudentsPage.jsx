import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  CircularProgress,
  Box,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const AllStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [accessToken]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/user/users`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setStudents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleViewCompletedForms = (studentId) => {
    navigate(`/admin/student-forms/${studentId}`);
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/user/users/${studentToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setStudents(students.filter((student) => student.id !== studentToDelete.id));
      setSnackbarMessage('User successfully deleted!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting user:', error);
      setSnackbarMessage(error.response?.data?.message || 'Error deleting user');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setStudentToDelete(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

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
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', backgroundColor: '#1A2238', color: 'white' }}>
          <Typography color="error" variant="h6">
            Error: {error}
          </Typography>
        </Paper>
      </Container>
    );
  }

  if (!students || students.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', backgroundColor: '#1A2238', color: 'white' }}>
          <Typography variant="h6">No students found</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight={600} color="white">
          Student List
        </Typography>
      </Stack>

      <TableContainer
        component={Paper}
        elevation={4}
        sx={{ borderRadius: 3, backgroundColor: '#1A2238' }}
      >
        <Table sx={{ minWidth: 750 }} aria-label="students table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#0F172A' }}>
              {['Profile', 'Username', 'Email', 'Role', 'Actions'].map((head) => (
                <TableCell
                  key={head}
                  sx={{ color: '#FFFFFF', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow
                key={student.id}
                hover
                sx={{
                  transition: 'background-color 0.3s',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' },
                }}
              >
                <TableCell>
                  <Avatar
                    src={student.profile_pic || ''}
                    alt={student.username}
                    sx={{ width: 40, height: 40 }}
                  />
                </TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.87)' }}>{student.username}</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.87)' }}>{student.email}</TableCell>
                <TableCell>
                  <Chip
                    label={student.role}
                    size="small"
                    sx={{
                      backgroundColor: student.role === 'teacher' ? '#6366F1' : '#475569',
                      color: 'white',
                      fontWeight: 500,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      aria-label="delete"
                      color="error"
                      onClick={() => handleDeleteClick(student)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleViewCompletedForms(student.id)}
                    >
                      View Forms
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: { backgroundColor: '#1A2238', color: 'white' },
        }}
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Are you sure you want to delete user <b>{studentToDelete?.username}</b>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AllStudentsPage;
