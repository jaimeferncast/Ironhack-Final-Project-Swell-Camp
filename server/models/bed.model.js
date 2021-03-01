const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bedSchema = new Schema({
    code: {
        type: String,
        unique: true,
        required: true,
    },
    rateType: {
        type: String,
        enum: ['accommodationLongbeach', 'accommodationCactusSingle', 'accommodationCactusDouble', 'accommodationCactusDeluxe']
    }
}, {
    timestamps: true
})

const Bed = mongoose.model('Bed', bedSchema)
module.exports = Bed
