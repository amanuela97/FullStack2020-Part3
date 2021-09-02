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
    Contact.find({}).countDocuments()
    .then((entries) =>{
        res.send(`
        <p>Phonebook has info for ${entries} people</p>
        <p>${new Date}</p>
        `)
    }).catch((_) => console.log('error counting entries'))
})

app.get('/api/persons/:id', (req, res, next) => {
    Contact.findById(req.params.id)
    .then(contact => {
      if (contact) {
        res.json(contact)
      } else {
        res.status(404).end() 
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const { name, number } = req.body
    const contact = {
        name:name,
        number:number
    }
    Contact.findByIdAndUpdate(req.params.id, contact, {new: true})
      .then((updatedContact) => {
        if (updatedContact) {
            res.json(updatedContact)
          } else {
            res.status(404).end() 
          }
      })
      .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req,res) => {
    Contact.findByIdAndRemove(req.params.id)
    .then(_ => {
      res.status(204).end()
    })
    .catch(error => next(error))
})


const unknownEndpoint = (_, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
//middleware for unknown end points
app.use(unknownEndpoint)

const errorHandler = (error, _, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
}

// middleware for result to errors
app.use(errorHandler)

app.listen(port, (_,__) => {
    console.log(`app is live on port number ${port}`)
})


