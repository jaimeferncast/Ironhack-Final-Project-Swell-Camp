const express = require("express")
const router = express.Router()

const Booking = require("../models/booking.model")

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
  const calculateRate = new CalculateRateService(
    req.body.accomodationType,
    req.body.surfLevel,
    req.body.arrivalDate,
    req.body.departureDate
  )
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
  console.log(req.body)
  console.log(req.body["arrival.date"])

  const calculateRate = new CalculateRateService(
    req.body.accomodation,
    req.body.surfLevel,
    req.body["arrival.date"],
    req.body["departure.date"]
  )
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
router.put("/:bookingCode", (req, res) =>
  Booking.findOneAndUpdate(
    { bookingCode: req.params.bookingCode },
    { ...req.body },
    { omitUndefined: true, new: true }
  )
    .then((updatedBooking) => res.json({ message: updatedBooking }))
    .catch((error) =>
      res
        .status(500)
        .json({ message: "Error modificando reserva", error: error.message })
    )
)

// Delete booking
// TO-DO
// Add loggedIn middleware
router.delete("/:_id", (req, res) =>
  Booking.findByIdAndDelete(req.params._id)
    .then((deletedBooking) =>
      res.json({
        message: `La siguiente reserva fue eliminada:\n${deletedBooking}`,
      })
    )
    .catch((error) =>
      res.status(500).json({
        message: "Error eliminando reserva",
        error: error.message,
      })
    )
)

module.exports = router
