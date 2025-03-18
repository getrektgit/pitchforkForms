import React, { useState } from 'react';
import DefaultFormFormat from '../DefaultFormFormat';
import { Button, Input } from '@mui/material';


const CreateFormPage = () => {
  const [questions, setQuestions] = useState([]);

  const handleAddQuestion = () => {
    setQuestions(prevQuestions => [...prevQuestions, { text: "", type: "radiobutton", score: 0 }]);
  };

  const saveQuestionAttribute = (index, attribute, value) => {
    const changedQuestions = questions
    changedQuestions[index][attribute] = value

    setQuestions(changedQuestions)
  }

  return (
    <div>
      <div>
        <Input sx={{ backgroundColor: "white", marginRight: 1 }} placeholder='Name of the form' />
        <Button variant='contained' sx={{ backgroundColor: "green" }}>Save</Button>
      </div>
      <br />
      {questions.map((question, index) => (
        <DefaultFormFormat key={index} saveQuestionAttribute={saveQuestionAttribute} question={question}></DefaultFormFormat>
      ))}
      <Button onClick={handleAddQuestion} variant="contained">Add question</Button>
    </div>
  );
};

export default CreateFormPage;
