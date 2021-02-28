const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mealSchema = new Schema({
    date: Date,
    mealType: {
        type: String,
        enum: ['comida', 'cena']
    },
    instructor: {
        type: String,
        default: undefined
    },
    students: [{
        type: mongoose.Types.ObjectId,  // Menu type will be included in the booking
        ref: 'Booking'
    }]
}, {
    timestamps: true
})

const Meal = mongoose.model('Meal', mealSchema)
module.exports = Meal