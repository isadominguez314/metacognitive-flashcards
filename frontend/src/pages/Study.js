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
    const [workingFlashcards, setWorkingFlashcards] = useState([]);
    const [restartSet, setRestartSet] = useState(false);

    useEffect(() => {
        getFlashcards();
    }, [className]);


    // retrieve flashcard information from database 
    function getFlashcards() {
        axios.get(`http://localhost:5001/api/flashcards/${className}`)
            .then(response => {
                const newFlashcards = response.data;
                const processedCards = processFlashcards(newFlashcards);
                setFlashcards(newFlashcards);
                setWorkingFlashcards(processedCards);
            })
            .catch(error => {
                console.error('Error fetching flashcards:', error);
            });
    }
    
    // creates an array of flashcards with each one appropriately weighted
    function processFlashcards(flashcards) {
        let newCards = []; 
    
        flashcards.forEach(card => {
            if (!card.correct || card.confidence !== 5) {
                let sum = card.confidence + card.importance
                if (sum <= 3) { 
                    newCards.push({...card});
                    newCards.push({...card});
                    newCards.push({...card});
                } else if (sum <= 6) {
                    newCards.push({...card});
                    newCards.push({...card});
                } else {
                    newCards.push({...card});
                }
            }
        });
        newCards = shuffleCards(newCards);
    
        return newCards;
    }

    // shuffles the flashcards to be in a random order
    function shuffleCards(array) {
        let currentIndex = array.length, randomIndex;

        while (currentIndex !== 0) {
    
            // pick random element
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
    
            // swap it with current 
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    // handle the flashcard depending on if it is the last one
    const handleNext = () => {
        setFeedback('');
        if (currentIndex < workingFlashcards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setUserInput('');
            setConfidence('');
        } else {
            setUserInput('');
            setConfidence('');
            setRestartSet(true);
        }
    };

    // handle the end of deck appropriately
    const handleRestart = () => {
        getFlashcards();
        setCurrentIndex(0);
        setRestartSet(false);
    }

    // provide feedback and process user submission
    const handleSubmit = () => {
        const correctDefinition = workingFlashcards[currentIndex].definition;
        if (userInput.trim().toLowerCase() === correctDefinition.trim().toLowerCase()) {
            setFeedback('CORRECT!');
            axios.put(`http://localhost:5001/api/flashcards/${workingFlashcards[currentIndex]._id}`, {
                correct: true
            })
        } else {
            setFeedback(`INCORRECT! The correct definition is: "${correctDefinition}"`);
            axios.put(`http://localhost:5001/api/flashcards/${workingFlashcards[currentIndex]._id}`, {
                correct: false
            })
        }
        
        // Ask for confidence rating and update the database
        if (confidence) {
            updateConfidence(confidence);
        }

        setOpenDialog(true);
    };

    // process user's confidence judgement 
    const handleConfidenceSubmit = (newConfidence) => {
        updateConfidence(newConfidence);
        setOpenDialog(false); 
    };

    // update backend with user's confidence judgement 
    const updateConfidence = (newConfidence) => {
        axios.put(`http://localhost:5001/api/flashcards/${workingFlashcards[currentIndex]._id}`, {
            confidence: Number(newConfidence)
        })
        .then(response => {
            handleNext();
        })
        .catch(error => {
            console.error('Error updating confidence:', error);
        });
    };

    // start the deck over so all cards have confidence level 3 and are marked incorrect
    const resetFlashcards = () => {
        axios.put(`http://localhost:5001/api/flashcards/reset/${className}`)
            .then(response => {
                console.log('Flashcards reset:', response.data);
                getFlashcards();  // Reload flashcards to reflect the reset
            })
            .catch(error => {
                console.error('Error resetting flashcards:', error);
            });
    };
    

    return (
        <Box margin={5} align="center">
            <Typography sx={{ mb: 5}} variant="h5"> Studying "{className}" Flashcard Set </Typography>
            {workingFlashcards.length === 0 && (
                <Box>
                     <Typography variant = "h5" sx={{ mb: 5 }}> ALL DONE! </Typography>
                     <Button variant="contained" onClick={resetFlashcards} > Start Over </Button> 
                </Box>
            )}
            {workingFlashcards.length > 0 && (
                <Stack spacing={2}>
                    <Typography variant="h5" sx={{ mb: 10 }}><b> {workingFlashcards[currentIndex]?.term}</b></Typography>
                    <Box align = "center">
                        <TextField
                            label="Your Definition"
                            variant="standard"
                            value={userInput}
                            onChange={e => setUserInput(e.target.value)}
                            size="small"
                            disabled={restartSet}
                        />
                        <Button onClick={handleSubmit} size="small" disabled={restartSet}>Submit</Button>
                    </Box>
                    <Typography style={{ color: (feedback === 'CORRECT!') ? 'green' : 'red' }}> 
                        {feedback} 
                    </Typography>
                    {openDialog ? 
                        <Box>
                            <Typography> How confident do you feel in "{workingFlashcards[currentIndex].term}"? </Typography>
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
                    <Box>
                       <Button variant="contained" disabled={!restartSet} onClick={handleRestart} > Continue Studying </Button> 
                    </Box>
                </Stack>
            )}
        </Box>
    );
}

export default Study;