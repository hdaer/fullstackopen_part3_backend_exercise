/* eslint-disable no-unused-vars */
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const cors = require('cors')

const app = express()

morgan.token('body', (req) => JSON.stringify(req.body))

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// also remember to enable network access with correct IP in mongoDB online config
app.use(cors({
    origin: 'http://localhost:5173/', // Your frontend URL
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type']
}))

//CREATE
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    Person.find({}).then(persons => {

        // if (!body.name || !body.number) {
        //     return response.status(400).json({
        //         error: 'name or number missing'
        //     })
        // }

        if (persons.some(person => person.name === body.name)) {
            return response.status(400).json({
                error: 'name must be unique'
            })
        }

        const person = new Person({
            name: body.name,
            phoneNumber: body.number,
        })

        person.save().then(savedPerson => {
            response.json(savedPerson)
        })
            .catch(error => { next(error) })
    })
})

//RETRIEVE
app.get('/', (request, response) => {
    response.send('<h2>FullStackOpen part 3!</h2>')
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {

        const timestamp = new Date().toLocaleString('en-GB', {
            timeZone: 'Europe/Athens',
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZoneName: 'short'
        })

        response.send(`Phonebook has info for ${persons.length} people<br><br>${timestamp} (Eastern European Standard Time)`)
    })
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})


app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        }
        else {
            response.status(404).send('a person with this id could not be found').end()
        }
    }).catch(error => {
        response.status(400).send({ error: 'malformatted id' })
    })
})



//UPDATE
app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    const body = request.body


    Person.findByIdAndUpdate(
        id,
        { name: body.name, phoneNumber: body.number },
        { new: true }
    ).then(result => {
        if (result) {
            response.json(result)
        } else {
            response.status(404).json({ error: 'person not found' })
        }
    })
        .catch(error => next(error))



})

//DELETE
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then((result) => {

            if (result) {
                response.status(204).end()
            }
            else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})