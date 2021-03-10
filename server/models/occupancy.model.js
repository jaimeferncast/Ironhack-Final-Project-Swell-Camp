const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const occupancySchema = new Schema(
  {
    date: {
      type: Date,
      required: true
    },
    bedId: {
      type: Schema.Types.ObjectId,
      ref: "Bed"
    },

    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking"
    }
  },
  {
    timestamps: true
  }
);

const Occupancy = mongoose.model("Occupancy", occupancySchema);
module.exports = Occupancy;
