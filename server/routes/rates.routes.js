const express = require("express")
const router = express.Router()
const { checkIfLoggedIn, checkIfAdmin } = require("../middlewares")

const Rate = require("../models/rate.model")

router.get("/", checkIfLoggedIn, (_req, res) => {
  Rate.find()
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ code: 500, message: "Se ha producido un error", error: err }))
})

router.get("/filter", checkIfLoggedIn, (req, res) => {
  Rate.find({ $and: [{ rateType: req.query.rateType }, { number: req.query.number }, { season: req.query.season }] })
    .then((response) => res.json(...response))
    .catch((err) => res.status(500).json({ code: 500, message: "Se ha producido un error", error: err }))
})

router.post("/new", checkIfAdmin, (req, res) => {
  const rate = { ...req.body }

  Rate.create(rate)
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ code: 500, message: "No se ha podido crear la tarifa", error: err.message }))
})

router.put("/:_id", checkIfAdmin, (req, res) => {
  Rate.findByIdAndUpdate(req.params._id, req.body, { new: true })
    .then((response) => res.json(response))
    .catch((err) =>
      res.status(500).json({ code: 500, message: "No se ha podido editar la tarifa", error: err.message })
    )
})

router.delete("/:_id", checkIfAdmin, (req, res) => {
  Rate.findOneAndDelete({ _id: req.params._id })
    .then((response) => res.json(response))
    .catch((err) =>
      res.status(500).json({ code: 500, message: "No se ha podido borrar la tarifa", error: err.message })
    )
})

module.exports = router
