const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}
const args = process.argv
const password = args[2]

const url =
  `mongodb+srv://manu:${password}@cluster0.2hjb7.mongodb.net/phonebook?retryWrites=true&w=majority`

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

const Contact = mongoose.model('Contact', contactSchema)

if(args.length === 3){
    Contact.find({}).then((contacts) => {
        console.log("Phonebook:");
        contacts.forEach((contact) =>
            console.log(`${contact.name} ${contact.number}`)
        )
    }).finally((_) => mongoose.connection.close())
}else if(args.length === 5){
    const contact = new Contact({
        name: args[3].toString(),
        number: args[4].toString(),
    })
    contact.save().then((res) => console.log(`added ${res.name} number ${res.number} to phonebook`))
    .finally((_) => mongoose.connection.close())

}else{
    console.log('argument Name or Number is missing');
    mongoose.connection.close()
}


