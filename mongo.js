const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log('connected to MongoDB');
  })
  .catch(error => {
    console.error('error connecting to MongoDB:', error.message);
  });

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Person = mongoose.model('Person', phonebookSchema);

module.exports = Person;
