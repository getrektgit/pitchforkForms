import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Input, Button, TextField } from '@mui/material';
import React from 'react'
import { useState } from 'react';



const DefaultFormFormat = () => {
    const [qNumber, setQNumber] = useState(1)
    return (
        <div>
            <Accordion sx={{width:'100%'}}>
                <AccordionSummary
                    expandIcon={<ArrowDownwardIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Typography component="span">Question {qNumber}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <TextField placeholder='Write your question here' sx={{maxWidth:800, widows:800}}/>
                </AccordionDetails>
            </Accordion>
            <br/>
        </div>
    )
}

export default DefaultFormFormat