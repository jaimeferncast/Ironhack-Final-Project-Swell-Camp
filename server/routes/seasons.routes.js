const express = require('express')
const router = express.Router()

const Season = require('../models/season.model')


router.get('/', (req, res) => {

    Season
        .find()
        .then(response => res.json(response))
        .catch(err => res.status(500).json({ code: 500, message: 'Error fetching all seasons', err }))
})


router.post('/new', (req, res) => {

    const season = { ...req.body }

    Season
        .create(season)
        .then(response => res.json(response))
        .catch(err => res.status(500).json({ code: 500, message: 'Error saving season', err }))
})


router.put('/:_id', (req, res) => {

    Season
        .findByIdAndUpdate(req.params._id, req.body, { new: true })
        .then(response => res.json(response))
        .catch(err => res.status(500).json({ code: 500, message: 'Error editing season', err }))
})


router.delete('/:_id', (req, res) => {

    Season
        .findOneAndDelete({ _id: req.params._id })
        .then(response => res.json(response))
        .catch(err => res.status(500).json({ code: 500, message: 'Error deleting season', err }))
})


module.exports = router