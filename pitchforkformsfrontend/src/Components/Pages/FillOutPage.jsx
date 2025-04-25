import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Typography,
    Radio,
    Checkbox,
    FormControlLabel,
    Button,
    Paper,
    CircularProgress,
    Alert
} from '@mui/material';

const FillOutFormPage = () => {
    const { id } = useParams();
    const [form, setForm] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitStatus, setSubmitStatus] = useState(null);

    const accessToken = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        axios.get(`/form/get-form/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(res => {
                setForm(res.data.form);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching form:', err);
                setLoading(false);
            });
    }, [id]);

    const handleAnswerChange = (questionId, answerId, isMultiple) => {
        setSelectedAnswers(prev => {
            if (isMultiple) {
                const current = prev[questionId] || [];
                const updated = current.includes(answerId)
                    ? current.filter(id => id !== answerId)
                    : [...current, answerId];
                return { ...prev, [questionId]: updated };
            } else {
                return { ...prev, [questionId]: [answerId] };
            }
        });
    };

    const handleSubmit = async () => {
        const allSelected = Object.values(selectedAnswers).flat();

        if (allSelected.length === 0) {
            alert("Please select at least one answer before submitting.");
            return;
        }

        try {
            const response = await axios.post("/form/submit", {
                form_id: id,
                user_id: user.id,
                answers: allSelected
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            setSubmitStatus({ type: "success", message: response.data.message });
        } catch (err) {
            const message = err.response?.data?.message || "Submission failed.";
            setSubmitStatus({ type: "error", message });
        }
    };

    if (loading) return <CircularProgress />;

    if (!form) return <Typography color="error">Could not load form.</Typography>;

    return (
        <Box>
            <Typography variant="h4" gutterBottom>{form.name}</Typography>

            {form.questions.map((q, i) => (
                <Paper key={q.id} sx={{ p: 2, my: 2 }}>
                    <Typography variant="h6">{i + 1}. {q.text}</Typography>
                    <Box mt={1}>
                        {q.answers.map(answer => {
                            const isMultiple = q.type === 'checkbox';
                            const selected = selectedAnswers[q.id] || [];
                            const isChecked = selected.includes(answer.id);

                            return (
                                <FormControlLabel
                                    key={answer.id}
                                    control={
                                        isMultiple ? (
                                            <Checkbox
                                                checked={isChecked}
                                                onChange={() => handleAnswerChange(q.id, answer.id, true)}
                                            />
                                        ) : (
                                            <Radio
                                                checked={isChecked}
                                                onChange={() => handleAnswerChange(q.id, answer.id, false)}
                                                name={`question-${q.id}`}
                                            />
                                        )
                                    }
                                    label={answer.text}
                                />
                            );
                        })}
                    </Box>
                </Paper>
            ))}

            {submitStatus && (
                <Alert severity={submitStatus.type} sx={{ mb: 2 }}>
                    {submitStatus.message}
                </Alert>
            )}

            <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit Form
            </Button>
        </Box>
    );
};

export default FillOutFormPage;
