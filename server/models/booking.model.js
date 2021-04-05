const mongoose = require('mongoose')
const Schema = mongoose.Schema

const crypto = require('crypto')

const calculateRate = require('../services/calculateRate.services')

const bookingSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Introduce tu nombre'],
    },
    dni: {
      type: String,
      trim: true,
      required: [true, 'Introduce tu DNI'],
      validate: {
        validator: function (dniInput) {
          return /^\d{8}[A-HJ-NP-TV-Z]$|^[K,L,M,X,Y,Z]\d{7}[A-HJ-NP-TV-Z]$/gim.test(dniInput)
        },
        message: (props) => `${props.value} is not a valid dni number`,
      },
    },
    email: {
      type: String,
      trim: true,
      required: [true, 'Introduce tu email'],
      validate: {
        validator: function (emailInput) {
          return /^([\w-\.\+]+@([\w-]+\.)+[\w-]{2,4})?$/gi.test(emailInput)
        },
        message: (props) => `${props.value} is not a valid email`,
      },
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    groupCode: {
      type: String,
      trim: true,
    },

    accommodation: {
      type: String,
      enum: [
        'none',
        'surfcampLongbeach',
        'surfcampCactus',
        'surfcampJunior',
        'surfcampSpecial',
        'accommodationLongbeach',
        'accommodationSingle',
        'accommodationDouble',
        'accommodationDeluxe',
      ],
      default: 'none',
      required: true,
    },

    arrival: {
      date: {
        type: Date,
        required: [true, 'Debes especificar una fecha de llegada'],
      },
      transfer: {
        type: String,
        default: '',
      },
    },

    departure: {
      date: {
        type: Date,
        required: [true, 'Debes especificar una fecha de salida'],
      },
      transfer: {
        type: String,
        default: '',
      },
    },

    firstTime: {
      type: Boolean,
      default: true,
      required: true,
    },

    surfLevel: {
      type: String,
      enum: ['0', '0.5', '1', '1.5', '2', 'noClass'],
      required: true,
    },

    foodMenu: {
      type: String,
      default: 'Normal',
    },

    discountCode: {
      type: String,
      trim: true,
    },

    additionalInfo: String,

    referencedBy: String,

    price: {
      type: Number,
      min: 0,
    },

    paid: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ['pending', 'accepted', 'cancelled'],
      default: 'pending',
    },

    bookingCode: {
      type: String,
      unique: true,
      default: generateCode,
    },
  },
  {
    timestamps: true,
  }
)

bookingSchema.pre('validate', function (next) {
  if (this.arrival.date > this.departure.date) {
    next(new Error('La fecha de salida debe ser mayor que la de llegada'))
  } else if (this.arrival.date < new Date()) {
    next(new Error('La fecha de llegada debe ser mayor que la actual'))
  } else if (this.accommodation === 'none' && this.surfLevel === 'noClass') {
    next(new Error('Invalid booking data: You must select either accommodation or classes'))
  } else {
    next()
  }
})

bookingSchema.pre('save', async function () {
  if (this.accommodation == 'none') {
    this.status = 'accepted'
  }
  this.price = await calculateRate(
    this.accommodation,
    this.departure.date,
    this.arrival.date,
    this.surfLevel,
    this.discountCode
  )
})

function generateCode() {
  return crypto.randomBytes(2).toString('hex')
}

const Booking = mongoose.model('Booking', bookingSchema)
module.exports = Booking
