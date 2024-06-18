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

  const phoneRegex = /^(\d{2,3})-(\d{5,})$/;

  const phonebookSchema = new mongoose.Schema({
      name: {
          type: String,
          minlength: 3,
          required: true,
      },
      number: {
          type: String,
          required: true,
          validate: {
              validator: function(v) {
                  return phoneRegex.test(v);
              },
              message: props => `${props.value} is not a valid phone number!`
          }
      },
  });
const Person = mongoose.model('Person', phonebookSchema);

module.exports = Person;
