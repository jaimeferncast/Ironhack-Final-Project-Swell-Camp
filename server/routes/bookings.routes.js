const express = require("express")
const router = express.Router()

const Booking = require("../models/booking.model")

const { updateLessons, clearLessons } = require("../services/lessons.services")
const { updateMeals, clearMeals } = require("../services/meals.services")
const { createOccupancies, deleteOccupancies } = require("../services/occupancies.services")
const CalculateRateService = require("../services/bookings.services")

// Get all bookings
// TO-DO
// Add loggedIn middleware
router.get("/", (_req, res) =>
  Booking.find()
    .then((bookings) => res.status(200).json({ message: bookings }))
    .catch((error) =>
      res.status(500).json({
        message: "Error buscando las reservas",
        error: error.message,
      })
    )
)

// Get bookings with pending status
// TO-DO
// Add loggedIn middleware
router.get("/pending", (_req, res) =>
  Booking.find({ status: "pending" })
    .then((bookings) => res.status(200).json({ message: bookings }))
    .catch((error) =>
      res.status(500).json({
        message: "Error buscando las reservas pendientes",
        error: error.message,
      })
    )
)

// Test route
// TO-DO
// remove
router.post("/test", async (req, res) => {
  const calculateRate = new CalculateRateService(req.body.accomodationType, req.body.surfLevel, req.body.arrivalDate, req.body.departureDate)
  const price = await calculateRate.getFinalRate()
  console.log(typeof price, price)
  res.json(price)
})

// Get booking by DNI number
// TO-DO
// Add loggedIn middleware
router.get("/:dni", (req, res) =>
  Booking.find({ dni: req.params.dni })
    .then((bookings) => res.status(200).json({ message: bookings }))
    .catch((error) =>
      res.status(500).json({
        message: "Error buscando reservas",
        error: error.message,
      })
    )
)

// Create new booking
// TO-DO
// Add loggedIn middleware
router.post("/new", async (req, res) => {
  const calculateRate = new CalculateRateService(req.body.accomodation, req.body.surfLevel, req.body["arrival.date"], req.body["departure.date"])
  const price = await calculateRate.getFinalRate()
  console.log(typeof price, price)

  try {
    const newBooking = await Booking.create({
      ...req.body,
      price: price,
    })
    res.status(200).json({ message: newBooking })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Error creando reserva",
      error: error.message,
    })
  }
})

// Update booking
// TO-DO
// Add loggedIn middleware
router.put("/:bookingCode", async (req, res) => {
  try {
    const updatedBooking = await Booking.findOneAndUpdate({ bookingCode: req.params.bookingCode }, { ...req.body }, { omitUndefined: true, new: true })
    res.json({ message: updatedBooking })

    if (req.body.status === "accepted") {
      !(req.body.surfLevel === "noClass") && updateLessons(updatedBooking._id, updatedBooking.arrival.date, updatedBooking.departure.date, updatedBooking.surfLevel)

      req.body.foodMenu && updateMeals(updatedBooking.arrival.date, updatedBooking.departure.date, updatedBooking.foodMenu)

      !(req.body.accomodation === "none") && createOccupancies(req.body.bedId, updatedBooking._id, updatedBooking.arrival.date, updatedBooking.departure.date)
    }
  } catch (error) {
    res.status(500).json({ message: "Error modificando reserva", error: error.message })
  }
})

// Delete booking
// TO-DO
// Add loggedIn middleware
router.delete("/:_id", (req, res) =>
  Booking.findByIdAndDelete(req.params._id)
    .then((deletedBooking) => {
      res.json({
        message: `La siguiente reserva fue eliminada:\n${deletedBooking}`,
      })

      if (req.body.status === "accepted") {
        !(deletedBooking.surfLevel === "noClass") && clearLessons(deletedBooking._id)

        req.body.foodMenu && clearMeals(deletedBooking.arrival.date, deletedBooking.departure.date, deletedBooking.foodMenu)

        !(req.body.accomodation === "none") && deleteOccupancies(deletedBooking._id)
      }
    })
    .catch((error) =>
      res.status(500).json({
        message: "Error eliminando reserva",
        error: error.message,
      })
    )
)

module.exports = router
