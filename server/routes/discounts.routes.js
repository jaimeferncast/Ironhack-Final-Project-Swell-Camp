const express = require('express')
const router = express.Router()
const { checkIfAdmin } = require('../middlewares')

const Discount = require('../models/discount.model')

router.post('/', checkIfAdmin, (req, res) => {
  const discountData = ({ code, discountPercentage } = req.body)

  Discount.create(discountData)
    .then((response) => res.json(response))
    .catch((err) =>
      res.status(500).json({ code: 500, message: 'No se ha podido crear el código de descuento', error: err.message })
    )
})

router.delete('/', checkIfAdmin, (req, res) => {
  const { code } = req.body

  Discount.deleteOne({ code })
    .then((response) => res.json(response))
    .catch((err) =>
      res
        .status(500)
        .json({ code: 500, message: 'No se ha podido eliminar el código de descuento', error: err.message })
    )
})

module.exports = router
