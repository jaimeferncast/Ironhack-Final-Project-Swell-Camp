const { countNights, fillArrayWithDates } = require("../utils")
const addHours = require("date-fns/addHours")
const Lesson = require("../models/lesson.model")

const updateLesson = (bookingId, arrivalDate, departureDate, surfLevel) => {

    const nNights = countNights(arrivalDate, departureDate)

    const bookingDates = []
    fillArrayWithDates(arrivalDate, nNights, bookingDates)

    const bookingLessons = []
    bookingDates.forEach(elm => {
        bookingLessons.push(addHours(new Date(elm), 16))
        bookingLessons.push(addHours(new Date(elm), 34))
    })

    bookingLessons.forEach(elm => {
        Lesson
            .findOne({ date: elm, surfLevel })
            .select('_id bookings')
            .then(lesson => {
                if (lesson) {
                    const bookingsInLesson = lesson.bookings
                    bookingsInLesson.push(bookingId)
                    return Lesson.findByIdAndUpdate(lesson._id, { bookings: bookingsInLesson })
                } else {
                    return Lesson.create({ date: elm, surfLevel, bookings: [bookingId] })
                }
            })
            .catch((err) => console.error(err))
    })
}

module.exports = { updateLesson }