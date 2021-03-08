const express = require("express")
const router = express.Router()

const Lesson = require("../models/lesson.model")

// Date format is flexible, but should include 'z' at the end so JS doesn´t convert it to UTC, i.e '2021 apr 12z' or '2021-04-12z'
router.get("/filter", (req, res) => {
  console.log(req.query)
  Lesson.find({ $and: [{ date: { $gt: req.query.startDate } }, { date: { $lte: req.query.endDate } }, { surfLevel: { $eq: req.query.surfLevel } }] })
    .populate({ path: "bookings", select: "name" })
    .sort("date") // TO-DO: To see at a later stage which fields are required from 'student' (bookings collection) to pass as second argument
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ code: 500, message: "Se ha producido un error", err: err.message }))
})

router.post("/new", (req, res) => {
  const lesson = { ...req.body }

  Lesson.create(lesson)
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ code: 500, message: "No se ha podido crear la clase", err }))
})

router.put("/:_id", (req, res) => {
  Lesson.findByIdAndUpdate(req.params._id, req.body, { new: true })
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ code: 500, message: "No se ha podido editar la clase", err }))
})

router.delete("/:_id", (req, res) => {
  Lesson.findOneAndDelete({ _id: req.params._id })
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ code: 500, message: "Error deleting lesson", err }))
})

module.exports = router
