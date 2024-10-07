import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Rating from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
      color: theme.palette.action.disabled,
    },
  }));
  
  const customIcons = {
    1: {
      icon: <SentimentVeryDissatisfiedIcon color="error"fontSize="large"/>,
      label: 'Very Dissatisfied',
    },
    2: {
      icon: <SentimentDissatisfiedIcon color="error" fontSize="large" />,
      label: 'Dissatisfied',
    },
    3: {
      icon: <SentimentSatisfiedIcon color="warning" fontSize="large" />,
      label: 'Neutral',
    },
    4: {
      icon: <SentimentSatisfiedAltIcon color="success" fontSize="large" />,
      label: 'Satisfied',
    },
    5: {
      icon: <SentimentVerySatisfiedIcon color="success" fontSize="large"/>,
      label: 'Very Satisfied',
    },
  };
  
  function IconContainer(props) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
  }
  
  IconContainer.propTypes = {
    value: PropTypes.number.isRequired,
  };

function Study() {
    const {className} = useParams();
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [confidence, setConfidence] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [feedback, setFeedback] = useState('');

    // TODO: eventually this will need to reload upon last enter as well
    useEffect(() => {
        axios.get(`http://localhost:5001/api/flashcards/${className}`)
            .then(response => {
                setFlashcards(response.data);
            })
            .catch(error => {
                console.error('Error fetching flashcards:', error);
            });
    }, [className, feedback]);

    const handleNext = () => {
        setFeedback('');
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setUserInput('');
            setConfidence('');
        } else {
            alert('You have completed the study session!');
        }
    };

    const handleSubmit = () => {
        const correctDefinition = flashcards[currentIndex].definition;
        if (userInput.trim() === correctDefinition.trim()) {
            setFeedback('CORRECT!');
            axios.put(`http://localhost:5001/api/flashcards/${flashcards[currentIndex]._id}`, {
                correct: true
            })
        } else {
            setFeedback(`INCORRECT! The correct definition is: "${correctDefinition}"`);
            axios.put(`http://localhost:5001/api/flashcards/${flashcards[currentIndex]._id}`, {
                correct: false
            })
        }
        
        //Ask for confidence rating and update the database
        if (confidence) {
            updateConfidence(confidence);
        }

        setOpenDialog(true);
    };

    const handleConfidenceSubmit = (newConfidence) => {
        // console.log('confidence: ' + confidence);
        // updateConfidence(confidence);
        updateConfidence(newConfidence);
        setOpenDialog(false); 
    };

    const updateConfidence = (newConfidence) => {
        console.log("new conf:" + newConfidence);
        console.log(flashcards[currentIndex]._id);
        axios.put(`http://localhost:5001/api/flashcards/${flashcards[currentIndex]._id}`, {
            confidence: Number(newConfidence)
        })
        .then(response => {
            handleNext();
        })
        .catch(error => {
            console.error('Error updating confidence:', error);
        });
    };

    return (
        <Box margin={5} align="center">
            <ul>
                {flashcards.map(flashcard => (
                <li key={flashcard._id}>Term: {flashcard.term}, Definition: {flashcard.definition}, Correct: {flashcard.correct ? "true" : "false"}, Importance: {flashcard.importance}, Confidence: {flashcard.confidence}</li>
                ))}
            </ul>
            <Typography sx={{ mb: 5}} variant="h5"> Studying "{className}" Flashcard Set </Typography>
            {flashcards.length > 0 && (
                <Stack spacing={2}>
                    <Typography variant="h5" sx={{ mb: 10 }}><b> {flashcards[currentIndex].term}</b></Typography>
                    <Box align = "center">
                        <TextField
                            label="Your Definition"
                            variant="standard"
                            value={userInput}
                            onChange={e => setUserInput(e.target.value)}
                            size="small"
                        />
                        <Button onClick={handleSubmit} size="small">Submit</Button>
                    </Box>
                    <Typography style={{ color: (feedback === 'CORRECT!') ? 'green' : 'red' }}> 
                        {feedback} 
                    </Typography>
                    {openDialog ? 
                        <Box>
                            <Typography> How confident do you feel in "{flashcards[currentIndex].term}"? </Typography>
                            <StyledRating
                                name="highlight-selected-only"
                                IconContainerComponent={IconContainer}
                                getLabelText={(value) => customIcons[value].label}
                                highlightSelectedOnly
                                value={parseInt(confidence)}
                                onChange={(event, newValue) => {
                                    setConfidence(newValue);  
                                    handleConfidenceSubmit(newValue);  
                                }}
                            />
                        </Box>
                    : <Box/>}
                </Stack>
            )}
        </Box>
    );
}

export default Study;