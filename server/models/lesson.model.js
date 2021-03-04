const mongoose = require('mongoose')
const Schema = mongoose.Schema

const lessonSchema = new Schema({
    date: Date,
    surfLevel: {
        type: String,
        enum: ["0", "0.5", "1", "1.5", "2"],
        required: true
    },
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