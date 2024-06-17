const mongoose = require('mongoose');

const url = `mongodb+srv://subhamnayak9638:${password}@cluster0.b2awyto.mongodb.net/`
mongoose.set('strictQuery',false)

mongoose.connect(url)

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

