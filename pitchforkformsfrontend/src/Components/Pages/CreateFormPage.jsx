import React, { useState } from 'react';
import DefaultFormFormat from '../DefaultFormFormat';
import { Button, TextField, Box } from '@mui/material';
import axios from 'axios';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const CreateFormPage = () => {
  const [questions, setQuestions] = useState([]);
  const [formName, setFormName] = useState("");
  let accessToken = localStorage.getItem("accessToken");

  const handleAddQuestion = () => {
    setQuestions(prevQuestions => [
      ...prevQuestions,
      { text: "", type: "radiobutton", score: 0 }
    ]);
  };

  const handleDeleteQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleSaveForm = () => {
    // Alap validáció
    if (!formName.trim()) {
      alert("The form needs a name!");
      return;
    }

    if (questions.length === 0) {
      alert("You need to add minimum one question to the form!");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        alert(`The ${i + 1}. question's text is empty!`);
        return;
      }

      if (!q.answers || q.answers.length === 0) {
        alert(`The ${i + 1}. question does not have an answer!`);
        return;
      }

      const emptyAnswers = q.answers.filter(a => !a.text.trim());
      if (emptyAnswers.length > 0) {
        alert(`The ${i + 1}. contains empty answer fields!`);
        return;
      }
    }

    const formData = {
      name: formName,
      questions: questions.map(q => ({
        text: q.text,
        type: q.type,
        score: Number(q.score),
        answers: (q.answers || []).map(a => ({
          text: a.text,
          is_right: a.isCorrect
        }))
      }))
    };

    axios.post(
      'http://localhost:3000/form/save-forms',
      formData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
      .then(response => {
        console.log('Form saved:', response.data);
        alert('Form saved!');
      })
      .catch(error => {
        const message = error.response?.data?.message || 'Unknown error occured!';
        console.error('Error while saving form:', error);
        alert(`Error: ${message}`);
      });
  };

  const saveQuestionAttribute = (index, attribute, value) => {
    const updatedQuestions = questions.map((q, i) => {
      if (i === index) {
        return { ...q, [attribute]: value };
      }
      return q;
    });

    setQuestions(updatedQuestions);
  };

  return (
    <div>
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: 3,
        alignItems: 'center'
      }}>
        <TextField
          variant="outlined"
          label="Form Name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          sx={{
            flexGrow: 1,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#3f51b5',
              },
              '&:hover fieldset': {
                borderColor: '#303f9f',
              },
            },
          }}
        />
        <Button 
          onClick={handleSaveForm} 
          variant="contained" 
          color="primary"
          startIcon={<SaveIcon />}
          sx={{
            px: 3,
            py: 1.5,
            fontWeight: 'bold',
            textTransform: 'none',
            borderRadius: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              backgroundColor: '#303f9f',
            }
          }}
        >
          Save Form
        </Button>
      </Box>

      {questions.map((question, index) => (
        <DefaultFormFormat
          key={index}
          index={index}
          saveQuestionAttribute={saveQuestionAttribute}
          question={question}
          deleteQuestion={handleDeleteQuestion}
        />
      ))}

      <Button
        onClick={handleAddQuestion}
        variant="contained"
        color="secondary"
        startIcon={<AddCircleOutlineIcon />}
        sx={{
          mt: 2,
          px: 4,
          py: 1.5,
          fontWeight: 'bold',
          textTransform: 'none',
          borderRadius: 2,
          backgroundColor: '#4caf50',
          '&:hover': {
            backgroundColor: '#388e3c',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          }
        }}
      >
        Add Question
      </Button>
    </div>
  );
};

export default CreateFormPage;