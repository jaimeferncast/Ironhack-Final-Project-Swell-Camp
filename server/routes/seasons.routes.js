const express = require("express")
const router = express.Router()

const Season = require("../models/season.model")

router.get("/", (_req, res) => {
  Season.find()
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ code: 500, message: "Se ha producido un error", err }))
})

router.post("/new", (req, res) => {
  const season = { ...req.body }

  Season.create(season)
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ code: 500, message: "No se ha podido crear la temporada", err }))
})

router.put("/:_id", (req, res) => {
  Season.findByIdAndUpdate(req.params._id, req.body, { new: true })
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ code: 500, message: "No se ha podido editar la temporada", err }))
})

router.delete("/:_id", (req, res) => {
  Season.findOneAndDelete({ _id: req.params._id })
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ code: 500, message: "No se ha podido borrar la temporada", err }))
})

module.exports = router
