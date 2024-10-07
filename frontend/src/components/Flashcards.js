// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Flashcards = ({className}) => {

//   const [flashcards, setFlashcards] = useState([]);
//   const [newTerm, setNewTerm] = useState('');
//   const [newDefinition, setNewDefinition] = useState('');

//   // Fetch flashcards when the component mounts or className changes
//   useEffect(() => {
//     axios.get(`http://localhost:5001/api/flashcards/${className}`)
//         .then(response => {
//             setFlashcards(response.data);
//         })
//         .catch(error => {
//             console.error('Error fetching flashcards:', error);
//         });
//   }, [className]);

//   // Function to handle adding a new flashcard
//   const addFlashcard = () => {
//     axios.post('http://localhost:5001/api/flashcards', {
//         term: newTerm,
//         definition: newDefinition,
//         className: className
//     })
//     .then(response => {
//         // Add the new flashcard to the current list to update the UI
//         setFlashcards([...flashcards, response.data]);
//         setNewTerm('');
//         setNewDefinition('');
//     })
//     .catch(error => {
//         console.error('Error adding flashcard:', error);
//     });
//   };

//   return (
//     <div>
//       <h1>{className} Flashcards </h1>
//       {/* <FlashcardForm onAdd={addFlashcard}/> */}
//       <ul>
//         {flashcards.map(flashcard => (
//           <li key={flashcard._id}>Term: {flashcard.term}, Definition: {flashcard.definition}</li>
//         ))}
//       </ul>
//       <div>
//                 <input
//                     type="text"
//                     placeholder="Term"
//                     value={newTerm}
//                     onChange={e => setNewTerm(e.target.value)}
//                 />
//                 <input
//                     type="text"
//                     placeholder="Definition"
//                     value={newDefinition}
//                     onChange={e => setNewDefinition(e.target.value)}
//                 />
//                 <button onClick={addFlashcard}>Add Flashcard</button>
//             </div>
//     </div>
//   );
// };

// export default Flashcards;