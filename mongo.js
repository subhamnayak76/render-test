const mongoose = require('mongoose');


const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Person = mongoose.model('Person', phonebookSchema);
module.exports = Person;

// person.save().then(result => {
//     console.log(`added ${result.name} number ${result.number} to phonebook`);
//     mongoose.connection.close();
// });

