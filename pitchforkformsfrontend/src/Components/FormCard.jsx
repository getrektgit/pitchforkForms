import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';

export default function FormCard({ formName, formId }) {
    const navigate = useNavigate();
    
    return (
        <Box sx={{
            minWidth: 280,  // Set a minimum width
            width: '100%',  // Take full width of container
            maxWidth: 360,  // But don't exceed this width
            height: '100%', // Ensure all cards have same height in a row
        }}>
            <Card
                sx={{
                    height: '100%',  // Take full height of container
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
                    backgroundColor: '#f9f9f9',
                }}
            >
                <CardContent sx={{ 
                    padding: 2,
                    flexGrow: 1,  // Allows content to grow and push buttons to bottom
                }}>
                    <Typography 
                        variant="h6" 
                        component="div" 
                        sx={{ 
                            fontWeight: 'bold', 
                            textAlign: 'center',
                            wordBreak: 'break-word',  // Prevent long words from overflowing
                        }}
                    >
                        {formName}
                    </Typography>
                </CardContent>

                <CardMedia
                    component="img"
                    height="140"
                    image="https://placehold.co/600x400?text=Form+Preview"
                    alt="Form header"
                    sx={{
                        objectFit: 'cover',  // Ensure image covers the space nicely
                    }}
                />

                <CardActions sx={{
                    justifyContent: 'space-between',
                    padding: 2,
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',  // Slight background for buttons
                }}>
                    <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => navigate(`/admin/edit-form/${formId}`)}
                        sx={{
                            minWidth: 80,  // Ensure buttons have consistent width
                        }}
                    >
                        Edit
                    </Button>
                    <Button 
                        variant="contained" 
                        size="small"
                        sx={{
                            minWidth: 80,
                        }}
                    >
                        Send
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
}