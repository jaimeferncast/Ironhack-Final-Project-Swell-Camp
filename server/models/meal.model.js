const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mealSchema = new Schema({
    date: Date,
    mealType: String,
    quantity: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
})

const Meal = mongoose.model('Meal', mealSchema)
module.exports = Meal