const express = require('express');
const fs = require('fs');
const path = require('path');

// Create an instance of Express.js
const app = express();
const PORT = 3000; // Port number where the server will listen

// Middleware setup
// Configure middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.json()); // Parse JSON data

// Serve static files from the "public" directory
app.use(express.static('public'));


// API routes

// GET route for retrieving notes
app.get('/api/notes', (req, res) => {
  const notes = getNotes();
  res.json(notes);
});

// POST route for creating a new note
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  const notes = getNotes();
  newNote.id = generateUniqueID();
  const updatedNotes = [...notes, newNote];
  saveNotes(updatedNotes);
  res.json(newNote);
});

// DELETE route for deleting a note
app.delete('/api/notes/:id', (req, res) => {
  const noteId = parseInt(req.params.id);
  const notes = getNotes();
  const filteredNotes = notes.filter((note) => note.id !== noteId);
  saveNotes(filteredNotes);
  res.sendStatus(204);
});

// Helper functions

// Function to read notes from the database file
const getNotes = () => {
  try {
    const notesData = fs.readFileSync(path.join(__dirname, 'db', 'db.json'), 'UTF8');
    const notes = JSON.parse(notesData);
    console.log('Read notes:', notes);
    return notes;
  } catch (err) {
    console.error('Error reading notes:', err);
    return [];
  }
};

// Function to generate a unique ID for a new note
const generateUniqueID = () => {
  const timestamp = Date.now().toString();
  const randomNumber = Math.floor(Math.random() * 1000).toString();
  return timestamp + randomNumber;
}

// Function to save notes to the database file
const saveNotes = (notes) => {
  fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes));
};

// Routes for serving HTML files

// Route to serve the notes.html file
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// Route to serve the index.html file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
