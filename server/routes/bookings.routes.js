const express = require("express")
const { checkIfLoggedIn } = require("../middlewares")
const router = express.Router()

const Booking = require("../models/booking.model")

const { updateLessons, clearLessons } = require("../services/lessons.services")
const { updateMeals, clearMeals } = require("../services/meals.services")
const { createOccupancies, deleteOccupancies } = require("../services/occupancies.services")

// Get all bookings

router.get("/", checkIfLoggedIn, (_req, res) =>
  Booking.find()
    .then((bookings) => res.json({ message: bookings }))
    .catch((error) =>
      res.status(500).json({
        code: 500,
        message: "Error buscando las reservas",
        error: error.message,
      })
    )
)

// Get bookings with pending status

router.get("/pending", checkIfLoggedIn, (req, res) => {
  const curretnDay = new Date()
  const skip = (req.query.page - 1) * 5 // 5 results per page

  Booking.find({ status: "pending", "arrival.date": { $gte: curretnDay } })
    .skip(skip)
    .limit(5)
    .sort({ "arrival.date": 1, name: 1 })
    .then((bookings) => res.json({ message: bookings }))
    .catch((error) =>
      res.status(500).json({
        code: 500,
        message: "Error buscando las reservas pendientes",
        error: error.message,
      })
    )
})

// Get booking by name, dni or email

router.get("/open-search/:input", checkIfLoggedIn, (req, res) => {
  const skip = (req.query.page - 1) * 5 // 5 results per page

  Booking.find({
    $or: [
      { name: { $regex: `.*${req.params.input}.*` } },
      { dni: { $regex: `.*${req.params.input}.*` } },
      { email: { $regex: `.*${req.params.input}.*` } },
    ],
  })
    .skip(skip)
    .limit(5)
    .sort({ "arrival.date": 1 })
    .then((bookings) => res.json({ message: bookings }))
    .catch((error) =>
      res.status(500).json({
        code: 500,
        message: "Error buscando reservas",
        error: error.message,
      })
    )
})

// Get booking by id

router.get("/:_id", checkIfLoggedIn, (req, res) =>
  Booking.findById(req.params._id)
    .then((bookings) => res.json({ message: bookings }))
    .catch((error) =>
      res.status(500).json({
        code: 500,
        message: "Error buscando reservas",
        error: error.message,
      })
    )
)

// Create new booking

router.post("/new", checkIfLoggedIn, async (req, res) => {
  const bookingData = ({
    name,
    dni,
    email,
    phoneNumber,
    groupCode,
    accommodation,
    firstTime,
    surfLevel,
    foodMenu,
    discountCode,
    additionalInfo,
    referencedBy,
    status,
    bookingCode,
  } = req.body)

  bookingData.arrival = { date: req.body["arrival.date"], transfer: req.body["arrival.transfer"] }
  bookingData.departure = { date: req.body["departure.date"], transfer: req.body["departure.transfer"] }

  try {
    const newBooking = await Booking.create({
      ...bookingData,
    })

    if (newBooking.status === "accepted") {
      updateMeals(bookingData.arrival.date, bookingData.departure.date, bookingData.foodMenu)

      if (bookingData.surfLevel !== "noClass") {
        updateLessons(newBooking._id, bookingData.arrival.date, bookingData.departure.date, bookingData.surfLevel)
      }
    }
    res.json({ message: newBooking })
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Error creando reserva",
      error: error.message,
    })
  }
})

// Update booking

router.put("/:_id", checkIfLoggedIn, async (req, res) => {
  const bookingData = ({
    name,
    dni,
    email,
    phoneNumber,
    groupCode,
    accommodation,
    firstTime,
    surfLevel,
    foodMenu,
    discountCode,
    additionalInfo,
    referencedBy,
    price,
    paid,
    status,
    bookingCode,
  } = req.body)

  bookingData.arrival = { date: req.body["arrival.date"], transfer: req.body["arrival.transfer"] }
  bookingData.departure = { date: req.body["departure.date"], transfer: req.body["departure.transfer"] }

  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params._id,
      { ...bookingData },
      { omitUndefined: true, new: true }
    )
    res.json({ message: updatedBooking })

    if (req.body.status === "accepted") {
      req.body.surfLevel !== "noClass" &&
        updateLessons(
          updatedBooking._id,
          updatedBooking.arrival.date,
          updatedBooking.departure.date,
          updatedBooking.surfLevel
        )

      if (req.body.foodMenu) {
        updateMeals(updatedBooking.arrival.date, updatedBooking.departure.date, updatedBooking.foodMenu)
      }

      if (req.body.accommodation !== "none")
        createOccupancies(
          req.body.bedIds,
          updatedBooking._id,
          updatedBooking.arrival.date,
          updatedBooking.departure.date
        )
    }
  } catch (error) {
    res.status(500).json({ code: 500, message: "Error modificando reserva", error: error.message })
  }
})

// Delete booking

router.delete("/:_id", checkIfLoggedIn, (req, res) =>
  Booking.findByIdAndDelete(req.params._id)
    .then((deletedBooking) => {
      res.json({
        message: `La siguiente reserva fue eliminada:\n${deletedBooking}`,
      })

      if (req.body.status === "accepted") {
        deletedBooking.surfLevel !== "noClass" && clearLessons(deletedBooking._id)

        req.body.foodMenu &&
          clearMeals(deletedBooking.arrival.date, deletedBooking.departure.date, deletedBooking.foodMenu)

        req.body.accommodation !== "none" && deleteOccupancies(deletedBooking._id)
      }
    })
    .catch((error) =>
      res.status(500).json({
        code: 500,
        message: "Error eliminando reserva",
        error: error.message,
      })
    )
)

module.exports = router
