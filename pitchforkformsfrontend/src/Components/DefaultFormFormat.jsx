import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Input, Button, TextField, Checkbox, Radio } from '@mui/material';
import React, { useState } from 'react';

const DefaultFormFormat = ({ index, saveQuestionAttribute, question }) => {
    const [answers, setAnswers] = useState(question.answers || []); // Initialize answers state
    const [isMultiple, setIsMultiple] = useState(question.isMultiple || false); // Track if multiple answers are allowed

    const handleAddAnswer = () => {
        const newAnswer = { text: '', isCorrect: false };
        setAnswers((prevAnswers) => [...prevAnswers, newAnswer]);
        saveQuestionAttribute(index, 'answers', [...answers, newAnswer]); // Update parent state
    };

    const handleAnswerChange = (answerIndex, key, value) => {
        let updatedAnswers;

        if (key === 'isCorrect' && !isMultiple) {
            // Ensure only one answer is marked as correct for single-answer questions
            updatedAnswers = answers.map((answer, i) => ({
                ...answer,
                isCorrect: i === answerIndex ? value : false,
            }));
        } else {
            updatedAnswers = answers.map((answer, i) =>
                i === answerIndex ? { ...answer, [key]: value } : answer
            );
        }

        setAnswers(updatedAnswers);
        saveQuestionAttribute(index, 'answers', updatedAnswers); // Update parent state
    };

    const handleIsMultipleChange = () => {
        const newIsMultiple = !isMultiple;
        setIsMultiple(newIsMultiple);
        saveQuestionAttribute(index, 'isMultiple', newIsMultiple); // Update parent state

        // If switching to single-answer mode, ensure only one answer is marked as correct
        if (!newIsMultiple) {
            const updatedAnswers = answers.map((answer, i) => ({
                ...answer,
                isCorrect: i === 0, // Mark only the first answer as correct
            }));
            setAnswers(updatedAnswers);
            saveQuestionAttribute(index, 'answers', updatedAnswers);
        }
    };

    return (
        <div>
            <Accordion sx={{ width: '100%' }}>
                <AccordionSummary
                    expandIcon={<ArrowDownwardIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Typography component="span">Question {index + 1}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <TextField
                        placeholder="Write your question here"
                        value={question.text}
                        onChange={(e) => saveQuestionAttribute(index, 'text', e.target.value)}
                        sx={{ maxWidth: 800, width: 800 }}
                    />
                </AccordionDetails>
                <AccordionDetails>
                    <Typography>Score</Typography>
                    <Input
                        type="number"
                        onChange={(e) => saveQuestionAttribute(index, 'score', e.target.value)}
                        value={question.score}
                    />
                </AccordionDetails>
                <AccordionDetails>
                    <Typography>Answers</Typography>
                    <Button
                        variant="contained"
                        onClick={handleAddAnswer}
                        sx={{ marginLeft: 2 }}
                    >
                        Add Answer
                    </Button>
                </AccordionDetails>
                <AccordionDetails>
                    <Typography>Allow Multiple Answers</Typography>
                    <Checkbox
                        checked={isMultiple}
                        onChange={handleIsMultipleChange}
                        sx={{ marginLeft: 2 }}
                    />
                </AccordionDetails>
                {answers.map((answer, answerIndex) => (
                    <AccordionDetails key={answerIndex} sx={{ display: 'flex', alignItems: 'center' }}>
                        {isMultiple ? (
                            <Checkbox
                                checked={answer.isCorrect}
                                onChange={(e) =>
                                    handleAnswerChange(answerIndex, 'isCorrect', e.target.checked)
                                }
                            />
                        ) : (
                            <Radio
                                name={`question-${index}`} // Group radios by question index
                                checked={answer.isCorrect}
                                onChange={(e) =>
                                    handleAnswerChange(answerIndex, 'isCorrect', e.target.checked)
                                }
                            />
                        )}
                        <TextField
                            placeholder="Answer text"
                            value={answer.text}
                            onChange={(e) =>
                                handleAnswerChange(answerIndex, 'text', e.target.value)
                            }
                            sx={{ marginLeft: 2, flex: 1 }}
                        />
                    </AccordionDetails>
                ))}
            </Accordion>
            <br />
        </div>
    );
};

export default DefaultFormFormat;