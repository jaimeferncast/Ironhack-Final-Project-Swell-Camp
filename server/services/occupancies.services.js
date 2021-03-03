const { countNights, fillArrayWithDates } = require("../utils")
const Occupancy = require("../models/occupancy.model")

const createOccupancies = (bedId, bookingId, arrivalDate, departureDate) => {

    const nNights = countNights(arrivalDate, departureDate)
    const bookingDates = fillArrayWithDates(arrivalDate, nNights)

    bookingDates.forEach(elm => {
        Occupancy
            .create({ date: elm, bedId, booking: bookingId })
            .catch((err) => console.error(err))
    })
}

const deleteOccupancies = (bookingId) => {
    Occupancy
        .deleteMany({ booking: bookingId })
        .catch((err) => console.error(err))
}

module.exports = { createOccupancies, deleteOccupancies }