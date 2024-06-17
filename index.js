require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const morganBody = require('morgan-body');
const person = require('./mongo');
const app = express();
const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use morgan for basic logging
app.use(morgan('tiny'));

// Use morgan-body for logging request bodies
morganBody(app);

// let phonebook = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
    
// ];

const currentTime = new Date().toLocaleString();
const maxlength = phonebook.length;

app.get('/api/persons', (req, res) => {
     person.find({}).then(result => {
        res.json(result);
    })
});

app.get('/info', (req, res) => {
    res.send(`
        <h1>Phonebook has ${maxlength} entries</h1>
        <br/>
        <h1>${currentTime}</h1>
    `);
});

app.post('/api/persons', (req, res) => {
    const body = req.body;
     // Respond with the newly added person
        if (!body.name || !body.number) {
            return res.status(400).json({ 
                error: 'name or number is missing' 
            });
        }
        const person = new person({
            name: body.name,
            number: body.number,
        });
        person.save().then(savedPerson => {
            res.json(savedPerson);
        });
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = phonebook.findIndex(ph => ph.id === id);
    if (index !== -1) {
        phonebook = phonebook.filter(ph => ph.id !== id);
        res.json(phonebook);
    } else {
        res.status(404).send("This id is not present in the phonebook");
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
