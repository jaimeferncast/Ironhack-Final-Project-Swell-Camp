const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bedSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

const Bed = mongoose.model("Bed", bedSchema);
module.exports = Bed;
