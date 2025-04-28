import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function FormCard({ formName, formId, isEditDisabled }) {
    const navigate = useNavigate();
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
    const user = JSON.parse(localStorage.getItem('user'));

    const HandleSave = async (formId) => {
        try {
            const response = await axios.post(`/form/send-to-students`, { form_id: formId });
            setSnackbarMessage(response.data.message || 'Form sikeresen kiküldve!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage(error.response?.data?.message || 'Hiba a kiküldés során!');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    return (
        <>
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
                        backgroundColor: '#f9f9f9',
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
                    </CardContent>

                    <CardMedia
                        component="img"
                        height="140"
                        image="https://placehold.co/600x400?text=Form+Preview"
                        alt="Form header"
                        sx={{
                            objectFit: 'cover',
                        }}
                    />

                    <CardActions
                        sx={{
                            justifyContent: user.role === 'student' ? 'center' : 'space-between',
                            padding: 2,
                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                        }}
                    >
                        {user.role === 'student' ? (
                            <Button
                                variant="contained"
                                size="medium"
                                onClick={() => navigate(`/user/form/fill/${formId}`)}
                            >
                                Fill
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => navigate(`/admin/edit-form/${formId}`)}
                                    sx={{ minWidth: 80 }}
                                    disabled={isEditDisabled}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => HandleSave(formId)}
                                    sx={{ minWidth: 80 }}
                                >
                                    Send
                                </Button>
                            </>
                        )}
                    </CardActions>

                </Card>
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}
