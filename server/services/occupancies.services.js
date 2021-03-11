const { countNights, fillArrayWithDates } = require("../utils")
const Occupancy = require("../models/occupancy.model")

const createOccupancies = async (bedIds, bookingId, arrivalDate, departureDate) => {
  const nNights = countNights(arrivalDate, departureDate)
  const bookingDates = fillArrayWithDates(arrivalDate, nNights)

  try {
    await Promise.all(
      bookingDates.map((elm, idx) => {
        Occupancy.create({ date: elm, bedId: bedIds[idx], booking: bookingId }).catch((err) => console.error(err))
      })
    )
  } catch (err) {
    throw new Error(err)
  }
}

const deleteOccupancies = (bookingId) => {
  return Occupancy.deleteMany({ booking: bookingId }).catch((err) => {
    throw new Error(err)
  })
}

module.exports = { createOccupancies, deleteOccupancies }
