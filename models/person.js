const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
    .then(() => {
        console.log(('connected to MongoDB'))
    })
    .catch(error => {
        console.log(('error connecting to MongoDB:', error.message))
    })

// if (process.argv.length < 3) {
//     console.log('give password as argument')
//     process.exit(1)
// }

// const password = process.argv[2]

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    phoneNumber: {
        type: String,
        minLength: 8,
        validate: {
            validator: (v) => {
                return /^(\d{2,3})-(\d+)$/.test(v)
            },
            message: props => `${props.value} is not a valid phone number!\nminimum of 8 numbers, starting with two or three digits plus a hyphen.`
        },
        required: true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
