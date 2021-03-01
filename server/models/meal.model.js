const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mealSchema = new Schema({
    date: Date,
    mealTime: {
        type: String,
        enum: ['comida', 'cena']
    },
    mealType: String,
    quantity: Number
}, {
    timestamps: true
})

const Meal = mongoose.model('Meal', mealSchema)
module.exports = Meal