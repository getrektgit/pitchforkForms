import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import DefaultFormFormat from '../DefaultFormFormat';
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  Fab,
  Container
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const EditFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState({ open: false, severity: 'info', message: '' });
  const [formName, setFormName] = useState('');
  const bottomRef = useRef(null);
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        const res = await axios.post('/form/get-all', { form_id: id }, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        const processedQuestions = res.data.questions.map((q) => ({
          ...q,
          answers: q.answers.map((a) => ({
            ...a,
            isCorrect: a.is_right,
          })),
          isMultiple: q.answers.filter((a) => a.is_right).length > 1,
        }));

        setFormData({ ...res.data, questions: processedQuestions });
        setFormName(res.data.name);
      } catch (err) {
        showPopup(err.response?.data?.message || 'Failed to load form', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id, accessToken]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [formData?.questions?.length]);

  const showPopup = (message, severity = 'info') => {
    setPopup({ open: true, severity, message });
  };

  const handleClosePopup = () => {
    setPopup({ ...popup, open: false });
  };

  const saveQuestionAttribute = (index, key, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [key]: value };
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const addNewQuestion = () => {
    const newQuestion = {
      text: '',
      type: 'radiobutton',
      score: 0,
      answers: [{ text: '', isCorrect: false }],
      isMultiple: false
    };
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    });
  };

  const handleSaveForm = async () => {
    if (!formName.trim()) {
      showPopup('The form needs a name!', 'warning');
      return;
    }

    if (!formData.questions || formData.questions.length === 0) {
      showPopup('You need to add at least one question!', 'warning');
      return;
    }

    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      if (!q.text.trim()) {
        showPopup(`Question ${i + 1} is missing text!`, 'warning');
        return;
      }
      if (!q.answers || q.answers.length === 0) {
        showPopup(`Question ${i + 1} has no answers!`, 'warning');
        return;
      }
      const emptyAnswers = q.answers.filter(a => !a.text.trim());
      if (emptyAnswers.length > 0) {
        showPopup(`Question ${i + 1} has empty answer fields!`, 'warning');
        return;
      }
    }

    const payload = {
      name: formName,
      questions: formData.questions.map(q => ({
        id: q.id,
        text: q.text,
        type: q.isMultiple ? 'checkbox' : 'radiobutton',
        score: Number(q.score),
        answers: q.answers.map(a => ({
          text: a.text,
          is_right: a.isCorrect
        }))
      }))
    };

    try {
      await axios.put(`/form/update-form/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      showPopup('Form saved successfully!', 'success');
      setTimeout(() => navigate('/admin'), 1500);
    } catch (err) {
      showPopup(err.response?.data?.message || 'Failed to save form', 'error');
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 3, md: 6 },
        px: { xs: 2, md: 4 },
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontSize: { xs: '1.8rem', md: '2.5rem' },
          color: 'white',
          fontWeight: 'bold',
          mb: { xs: 3, md: 5 },
          textAlign: 'center',
        }}
      >
        Edit Form
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          mb: { xs: 3, md: 5 },
          alignItems: 'center',
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          label="Form Name"
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{ style: { color: 'white' } }}
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          sx={{
            flexGrow: 1,
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: '#90caf9' },
            },
          }}
        />
        <Button
          onClick={handleSaveForm}
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          sx={{
            mt: { xs: 2, md: 0 },
            px: { xs: 3, md: 4 },
            py: { xs: 1.5, md: 2 },
            fontWeight: 'bold',
            textTransform: 'none',
            borderRadius: 2,
            boxShadow: 2,
            whiteSpace: 'nowrap',
          }}
        >
          Save Form
        </Button>
      </Box>

      {formData.questions.map((question, index) => (
        <Box key={question.id ?? `new-${index}`} sx={{ mb: { xs: 4, md: 5 } }}>
          <DefaultFormFormat
            index={index}
            question={question}
            saveQuestionAttribute={saveQuestionAttribute}
            deleteQuestion={deleteQuestion}
          />
        </Box>
      ))}

      <div ref={bottomRef} />

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 4, md: 6 } }}>
        <Button
          onClick={addNewQuestion}
          variant="contained"
          color="success"
          startIcon={<AddCircleOutlineIcon />}
          sx={{
            px: { xs: 4, md: 6 },
            py: { xs: 1.5, md: 2 },
            fontWeight: 'bold',
            textTransform: 'none',
            borderRadius: 2,
            boxShadow: 3,
            '&:hover': {
              backgroundColor: 'success.dark',
            },
          }}
        >
          Add Question
        </Button>
      </Box>

      <Snackbar
        open={popup.open}
        autoHideDuration={4000}
        onClose={handleClosePopup}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClosePopup}
          severity={popup.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {popup.message}
        </Alert>
      </Snackbar>

      <Fab
        color="secondary"
        size="small"
        onClick={handleScrollToTop}
        sx={{
          position: 'fixed',
          bottom: { xs: 20, md: 30 },
          right: { xs: 20, md: 30 },
          zIndex: 1000,
          backgroundColor: '#ffffff22',
          '&:hover': {
            backgroundColor: '#ffffff44',
          }
        }}
      >
        <KeyboardArrowUpIcon sx={{ color: 'white' }} />
      </Fab>
    </Container>
  );
};

export default EditFormPage;
