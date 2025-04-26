import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Alert,
    Button,
    Grid,
    Chip,
} from '@mui/material';

const CheckAnswersPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formDetails, setFormDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const accessToken = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        axios
            .get(`/user/form/completed/${id}/user/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((response) => {
                setFormDetails(response.data.formDetails);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.response?.data?.message || 'Error fetching form details');
                setLoading(false);
            });
    }, [id, user.id, accessToken]);

    if (loading) {
        return <CircularProgress sx={{ marginTop: 5 }} />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Box sx={{ padding: { xs: 2, md: 4 } }}>
            <Typography variant="h4" gutterBottom>
                Your Answers
            </Typography>

            {formDetails.map((question) => (
                <Paper key={question.question_id} sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        {question.question_text}
                    </Typography>

                    <Grid container spacing={2} mt={2}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom>
                                Your Answer(s)
                            </Typography>
                            {question.answer_options
                                .filter((opt) => opt.is_answer_selected)
                                .map((answerOption) => (
                                    <Chip
                                        key={answerOption.answer_option_id}
                                        label={answerOption.answer_option_text}
                                        color={answerOption.is_right_answer ? "success" : "error"}
                                        variant="outlined"
                                        sx={{ mr: 1, mb: 1 }}
                                    />
                                ))}
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom>
                                Correct Answer(s)
                            </Typography>
                            {question.answer_options
                                .filter((opt) => opt.is_right_answer)
                                .map((correctOption) => (
                                    <Chip
                                        key={correctOption.answer_option_id}
                                        label={correctOption.answer_option_text}
                                        color="success"
                                        sx={{ mr: 1, mb: 1 }}
                                    />
                                ))}
                        </Grid>
                    </Grid>
                </Paper>
            ))}

            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={()=>navigate("/completed-forms")}
            >
                Back
            </Button>
        </Box>
    );
};

export default CheckAnswersPage;
