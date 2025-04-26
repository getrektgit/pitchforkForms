import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';

export default function CompletedFormCard({ formName, formId, totalScore, maxScore, submitTime }) {
    const navigate = useNavigate();

    return (
        <Box sx={{
            minWidth: 280,
            width: '100%',
            maxWidth: 360,
            height: '100%',
        }}>
            <Card
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    boxShadow: 4,
                    overflow: 'hidden',
                    transition: '0.3s ease',
                    '&:hover': {
                        boxShadow: 8,
                        transform: 'translateY(-4px)',
                    },
                    backgroundColor: '#e8f5e9',
                }}
            >
                <CardContent sx={{
                    padding: 2,
                    flexGrow: 1,
                }}>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            fontWeight: 'bold',
                            textAlign: 'center',
                            wordBreak: 'break-word',
                        }}
                    >
                        {formName}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ marginTop: 2, textAlign: 'center' }}
                    >
                        Submitted on: {new Date(submitTime).toLocaleDateString()}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ marginTop: 1, textAlign: 'center' }}
                    >
                        Score: {totalScore} / {maxScore}
                    </Typography>
                </CardContent>

                <CardMedia
                    component="img"
                    height="140"
                    image="https://placehold.co/600x400?text=Completed+Form"
                    alt="Completed Form header"
                    sx={{
                        objectFit: 'cover',
                    }}
                />

                <CardActions
                    sx={{
                        justifyContent: 'center',
                        padding: 2,
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    }}
                >
                    <Button
                        variant="contained"
                        size="medium"
                        onClick={() => navigate(`/user/form/view/${formId}`)}
                    >
                        View
                    </Button>
                </CardActions>

            </Card>
        </Box>
    );
}
