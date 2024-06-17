require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const morganBody = require('morgan-body');
const cors = require('cors');
const Person = require('./mongo'); // Updated to match the correct model name

const app = express();

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use morgan for basic logging
app.use(morgan('tiny'));

// Use morgan-body for logging request bodies
morganBody(app);

app.get('/api/persons', (req, res) => {
    Person.find({}).then(result => {
        res.json(result);
    }).catch(error => {
        console.error(error);
        res.status(500).send('Internal Server Error');
    });
});

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({ 
            error: 'name or number is missing' 
        });
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person.save().then(savedPerson => {
        res.json(savedPerson);
    }).catch(error => {
        console.error(error);
        res.status(500).send('Internal Server Error');
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
