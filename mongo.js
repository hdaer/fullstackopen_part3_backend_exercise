const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]


const url = `mongodb+srv://fullstackopen:${password}@fullstackopen.smj4fae.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    }
})

const Person = mongoose.model('Person', personSchema)


if (process.argv[3]) {
    const person = new Person({
        name: process.argv[3],
        phoneNumber: process.argv[4],
    })

    person.save().then(result => {
        console.log('person saved!')
        mongoose.connection.close()
    })
}
else {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(person.name + " " + person.phoneNumber)
        })
        mongoose.connection.close()
    })
}


