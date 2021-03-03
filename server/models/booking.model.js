const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const crypto = require("crypto");

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
      enum: ["none", "Longbeach Surf House", "Cactus Salinas"],
      default: "none",
      required: true
    },

    arrival: {
      date: {
        type: Date,
        required: true
      },
      transfer: {
        type: Boolean,
        default: false
      }
    },

    departure: {
      date: {
        type: Date,
        required: true
      },
      transfer: {
        type: Boolean,
        default: false
      }
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

    price: {
      type: Number,
      required: true,
      min: 0
    },

    paid: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "cancelled"],
      default: "pending"
    },

    bookingCode: {
      type: String,
      unique: true,
      default: generateCode
    }
  },
  {
    timestamps: true
  }
);

bookingSchema.pre("validate", function (next) {
  if (this.arrivalDate > this.departureDate) {
    next(new Error("End date must be greater that Start date")); // no funciona al testear con postman
  } else if (this.arrivalDate < new Date()) {
    next(new Error("Arrival date must be greater than current date"));
  } else if (this.accomodation === "none" && this.surfLevel === "noClass") {
    next(
      new Error(
        "Invalid booking data: You must select either accomodation or classes"
      )
    );
  } else {
    next();
  }
});

function generateCode() {
  return crypto.randomBytes(2).toString("hex");
}
const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
