const mongoose = require('mongoose')
const Schema = mongoose.Schema

const discountSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Discount = mongoose.model('Discount', discountSchema)
module.exports = Discount
