require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

//CREATE

app.post('/api/persons', (request, response) => {
    const body = request.body

    const persons = Person.find({}).then(persons => {

        if (!body.name || !body.number) {
            return response.status(400).json({
                error: 'name or number missing'
            })
        }

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
        });

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
        response.json(person)
    }).catch(error => {
        response.status(404).send('a person with this id could not be found' + ": " + error.message).end()
    })
})



//UPDATE

// app.put



//DELETE

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id != id)

    response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})