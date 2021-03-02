const mongoose = require('mongoose')
const Schema = mongoose.Schema

const lessonSchema = new Schema({
    date: Date,
    instructor: {
        type: String,
        default: undefined
    },
    bookings: [{
        type: mongoose.Types.ObjectId,
        ref: 'Booking'
    }]
}, {
    timestamps: true
})

const Lesson = mongoose.model('Lesson', lessonSchema)
module.exports = Lesson