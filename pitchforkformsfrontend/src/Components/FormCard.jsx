import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router';
export default function FormCard({ formName, formId }) {
    const navigate = useNavigate();
    return (
        <Card
            sx={{
                maxWidth: 360,
                borderRadius: 3,
                boxShadow: 4,
                overflow: 'hidden',
                transition: '0.3s ease',
                '&:hover': {
                    boxShadow: 8,
                    transform: 'translateY(-4px)',
                },
                margin: 2,
                backgroundColor: '#f9f9f9',
            }}
        >
            <CardContent sx={{ paddingBottom: 0 }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    {formName}
                </Typography>
            </CardContent>

            <CardMedia
                component="img"
                height="140"
                image="https://placehold.co/360x140"
                alt="Form header"
            />

            <CardActions sx={{
                justifyContent: 'space-between',
                paddingX: 2,
                paddingBottom: 2,
                paddingTop: 2,
                paddingLeft:4,
                paddingRight:4,
            }}>
                <Button variant="outlined" size="small" onClick={()=>navigate(`/admin/edit-form/${formId}`)}>Edit</Button>
                <Button variant="contained" size="small">Send</Button>
            </CardActions>
        </Card>
    );
}
