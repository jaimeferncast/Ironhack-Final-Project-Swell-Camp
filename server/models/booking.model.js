const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },
    dni: {
      type: String,
      trim: true,
      required: true,
      validate: {
        validator: function (dniInput) {
          return /^\d{8}[A-HJ-NP-TV-Z]$|^[K,L,M,X,Y,Z]\d{7}[A-HJ-NP-TV-Z]$/gim.test(
            dniInput
          );
        },
        message: (props) => `${props.value} is not a valid dni number`
      }
    },
    email: {
      type: String,
      trim: true,
      required: true,
      validate: {
        validator: function (emailInput) {
          return /^([\w-\.\+]+@([\w-]+\.)+[\w-]{2,4})?$/gi.test(emailInput);
        },
        message: (props) => `${props.value} is not a valid email`
      }
    },
    phoneNumber: {
      type: String,
      trim: true,
      validate: {
        validator: function (phoneInput) {
          return /^\d{9}$/g.test(phoneInput);
        }
      }
    },
    groupCode: {
      type: String,
      trim: true
    },

    accomodation: {
      type: String,
      enum: ["Longbeach Surf House", "Cactus Salinas"],
      default: "Longbeach Sur House"
    },

    arrivalDate: {
      type: String,
      required: true,
      validate: {
        validator: function (dateInput) {
          return /^(\d{2})\/(\d{2})$/g.test(dateInput);
        }
      }
    },

    arrivalTransfer: {
      type: Boolean,
      default: false
    },

    departureDate: {
      type: String,
      required: true,
      validate: {
        validator: function (dateInput) {
          return /^(\d{2})\/(\d{2})$/g.test(dateInput);
        }
      }
    },

    departureTransfer: {
      type: Boolean,
      default: false
    },

    firstTime: {
      type: Boolean,
      default: true,
      required: true
    },

    surfLevel: {
      type: String,
      enum: ["0", "0.5", "1", "1.5", "2", "noClass"],
      required: true
    },

    foodMenu: {
      type: String,
      required: true
    },

    discountCode: {
      type: String,
      trim: true
    },

    additionalInfo: String,

    referencedBy: String,

    paid: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "cancelled"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
