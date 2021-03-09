const express = require("express")
const router = express.Router()
const { checkIfLoggedIn } = require("../middlewares")

const Lesson = require("../models/lesson.model")

// Date format is flexible, but should include 'z' at the end so JS doesn´t convert it to UTC, i.e '2021 apr 12z' or '2021-04-12z'
router.get("/filter", checkIfLoggedIn, (req, res) => {
  Lesson.find({ $and: [{ date: { $gt: req.query.startDate } }, { date: { $lte: req.query.endDate } }, { surfLevel: { $eq: req.query.surfLevel } }] })
    .populate({ path: "bookings", select: "name" })
    .sort("date")
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ code: 500, message: "Se ha producido un error", err: err.message }))
})

router.post("/new", checkIfLoggedIn, (req, res) => {
  const lesson = { ...req.body }

  Lesson.create(lesson)
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ code: 500, message: "No se ha podido crear la clase", err }))
})

router.put("/:_id", checkIfLoggedIn, (req, res) => {
  const lessonData = {
    surfLevel: req.body.surfLevel,
    instructor: req.body.instructor,
    bookings: req.body.bookings,
    deleteBooking: req.body.deleteBooking,
  }
  Lesson.findByIdAndUpdate(req.params._id, { ...lessonData, $pull: { bookings: lessonData.deleteBooking } }, { new: true, omitUndefined: true })
    .then((response) => res.json({ message: "Clase modificada" }))
    .catch((err) => res.status(500).json({ code: 500, message: "No se ha podido editar la clase", err }))
})

router.delete("/:_id", checkIfLoggedIn, (req, res) => {
  Lesson.findOneAndDelete({ _id: req.params._id })
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ code: 500, message: "Error deleting lesson", err }))
})

module.exports = router
