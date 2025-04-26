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
    Tooltip,
    Stack
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
                <Accordion sx={{ width: '100%' }} defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ArrowDownwardIcon />}
                        aria-controls="panel-content"
                        id="panel-header"
                    >
                        <Typography component="span" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                            Question {index + 1}
                        </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                        <Stack spacing={2}>
                            {/* Question Text */}
                            <FormControl fullWidth error={errors.questionText && touched.questionText}>
                                <TextField
                                    label="Question Text"
                                    placeholder="Write your question here"
                                    value={question.text}
                                    onChange={handleQuestionTextChange}
                                    onBlur={() => setTouched(prev => ({ ...prev, questionText: true }))}
                                    fullWidth
                                />
                                {errors.questionText && touched.questionText && (
                                    <FormHelperText>Question text is required</FormHelperText>
                                )}
                            </FormControl>

                            {/* Allow Multiple Answers */}
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography>Allow Multiple Answers</Typography>
                                <Tooltip title="Check to allow selecting multiple correct answers">
                                    <Checkbox
                                        checked={isMultiple}
                                        onChange={handleIsMultipleChange}
                                        sx={{ ml: 2 }}
                                    />
                                </Tooltip>
                            </Box>

                            {/* Score */}
                            <FormControl error={errors.score && touched.score}>
                                <TextField
                                    label="Score"
                                    type="number"
                                    inputProps={{ min: 0 }}
                                    value={question.score}
                                    onChange={handleScoreChange}
                                    onBlur={() => setTouched(prev => ({ ...prev, score: true }))}
                                    sx={{ width: 150 }}
                                />
                                {errors.score && touched.score && (
                                    <FormHelperText>Score must be a positive number</FormHelperText>
                                )}
                            </FormControl>

                            {/* No correct answer warning */}
                            {errors.noCorrectAnswer && answers.length > 0 && (
                                <Alert severity="error">
                                    At least one correct answer is required
                                </Alert>
                            )}

                            {/* Answer Inputs */}
                            {answers.map((answer, answerIndex) => (
                                <Box key={answerIndex} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                                            fullWidth
                                        />
                                        {errors.answers[answerIndex] && touched.answers[answerIndex] && (
                                            <FormHelperText>Answer text is required</FormHelperText>
                                        )}
                                    </FormControl>

                                    <Tooltip title="Delete answer">
                                        <IconButton
                                            onClick={() => handleDeleteAnswer(answerIndex)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            ))}

                            {/* Add Answer Button */}
                            <Button
                                variant="outlined"
                                onClick={handleAddAnswer}
                                startIcon={<AddCircleOutlineIcon />}
                                sx={{
                                    alignSelf: 'flex-start',
                                    color: 'success.main',
                                    borderColor: 'success.main',
                                    '&:hover': {
                                        backgroundColor: 'success.light',
                                        borderColor: 'success.dark'
                                    }
                                }}
                            >
                                Add Answer
                            </Button>
                        </Stack>
                    </AccordionDetails>
                </Accordion>
            </Box>

            {/* Delete Question */}
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
