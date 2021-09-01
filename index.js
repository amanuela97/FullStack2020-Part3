const express = require('express')
const morgan = require('morgan')
const app = express()
const port = 3001

app.use(express.json())
morgan.token('data', function (req, _) {
    if(req.method === 'POST'){
        return JSON.stringify(req.body)
    }else{
        return null
    }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => {
    return Math.floor(Math.random() * 10000 * 1)
}

app.get('/api/persons', (_,res) => {
    res.json(persons)
})

app.post('/api/persons', (req,res) => {
    const body = req.body
    if(!body.name){
        return res.status(400).send({error: 'missing name value'})
    }else if(!body.number){
        return res.status(400).send({error:'missing number value'})
    }else if(persons.some(person => person.name === body.name)){
        return res.status(400).send({error:'name must be unique'})
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }
    persons = persons.concat(person)  
    res.json(person)
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

app.listen(port, (req,res) => {
    console.log(`app is live on port number ${port}`)
})


