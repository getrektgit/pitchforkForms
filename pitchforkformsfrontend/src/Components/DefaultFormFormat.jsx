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
    FormControl,
    FormHelperText,
    Alert,
    Tooltip
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const DefaultFormFormat = ({ index, saveQuestionAttribute, question, deleteQuestion }) => {
    const [answers, setAnswers] = useState(question.answers || []);
    const [isMultiple, setIsMultiple] = useState(question.isMultiple || false);
    const [errors, setErrors] = useState({
        questionText: false,
        answers: [],
        score: false,
        noCorrectAnswer: false
    });
    const [touched, setTouched] = useState({
        questionText: false,
        answers: [],
        score: false
    });


    useEffect(() => {
        validateQuestion();
    }, [question.text, answers, question.score]);

    const validateQuestion = () => {
        const newErrors = {
            questionText: !question.text?.trim(),
            answers: answers.map(answer => !answer.text?.trim()),
            score: isNaN(question.score) || question.score < 0,
            noCorrectAnswer: !answers.some(answer => answer.isCorrect)
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error === true);
    };

    const handleAddAnswer = () => {
        const newAnswer = { text: '', isCorrect: answers.length === 0 && !isMultiple };
        const updatedAnswers = [...answers, newAnswer];
        setAnswers(updatedAnswers);
        saveQuestionAttribute(index, 'answers', updatedAnswers);


        setTouched(prev => ({
            ...prev,
            answers: [...prev.answers, false]
        }));
    };

    const handleDeleteAnswer = (answerIndex) => {
        const updatedAnswers = answers.filter((_, i) => i !== answerIndex);
        setAnswers(updatedAnswers);
        saveQuestionAttribute(index, 'answers', updatedAnswers);


        setTouched(prev => ({
            ...prev,
            answers: prev.answers.filter((_, i) => i !== answerIndex)
        }));
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


        if (key === 'text') {
            setTouched(prev => ({
                ...prev,
                answers: prev.answers.map((t, i) => i === answerIndex ? true : t)
            }));
        }
    };

    const handleIsMultipleChange = () => {
        const newIsMultiple = !isMultiple;
        setIsMultiple(newIsMultiple);
        saveQuestionAttribute(index, 'isMultiple', newIsMultiple);

        if (!newIsMultiple && answers.filter(a => a.isCorrect).length > 1) {

            const firstCorrectIndex = answers.findIndex(a => a.isCorrect);
            const updatedAnswers = answers.map((answer, i) => ({
                ...answer,
                isCorrect: i === firstCorrectIndex
            }));
            setAnswers(updatedAnswers);
            saveQuestionAttribute(index, 'answers', updatedAnswers);
        }
    };

    const handleQuestionTextChange = (e) => {
        saveQuestionAttribute(index, 'text', e.target.value);
        setTouched(prev => ({ ...prev, questionText: true }));
    };

    const handleScoreChange = (e) => {
        const value = e.target.value;
        saveQuestionAttribute(index, 'score', value);
        setTouched(prev => ({ ...prev, score: true }));
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
                            {errors.questionText && touched.questionText && (
                                <Typography color="error" component="span" sx={{ ml: 1 }}>
                                    (Required)
                                </Typography>
                            )}
                        </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                        <FormControl fullWidth error={errors.questionText && touched.questionText}>
                            <TextField
                                label="Question Text"
                                placeholder="Write your question here"
                                value={question.text}
                                onChange={handleQuestionTextChange}
                                onBlur={() => setTouched(prev => ({ ...prev, questionText: true }))}
                                error={errors.questionText && touched.questionText}
                                fullWidth
                            />
                            {errors.questionText && touched.questionText && (
                                <FormHelperText>Question text is required</FormHelperText>
                            )}
                        </FormControl>
                    </AccordionDetails>

                    <AccordionDetails sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography>Allow Multiple Answers</Typography>
                        <Tooltip title="Check to allow selecting multiple correct answers">
                            <Checkbox
                                checked={isMultiple}
                                onChange={handleIsMultipleChange}
                                sx={{ marginLeft: 2 }}
                            />
                        </Tooltip>
                    </AccordionDetails>

                    <AccordionDetails>
                        <FormControl error={errors.score && touched.score}>
                            <TextField
                                label="Score"
                                type="number"
                                inputProps={{ min: 0 }}
                                value={question.score}
                                onChange={handleScoreChange}
                                onBlur={() => setTouched(prev => ({ ...prev, score: true }))}
                                error={errors.score && touched.score}
                                sx={{ width: 120 }}
                            />
                            {errors.score && touched.score && (
                                <FormHelperText>Please enter a valid positive number</FormHelperText>
                            )}
                        </FormControl>
                    </AccordionDetails>

                    {errors.noCorrectAnswer && answers.length > 0 && (
                        <AccordionDetails>
                            <Alert severity="error" sx={{ width: '100%' }}>
                                At least one correct answer is required
                            </Alert>
                        </AccordionDetails>
                    )}

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
                            <FormControl fullWidth error={errors.answers[answerIndex] && touched.answers[answerIndex]}>
                                <TextField
                                    label={`Answer ${answerIndex + 1}`}
                                    placeholder="Answer text"
                                    value={answer.text}
                                    onChange={(e) =>
                                        handleAnswerChange(answerIndex, 'text', e.target.value)
                                    }
                                    onBlur={() => setTouched(prev => ({
                                        ...prev,
                                        answers: prev.answers.map((t, i) => i === answerIndex ? true : t)
                                    }))}
                                    error={errors.answers[answerIndex] && touched.answers[answerIndex]}
                                    sx={{ marginLeft: 2, flex: 1 }}
                                />
                                {errors.answers[answerIndex] && touched.answers[answerIndex] && (
                                    <FormHelperText>Answer text is required</FormHelperText>
                                )}
                            </FormControl>
                            <Tooltip title="Delete answer">
                                <IconButton
                                    onClick={() => handleDeleteAnswer(answerIndex)}
                                    color="error"
                                    sx={{ marginLeft: 1 }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </AccordionDetails>
                    ))}

                    <AccordionDetails>
                        <Button
                            variant="contained"
                            onClick={handleAddAnswer}
                            startIcon={<AddCircleOutlineIcon />}
                            sx={{
                                backgroundColor: '#4caf50',
                                '&:hover': {
                                    backgroundColor: '#388e3c',
                                }
                            }}
                        >
                            Add Answer
                        </Button>
                    </AccordionDetails>
                </Accordion>
            </Box>

            <Tooltip title="Delete question">
                <IconButton
                    onClick={() => deleteQuestion(index)}
                    color="error"
                    sx={{ marginTop: 1 }}
                >
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export default DefaultFormFormat;