import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function Create() {

    const {className} = useParams();
    const [flashcards, setFlashcards] = useState([]);
    const [newTerm, setNewTerm] = useState('');
    const [newDefinition, setNewDefinition] = useState('');
    const [newImportance, setNewImportance] = useState('');
    const [newConfidence, setNewConfidence] = useState('');

    // Fetch flashcards when the component mounts or className changes
    useEffect(() => {
        axios.get(`http://localhost:5001/api/flashcards/${className}`)
            .then(response => {
                setFlashcards(response.data);
            })
            .catch(error => {
                console.error('Error fetching flashcards:', error);
            });
    }, [className]);

    // Function to handle adding a new flashcard
    const addFlashcard = () => {
        
        axios.post('http://localhost:5001/api/flashcards', {
            term: newTerm,
            definition: newDefinition,
            importance: Number(newImportance),
            confidence: Number(newConfidence),
            correct: false,
            className: className, 
        })
        .then(response => {
            // Add the new flashcard to the current list to update the UI
            setFlashcards([...flashcards, response.data]);
            setNewTerm('');
            setNewDefinition('');
            setNewConfidence('');
            setNewImportance('');
        })
        .catch(error => {
            console.error('Error adding flashcard:', error);
        });
    };

    return (
        <Box>
            <Typography variant="h4">{className} Flashcards </Typography>
            <ul>
                {flashcards.map(flashcard => (
                <li key={flashcard._id}>Term: {flashcard.term}, Definition: {flashcard.definition}, Importance: {flashcard.importance}, Confidence: {flashcard.confidence}</li>
                ))}
            </ul>
            <Stack spacing={1} direction="row">
                <TextField
                    type="text"
                    placeholder="Term"
                    value={newTerm}
                    onChange={e => setNewTerm(e.target.value)}
                    size="small"
                />                 
                <TextField
                    type="text"
                    placeholder="Definition"
                    value={newDefinition}
                    onChange={e => setNewDefinition(e.target.value)}
                    size="small"
                />
                <TextField
                    type="text"
                    placeholder="Importance"
                    value={newImportance}
                    onChange={e => setNewImportance(e.target.value)}
                    size="small"
                />
                <TextField
                    type="text"
                    placeholder="Confidence"
                    value={newConfidence}
                    onChange={e => setNewConfidence(e.target.value)}
                    size="small"
                />
                <Button onClick={addFlashcard}>Add Flashcard</Button>
            </Stack>
        </Box>
    );
}

export default Create;