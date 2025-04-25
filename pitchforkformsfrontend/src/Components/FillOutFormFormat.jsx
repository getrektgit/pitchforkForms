import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Checkbox,
  TextField
} from '@mui/material';

const FillOutFormFormat = ({ question, index, handleAnswerChange, answersState }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {index + 1}. {question.text}
      </Typography>

      <FormControl component="fieldset" fullWidth>
        <FormLabel component="legend">
          {question.isMultiple ? 'Select all correct answers:' : 'Select one correct answer:'}
        </FormLabel>

        {question.isMultiple ? (
          question.answers.map((answer, answerIndex) => (
            <FormControlLabel
              key={answer.id}
              control={
                <Checkbox
                  checked={answersState.includes(answer.id)}
                  onChange={(e) => handleAnswerChange(index, answer.id, e.target.checked)}
                />
              }
              label={answer.text}
            />
          ))
        ) : (
          <RadioGroup
            value={answersState}
            onChange={(e) => handleAnswerChange(index, Number(e.target.value), true)}
          >
            {question.answers.map((answer) => (
              <FormControlLabel
                key={answer.id}
                value={answer.id}
                control={<Radio />}
                label={answer.text}
              />
            ))}
          </RadioGroup>
        )}
      </FormControl>
    </Box>
  );
};

export default FillOutFormFormat;