// Use Insomnia to test API posting
// Success with API GET for all notes


// Link post and get requests to buttons
// Deploy server to Heroku

const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('./db/db.json')
const uniqid = require('uniqid'); 

const PORT = process.env.PORT || 25433;


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/assets/js/index.js', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/assets/js/index.js'))
    console.log('accessed JS script successfully')
});

app.get('/assets/css/styles.css', function (req,res){
    res.sendFile(path.join(__dirname, '/public/assets/css/styles.css'))
    console.log('accessed CSS stylesheet successfully')
});    

// GET request for notes
app.get('/api/notes', (req, res) => {
    console.info(`GET /api/notes`);
    // res.status(200).json(db);
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err){
            console.log(err);
        }
        res.send(data);
    })
});

// // GET a single note
// app.get('/api/notes/:title', (req, res) => {
//     if (req.params.title){
//         console.info(`${req.method} request received to get a single note`);
//         const title = req.params.title;
//         for (let i =0; i < notes.length; i++){
//             const currentNote = notes[i];
//             if (currentNote.title === title){
//                 res.json(currentNote);
//                 return;
//             }
//         }
//         res.status(404).send('Note not found');
//     } else {
//         res.status(400).send('Note ID not provided');
//     }
// });

// POST request to add a note
app.post('/api/notes', (req, res) => {
    //Log that a POST request was received
    console.info(`${req.method} request received to add a note`);
    console.info(req.body)

    const { title, text } = req.body;

    if (title && text) {

        const newNote = {
            title,
            text,
            id: uniqid(),
        };
        console.log(newNote);
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {

                const parsedNotes = JSON.parse(data);
                
                parsedNotes.push(newNote);

                fs.writeFile(
                    './db/db.json',
                    JSON.stringify(parsedNotes, null , 4),
                    (writeErr) => {
                    writeErr
                    ? console.error(writeErr)
                    : res.json(newNote)
                    // if (writeErr){
                    //     console.log(err)
                    // }
                    // db.push(newNote);
                    // res.json(newNote);
                }
                );
            }
        });
    } else {
        res.status(500).json('Error in posting note');
    }
});

app.delete('/api/notes/:id', (req,res) => {
    console.log(req.params.id);
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err){
            throw err;
        }
        const parsedNotes = JSON.parse(data);
        var index;
        for (i=0; i < parsedNotes.length; i++){
            if (data[i].id === req.params.id){
                index = i;
            }
        }
        parsedNotes.splice(index, 1);
        fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null , 4),
            (writeErr) => {
            writeErr
            ? console.error(writeErr)
            : res.json('Successfully Deleted!');
        });
    });
})

//app.set('port', process.env.PORT || 25433);

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);