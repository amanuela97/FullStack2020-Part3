const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.DB_URL

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
mongoose.connect(url,options)
  .then((_) => console.log('Successfully connected to database phonebook'))
  .catch((err) => console.log('DB error:',err.message))

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'Name must have atleast 3 characters'],
    unique: true,
    uniqueCaseInsensitive: true,
    required: 'name is required',
  },
  number: {
    type: String,
    minlength: [8, 'Number must have atleast 8 characters'],
    required: 'number is required',
  },
})

contactSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
contactSchema.plugin(uniqueValidator, { message: '{VALUE} already exist, name must be unique' })
const Contact = mongoose.model('Contact', contactSchema)

module.exports = Contact


