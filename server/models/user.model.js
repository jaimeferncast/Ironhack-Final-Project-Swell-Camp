const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["STAFF", "ADMIN"],
      default: "STAFF"
    }
  },
  {
    timestamps: true
  }
);

// userSchema.pre('validate', async function () {
//   if (this.accommodation == 'none') {
//     this.status = 'accepted'
//   }

//   this.price = await calculateRate(
//     this.accommodation,
//     this.departure.date,
//     this.arrival.date,
//     this.surfLevel,
//     this.discountCode
//   )

//   if (this.phoneNumber === '') this.phoneNumber = undefined
//   if (this.groupCode === '') this.groupCode = undefined
//   if (this.discountCode === '') this.discountCode = undefined
//   if (this.additionalInfo === '') this.additionalInfo = undefined
//   if (this.arrival.transfer === '') this.arrival.transfer = undefined
//   if (this.departure.transfer === '') this.departure.transfer = undefined
// })

const User = mongoose.model("User", userSchema);
module.exports = User;
