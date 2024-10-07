import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Create from './pages/Create';
import Edit from './pages/Edit';
import Study from './pages/Study';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

function App() {

  const [className, setClassName] = useState('');
  const handleInputChange = (event) => {
    setClassName(event.target.value);  
  };

  return (
    <Router>
    <Box sx={{ margin: 5}}>
      <nav>
        <Stack spacing={2} align="center">
          <Stack spacing={2} direction="row" align="center">
            <TextField variant="standard" size="medium" value={className} onChange={handleInputChange} placeholder="Study Set Name"/>
            <Button component={Link} variant="text" size="small" to={`/create/${className}`} >
              Create/Edit
            </Button>
            {/* <Button component={Link} variant="text" size="small" to={`/edit`} >
              Edit
            </Button> */}
            <Button component={Link} variant="text" size="small" to={`/study/${className}`} >
              Study
            </Button>
          </Stack>
          <Typography variant="h2"> Flashcard App </Typography>
        </Stack>
      </nav>
      <Routes>
        <Route path="/create/:className" element={<Create/>} />
        <Route path="/edit" element={<Edit/>} />
        <Route path="/study/:className" element={<Study/>} />
      </Routes>
    </Box>
  </Router>
  );
}

export default App;