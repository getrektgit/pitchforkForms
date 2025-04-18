import React, { useState } from 'react';
import DefaultFormFormat from '../DefaultFormFormat';
import { Button, Input } from '@mui/material';
import axios from 'axios';

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
      alert("A feladatlapnak szüksége van névre!");
      return;
    }

    if (questions.length === 0) {
      alert("Legalább egy kérdést hozzá kell adni!");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        alert(`A(z) ${i + 1}. kérdés szövege üres!`);
        return;
      }

      if (!q.answers || q.answers.length === 0) {
        alert(`A(z) ${i + 1}. kérdésnek nincs válaszlehetősége!`);
        return;
      }

      const emptyAnswers = q.answers.filter(a => !a.text.trim());
      if (emptyAnswers.length > 0) {
        alert(`A(z) ${i + 1}. kérdés tartalmaz üres válaszokat!`);
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
        alert('Űrlap sikeresen elmentve!');
      })
      .catch(error => {
        const message = error.response?.data?.message || 'Ismeretlen hiba történt!';
        console.error('Hiba az űrlap mentése közben:', error);
        alert(`Hiba történt: ${message}`);
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
      <div>
        <Input
          sx={{ backgroundColor: "white", marginRight: 1 }}
          onChange={(e) => setFormName(e.target.value)}
          value={formName}
          placeholder='Name of the form'
        />
        <Button onClick={handleSaveForm} variant='contained' sx={{ backgroundColor: "green" }}>Save</Button>
      </div>
      <br />
      {questions.map((question, index) => (
        <DefaultFormFormat
          key={index}
          index={index}
          saveQuestionAttribute={saveQuestionAttribute}
          question={question}
          deleteQuestion={handleDeleteQuestion}
        />
      ))}
      <Button onClick={handleAddQuestion} variant="contained">Add question</Button>
    </div>
  );
};

export default CreateFormPage;
