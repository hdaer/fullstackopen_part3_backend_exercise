const express = require('express')
const morgan = require('morgan')

const app = express()

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons =
    [
        {
            "id": "1",
            "name": "Arto Hellas",
            "number": "040-123456"
        },
        {
            "id": "2",
            "name": "Ada Lovelace",
            "number": "39-44-5323523"
        },
        {
            "id": "3",
            "name": "Dan Abramov",
            "number": "12-43-234345"
        },
        {
            "id": "4",
            "name": "Mary Poppendieck",
            "number": "39-23-6423122"
        }
    ]

const generateId = () => {
    const MIN = 1;
    const MAX = 999999
    const getRandomArbitrary = (min, max) => {
        return Math.random() * (max - min) + min;
    }
    const id = Math.floor(getRandomArbitrary(MIN, MAX))
    return id
}

app.post('/api/persons', (request, response) => {
    const body = request.body


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

    const person = {
        name: body.name,
        number: body.number || false,
        id: generateId(),
    }
    persons = persons.concat(person)
    response.json(person)
})


app.get('/', (request, response) => {
    response.send('<h2>FullStackOpen part 3!</h2>')
})

app.get('/info', (request, response) => {
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

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).send('a person with this id could not be found').end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id != id)

    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})