const mongoose = require('mongoose')

const url = process.env.DB_URL

const options = { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
}
mongoose.connect(url,options)
.then((_) => console.log(`Successfully connected to database phonebook`))
.catch((err) => console.log('DB error:',err.message))

const contactSchema = new mongoose.Schema({
    name: String,
    number: String
})

contactSchema.set('toJSON', {
    transform: (_, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

const Contact = mongoose.model('Contact', contactSchema)

module.exports = Contact


