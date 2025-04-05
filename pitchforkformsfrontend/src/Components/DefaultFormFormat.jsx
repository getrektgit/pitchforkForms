import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Input,
    Button,
    TextField,
    Checkbox,
    Radio,
    IconButton,
    Box,
} from '@mui/material';
import React, { useState } from 'react';

const DefaultFormFormat = ({ index, saveQuestionAttribute, question, deleteQuestion }) => {
    const [answers, setAnswers] = useState(question.answers || []);
    const [isMultiple, setIsMultiple] = useState(question.isMultiple || false);

    const handleAddAnswer = () => {
        const newAnswer = { text: '', isCorrect: false };
        const updatedAnswers = [...answers, newAnswer];
        setAnswers(updatedAnswers);
        saveQuestionAttribute(index, 'answers', updatedAnswers);
    };

    const handleDeleteAnswer = (answerIndex) => {
        const updatedAnswers = answers.filter((_, i) => i !== answerIndex);
        setAnswers(updatedAnswers);
        saveQuestionAttribute(index, 'answers', updatedAnswers);
    };

    const handleAnswerChange = (answerIndex, key, value) => {
        let updatedAnswers;
        if (key === 'isCorrect' && !isMultiple) {
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
        saveQuestionAttribute(index, 'answers', updatedAnswers);
    };

    const handleIsMultipleChange = () => {
        const newIsMultiple = !isMultiple;
        setIsMultiple(newIsMultiple);
        saveQuestionAttribute(index, 'isMultiple', newIsMultiple);

        if (!newIsMultiple) {
            const updatedAnswers = answers.map((answer, i) => ({
                ...answer,
                isCorrect: i === 0,
            }));
            setAnswers(updatedAnswers);
            saveQuestionAttribute(index, 'answers', updatedAnswers);
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, marginBottom: 2 }}>
            <Box sx={{ flexGrow: 1 }}>
                <Accordion sx={{ width: '100%' }}>
                    <AccordionSummary
                        expandIcon={<ArrowDownwardIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <Typography component="span" sx={{ flexGrow: 1 }}>
                            Question {index + 1}
                        </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                        <TextField
                            placeholder="Write your question here"
                            value={question.text}
                            onChange={(e) =>
                                saveQuestionAttribute(index, 'text', e.target.value)
                            }
                            sx={{ maxWidth: 800, width: 800 }}
                        />
                    </AccordionDetails>

                    <AccordionDetails>
                        <Typography>Allow Multiple Answers</Typography>
                        <Checkbox
                            checked={isMultiple}
                            onChange={handleIsMultipleChange}
                            sx={{ marginLeft: 2 }}
                        />
                    </AccordionDetails>

                    <AccordionDetails>
                        <Typography>Score</Typography>
                        <Input
                            type="number"
                            onChange={(e) =>
                                saveQuestionAttribute(index, 'score', e.target.value)
                            }
                            value={question.score}
                        />
                    </AccordionDetails>

                    {answers.map((answer, answerIndex) => (
                        <AccordionDetails
                            key={answerIndex}
                            sx={{ display: 'flex', alignItems: 'center' }}
                        >
                            {isMultiple ? (
                                <Checkbox
                                    checked={answer.isCorrect}
                                    onChange={(e) =>
                                        handleAnswerChange(answerIndex, 'isCorrect', e.target.checked)
                                    }
                                />
                            ) : (
                                <Radio
                                    name={`question-${index}`}
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
                            <IconButton
                                onClick={() => handleDeleteAnswer(answerIndex)}
                                color="error"
                                sx={{ marginLeft: 1 }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </AccordionDetails>
                    ))}

                    <AccordionDetails>
                        <Button variant="contained" onClick={handleAddAnswer}>
                            Add Answer
                        </Button>
                    </AccordionDetails>
                </Accordion>
            </Box>

            <IconButton onClick={() => deleteQuestion(index)} color="error" sx={{ marginTop: 1 }}>
                <DeleteIcon />
            </IconButton>
        </Box>
    );
};

export default DefaultFormFormat;
