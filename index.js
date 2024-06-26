require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const morganBody = require('morgan-body');
const cors = require('cors');
const Person = require('./mongo'); // Correct model name

const app = express();

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use morgan for basic logging
app.use(morgan('tiny'));

// Use morgan-body for logging request bodies
morganBody(app);

app.get('/api/persons', (req, res, next) => {
    Person.find({})
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            console.error('Error fetching persons:', error);
            next(error); // Pass the error to the error handling middleware
        });
});

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(result => {
            if (result) {
                res.json(result);
            } else {
                res.status(404).end();
            }
        })
        .catch(error => {
            console.error('Error fetching person:', error);
            next(error); // Pass the error to the error handling middleware
        });
});

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.json({ message: 'Person deleted', 'deletedPerson': result });
        })
        .catch(error => {
            console.error('Error deleting person:', error);
            next(error); 
        });
});

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body;

    const person = {
        name: body.name,
        number: body.number,
    };

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson);
        })
        .catch(error => {
            console.error('Error updating person:', error);
            next(error); 
        });
});

app.post('/api/persons', (req, res, next) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'name or number is missing' });
    }

    Person.findOne({ name: body.name })
        .then(existingPerson => {
            if (existingPerson) {
                // Person already exists, return error
                return res.status(400).json({ error: 'name must be unique' });
            } else {
                // Person does not exist, create a new entry
                const person = new Person({
                    name: body.name,
                    number: body.number,
                });

                person.save()
                    .then(savedPerson => {
                        res.json(savedPerson);
                    })
                    .catch(error => {
                        console.error('Error saving person:', error);
                        next(error); // Pass the error to the error handling middleware
                    });
            }
        })
        .catch(error => {
            console.error('Error checking for existing person:', error);
            next(error); // Pass the error to the error handling middleware
        });
});

// Error handling middleware
const errorHandler = (error, req, res, next) => {
    console.error('Error:', error.message);

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' });
    }
    else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    }
    next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
