import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import DefaultFormFormat from '../DefaultFormFormat';
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  Paper,
  IconButton,
  Tooltip,
  Container
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const EditFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formName, setFormName] = useState("");
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        const res = await axios.post(
          '/form/get-all',
          { form_id: id },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const processedQuestions = res.data.questions.map((q) => ({
          ...q,
          answers: q.answers.map((a) => ({
            ...a,
            isCorrect: a.is_right,
          })),
          isMultiple: q.answers.filter((a) => a.is_right).length > 1,
        }));

        setFormData({
          ...res.data,
          questions: processedQuestions,
        });
        setFormName(res.data.name);
      } catch (err) {
        console.error('Error fetching form:', err);
        setError(err.response?.data?.message || 'Failed to load form');
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id, accessToken]);

  const saveQuestionAttribute = (index, key, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [key]: value,
    };
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const addNewQuestion = () => {
    const newQuestion = {
      text: "",
      type: "radiobutton",
      score: 0,
      answers: [],
      isMultiple: false
    };
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    });
  };

  const handleSaveForm = async () => {
    try {
      if (!formName.trim()) {
        setError("Form name is required");
        return;
      }

      if (!formData.questions || formData.questions.length === 0) {
        setError("At least one question is required");
        return;
      }

      for (let i = 0; i < formData.questions.length; i++) {
        const q = formData.questions[i];
        if (!q.text.trim()) {
          setError(`Question ${i + 1} text is empty`);
          return;
        }

        if (!q.answers || q.answers.length === 0) {
          setError(`Question ${i + 1} has no answers`);
          return;
        }

        const emptyAnswers = q.answers.filter(a => !a.text.trim());
        if (emptyAnswers.length > 0) {
          setError(`Question ${i + 1} has empty answers`);
          return;
        }

        if (!q.answers.some(a => a.isCorrect)) {
          setError(`Question ${i + 1} has no correct answer`);
          return;
        }
      }

      // Payload összeállítása
      const payload = {
        name: formName,
        questions: formData.questions.map(q => ({
          id: q.id, // Ha új kérdés, undefined marad – ez jó
          text: q.text,
          type: q.type,
          score: Number(q.score),
          answers: q.answers.map(a => ({
            text: a.text,
            is_right: a.isCorrect
          }))
        }))
      };

      await axios.put(
        `/form/update-form/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }
      );

      setSuccess(true);
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      console.error('Error saving form:', err);
      setError(err.response?.data?.message || 'Failed to save form');
    }
  };
  const handleCloseAlert = () => {
    setError(null);
    setSuccess(false);
  };
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error && !formData) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Edit Form
          </Typography>
          <Tooltip title="Back to forms">
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            label="Form Name"
            variant="outlined"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            sx={{ mb: 2 }}
          />
        </Box>

        {formData?.questions?.map((question, index) => (
          <Box key={question.id ?? `new-${index}`} sx={{ mb: 3 }}>
            <DefaultFormFormat
              index={index}
              question={question}
              saveQuestionAttribute={saveQuestionAttribute}
              deleteQuestion={deleteQuestion}
            />
          </Box>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddCircleOutlineIcon />}
            onClick={addNewQuestion}
            sx={{ px: 4 }}
          >
            Add Question
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveForm}
            sx={{ px: 4 }}
          >
            Save Form
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          Form saved successfully! Redirecting...
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditFormPage;