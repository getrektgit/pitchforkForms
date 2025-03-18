import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Input, Button, TextField } from '@mui/material';
import React from 'react'


const DefaultFormFormat = ({ index, saveQuestionAttribute, question }) => {
    return (
        <div>
            <Accordion sx={{ width: '100%' }}>
                <AccordionSummary
                    expandIcon={<ArrowDownwardIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Typography component="span">Question {index + 1}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <TextField placeholder='Write your question here' value={question.text} onChange={(e) => { saveQuestionAttribute(index, "text", e.target.value) }} sx={{ maxWidth: 800, widows: 800 }} />
                </AccordionDetails>
                <AccordionDetails>
                    <Typography>Score</Typography>
                    <Input type="number" onChange={(e) => { saveQuestionAttribute(index, "number", e.target.value) }} value={question.score} />
                </AccordionDetails>
            </Accordion>
            <br />
        </div>
    )
}

export default DefaultFormFormat