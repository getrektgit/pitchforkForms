import React, { useState } from 'react';
import DefaultFormFormat from '../DefaultFormFormat';
import { Button, Input } from '@mui/material';


const CreateFormPage = () => {
  const [questions, setQuestions] = useState([]);

  const handleAddQuestion = () => {
    setQuestions(prevQuestions => [...prevQuestions, <DefaultFormFormat key={prevQuestions.length} />]);
  };

  return (
    <div>
      <div>
        <Input sx={{ backgroundColor: "white", marginRight:1 }} placeholder='Name of the form' />
        <Button variant='contained' sx={{ backgroundColor: "green" }}>Save</Button>
      </div>
      <br/>
      {questions.map((question, index) => (
        <div key={index}>{question}</div>
      ))}
      <Button onClick={handleAddQuestion} variant="contained">Add question</Button>
    </div>
  );
};

export default CreateFormPage;
