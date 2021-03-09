const express = require("express")
const router = express.Router()
const { checkIfLoggedIn, checkIfAdmin } = require("../middlewares")

const Season = require("../models/season.model")

router.get("/", checkIfLoggedIn, (_req, res) => {
  Season.find()
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ code: 500, message: "Se ha producido un error", error: err.message }))
})

router.post("/new", checkIfAdmin, (req, res) => {
  const season = { ...req.body }

  Season.create(season)
    .then((response) => res.json(response))
    .catch((err) =>
      res.status(500).json({ code: 500, message: "No se ha podido crear la temporada", error: err.message })
    )
})

router.put("/:_id", checkIfAdmin, (req, res) => {
  Season.findByIdAndUpdate(req.params._id, req.body, { new: true })
    .then((response) => res.json(response))
    .catch((err) =>
      res.status(500).json({ code: 500, message: "No se ha podido editar la temporada", error: err.message })
    )
})

router.delete("/:_id", checkIfAdmin, (req, res) => {
  Season.findOneAndDelete({ _id: req.params._id })
    .then((response) => res.json(response))
    .catch((err) =>
      res.status(500).json({ code: 500, message: "No se ha podido borrar la temporada", error: err.message })
    )
})

module.exports = router
