const mongoose = require('mongoose')
const Schema = mongoose.Schema

const seasonSchema = new Schema({
    startDate: Date,
    endDate: Date,
    seasonType: String // bargain, low, mid, high, max ?
}, {
    timestamps: true
})

const Season = mongoose.model('Season', seasonSchema)
module.exports = Season