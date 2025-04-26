import React, { useState, useRef, useEffect } from 'react';
import DefaultFormFormat from '../DefaultFormFormat';
import {
  Button,
  TextField,
  Box,
  Container,
  Typography,
  Snackbar,
  Alert,
  Fab
} from '@mui/material';
import axios from 'axios';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useNavigate } from 'react-router-dom';

const CreateFormPage = () => {
  const [questions, setQuestions] = useState([]);
  const [formName, setFormName] = useState("");
  const [popup, setPopup] = useState({ open: false, severity: 'info', message: '' });
  const bottomRef = useRef(null);
  const navigate = useNavigate();
  let accessToken = localStorage.getItem("accessToken");

  const handleAddQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        text: "",
        type: "radiobutton",
        score: 0,
        isMultiple: false,
        answers: [{ text: "", isCorrect: false }]
      }
    ]);
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [questions.length]);

  const handleDeleteQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const showPopup = (message, severity = 'info') => {
    setPopup({ open: true, severity, message });
  };

  const handleClosePopup = () => {
    setPopup({ ...popup, open: false });
  };

  const handleSaveForm = () => {
    if (!formName.trim()) {
      showPopup("The form needs a name!", "warning");
      return;
    }
    if (questions.length === 0) {
      showPopup("You need to add at least one question!", "warning");
      return;
    }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        showPopup(`Question ${i + 1} is missing text!`, "warning");
        return;
      }
      if (!q.answers || q.answers.length === 0) {
        showPopup(`Question ${i + 1} has no answers!`, "warning");
        return;
      }
      const emptyAnswers = q.answers.filter(a => !a.text.trim());
      if (emptyAnswers.length > 0) {
        showPopup(`Question ${i + 1} has empty answer fields!`, "warning");
        return;
      }
    }

    const formData = {
      name: formName,
      questions: questions.map(q => ({
        text: q.text,
        type: q.isMultiple ? "checkbox" : "radiobutton",
        score: Number(q.score),
        answers: (q.answers || []).map(a => ({
          text: a.text,
          is_right: a.isCorrect
        }))
      }))
    };

    axios.post('/form/save-forms', formData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => {
        console.log('Form saved:', response.data);
        showPopup('Form saved successfully!', 'success');
        setTimeout(() => navigate("/admin"), 1500);
      })
      .catch(error => {
        const message = error.response?.data?.message || 'Unknown error occurred!';
        console.error('Error saving form:', error);
        showPopup(`Error: ${message}`, 'error');
      });
  };

  const saveQuestionAttribute = (index, attribute, value) => {
    const updated = questions.map((q, i) => (
      i === index ? { ...q, [attribute]: value } : q
    ));
    setQuestions(updated);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        Create a New Form
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

      {questions.map((question, index) => (
        <Box key={index} sx={{ mb: { xs: 4, md: 5 } }}>
          <DefaultFormFormat
            index={index}
            question={question}
            saveQuestionAttribute={saveQuestionAttribute}
            deleteQuestion={handleDeleteQuestion}
          />
        </Box>
      ))}

      <div ref={bottomRef} />

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 4, md: 6 } }}>
        <Button
          onClick={handleAddQuestion}
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

export default CreateFormPage;
