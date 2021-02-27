const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const occupancySchema = new Schema(
  {
    date: {
      type: String,
      required: true,
      validate: {
        validator: function (dateInput) {
          return /^(\d{2})\/(\d{2})$/g.test(dateInput);
        }
      }
    },
    bedCode: {
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
