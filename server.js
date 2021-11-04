// Use Insomnia to test API posting
// Link post and get requests to buttons
// Deploy server to Heroku

const express = require('express');
const path = require('path');

const PORT = 3001;

const app = express();

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET request for notes
app.get('api/notes', (req, res) => {
    console.info(`GET /api/notes`);
    res.status(200).json(notes);
});

// GET a single note
app.get('api/notes/:note_id', (req, res) => {
    if (req.params.note_id){
        console.info(`${req.method} request received to get a single note`);
        const noteId = req.params.note_id;
        for (let i =0; i < notes.length; i++){
            const currentNote = notes[i];
            if (currentNote.note_id === noteId){
                res.json(currentNote);
                return;
            }
        }
        res.status(404).send('Note not found');
    } else {
        res.status(400).send('Note ID not provided');
    }
});

// POST request to add a note
app.post('/api/notes', (req, res) => {
    //Log that a POST request was received
    console.info(`${req.method} request received to add a note`);

    const { title, text } = req.body;

    if (title && text) {

        const newNote = {
            title,
            text
        };

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting note');
    }
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);