const express = require('express');
const morgan = require('morgan');
const morganBody = require('morgan-body');

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

let phonebook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    
];

const currentTime = new Date().toLocaleString();
const maxlength = phonebook.length;

app.get('/api/persons', (req, res) => {
    res.json(phonebook);
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
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'Name or number is missing'
        });
    }
    if (phonebook.find(ph => ph.name === body.name)) {
        return res.status(400).json({
            error: 'Name must be unique'
        });
    }
    const person = {
        id: Math.floor(Math.random() * 1000),
        name: body.name,
        number: body.number
    };
    phonebook.push(person);
    res.json(person); // Respond with the newly added person
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
