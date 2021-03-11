const { countNights, fillArrayWithDates, forkDates } = require("../utils")
const Lesson = require("../models/lesson.model")

const updateLessons = (bookingId, arrivalDate, departureDate, surfLevel) => {
  const nNights = countNights(arrivalDate, departureDate)
  const bookingDates = fillArrayWithDates(arrivalDate, nNights)
  const bookingLessons = forkDates(bookingDates, 16, 34)
  bookingLessons.forEach((elm) => {
    Lesson.findOneAndUpdate({ date: elm, surfLevel }, { $push: { bookings: bookingId } }, { upsert: true, new: true, setDefaultsOnInsert: true }).catch((err) => console.error(err))
  })
}

const clearLessons = (bookingId) => {
  return Lesson.updateMany({ bookings: { $all: [bookingId] } }, { $pull: { bookings: bookingId } }).catch((err) => console.error(err))
}

module.exports = { updateLessons, clearLessons }
