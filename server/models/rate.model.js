const mongoose = require("mongoose")
const Schema = mongoose.Schema

const rateSchema = new Schema(
  {
    rateType: {
      type: String,
      enum: [
        "surfcampLongbeach",
        "surfcampCactus",
        "surfcampJunior",
        "surfcampSpecial",
        "lessons",
        "accommodationLongbeach",
        "accommodationCactusSingle",
        "accommodationCactusDouble",
        "accommodationCactusDeluxe",
      ],
    },
    number: Number,
    season: String,
    rate: Number,
  },
  {
    timestamps: true,
  }
)

const Rate = mongoose.model("Rate", rateSchema)
module.exports = Rate
