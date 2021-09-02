require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./model/contact.js')
const app = express()
const port = process.env.PORT || 3001

app.use(express.json())
app.use(express.static('build'))
app.use(cors())
morgan.token('data', function (req, _) {
    if(req.method === 'POST'){
        return JSON.stringify(req.body)
    }else{
        return null
    }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/api/persons', (_,res) => {
    Contact.find({}).then((contacts) => {
        res.json(contacts)
    })
})

app.post('/api/persons', (req,res) => {
    const body = req.body
    if(!body.name){
        return res.status(400).send({error: 'missing name value'})
    }else if(!body.number){
        return res.status(400).send({error:'missing number value'})
    }

    const contact = new Contact({
        name: body.name,
        number: body.number,
    }) 
    
    contact.save().then( savedContact => {
        res.json(savedContact)
    })
})

app.get('/info', (_,res) => {
    const entries = persons.length
    const message = `<p>Phonebook has info for ${entries} people</p>
    <p>${new Date()}</p>`
    res.send(message)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if(person){
        res.json(person)
    }else{
        res.status(404).send(`person with id ${id} not found :(`) 
    }
})

app.delete('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).send('person successfully deleted :)')
})

app.listen(port, (_,__) => {
    console.log(`app is live on port number ${port}`)
})


