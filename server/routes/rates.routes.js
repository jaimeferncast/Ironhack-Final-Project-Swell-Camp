const express = require('express')
const router = express.Router()

const Rate = require('../models/rate.model')


router.get('/', (req, res) => {

    Rate
        .find()
        .then(response => res.json(response))
        .catch(err => res.status(500).json({ code: 500, message: 'Error fetching all rates', err }))
})


router.get('/filter', (req, res) => {

    Rate
        .find({ $and: [{ rateType: req.query.rateType }, { number: req.query.number }, { season: req.query.season }] })
        .then(response => res.json(...response))
        .catch(err => res.status(500).json({ code: 500, message: 'Error fetching rates', err }))
})


router.post('/new', (req, res) => {

    const rate = { ...req.body }

    Rate
        .create(rate)
        .then(response => res.json(response))
        .catch(err => res.status(500).json({ code: 500, message: 'Error saving rate', err }))
})


router.put('/:_id', (req, res) => {

    Rate
        .findByIdAndUpdate(req.params._id, req.body, { new: true })
        .then(response => res.json(response))
        .catch(err => res.status(500).json({ code: 500, message: 'Error editing rate', err }))
})


router.delete('/:_id', (req, res) => {

    Rate
        .findOneAndDelete({ _id: req.params._id })
        .then(response => res.json(response))
        .catch(err => res.status(500).json({ code: 500, message: 'Error deleting rate', err }))
})


module.exports = router