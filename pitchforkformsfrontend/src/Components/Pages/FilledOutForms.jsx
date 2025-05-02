import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CompletedFormCard from '../CompletedFormCard';
import { Box, Grid, Typography } from '@mui/material';

const FilledOutForms = () => {
    const [completedForms, setCompletedForms] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchCompletedForms = async () => {
            try {
                const response = await axios.get(`/user/forms/completed/${user.id}`);
                setCompletedForms(response.data.forms);
            } catch (error) {
                console.error('Error fetching completed forms:', error);
            }
        };

        fetchCompletedForms();
    }, [user.id]);

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom textAlign="center">
                Completed Forms
            </Typography>

            {completedForms.length === 0 ? (
                <Typography variant="body1" textAlign="center">
                    No completed forms yet.
                </Typography>
            ) : (
                <Grid container spacing={3} justifyContent="center">
                    {completedForms.map((form) => (
                        <Grid item key={form.form_id}>
                            <CompletedFormCard
                                formName={form.name}
                                formId={form.form_id}
                                totalScore={form.total_score}
                                maxScore={form.max_score}
                                submitTime={form.submit_time}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default FilledOutForms;
