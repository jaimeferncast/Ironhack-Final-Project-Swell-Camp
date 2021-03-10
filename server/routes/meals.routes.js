const express = require("express")
const router = express.Router()
const { checkIfLoggedIn } = require("../middlewares")

const Meal = require("../models/meal.model")

// Get all meals filtered by date
// Date format is flexible, but should include 'z' at the end so JS doesn´t convert it to UTC, i.e '2021 apr 12z' or '2021-04-12z'
router.get("/filter", checkIfLoggedIn, (req, res) => {
  Meal.find({ $and: [{ date: { $gt: req.query.startDate } }, { date: { $lte: req.query.endDate } }] })
    .sort("date mealType")
    .then((response) => {
      const lunch = response.filter((meal) => meal.date.toUTCString().includes("14:00"))
      const dinner = response.filter((meal) => meal.date.toUTCString().includes("21:00"))

      res.json({ lunch, dinner })
    })
    .catch((err) => res.status(500).json({ code: 500, message: "Se ha producido un error", err }))
})

// Create new meal

router.post("/new", checkIfLoggedIn, (req, res) => {
  const meal = { ...req.body }
  Meal.create(meal)
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ code: 500, message: "No se ha podido crear la comida", err }))
})

// Update meal
// Add or remove number of meals from req.body

router.put("/:_id", checkIfLoggedIn, (req, res) => {
  const mealData = {
    date: req.body.date,
    mealType: req.body.mealType,
    quantity: req.body.quantity,
  }

  const changeQuantity = req.body.deleteQuantity
    ? -req.body.deleteQuantity
    : req.body.increaseQuantity
    ? req.body.increaseQuantity
    : 0

  Meal.findByIdAndUpdate(
    req.params._id,
    { ...mealData, $inc: { quantity: +changeQuantity } },
    { new: true, omitUndefined: true }
  )
    .then(() => res.json({ message: "Comida modificada" }))
    .catch((err) => res.status(500).json({ code: 500, message: "No se ha podido editar la comida", err }))
})

// Delete meal

router.delete("/:_id", checkIfLoggedIn, (req, res) => {
  Meal.findByIdAndDelete(req.params._id)
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ code: 500, message: "No se ha podido borrar la comida", err }))
})

module.exports = router
