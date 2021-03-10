const express = require("express")
const router = express.Router()
const { checkIfLoggedIn } = require("../middlewares")

const { differenceInCalendarDays, addDays, isWithinInterval } = require("date-fns")

const Booking = require("../models/booking.model")
const Occupancy = require("../models/occupancy.model")
const Bed = require("../models/bed.model")

// Create new occupancy

router.post("/new", checkIfLoggedIn, async (req, res) => {
  const { booking, occupancyDate, bedCode } = req.body

  try {
    const ownerBooking = await Booking.findById(booking).select("name groupCode accommodation arrival departure")

    const nNights = differenceInCalendarDays(ownerBooking.departure.date, ownerBooking.arrival.date)

    const bookingDates = []
    for (let i = 0; i < nNights; i++) {
      bookingDates.push(addDays(ownerBooking.arrival.date, i))
    }

    const formattedDate = new Date(occupancyDate)

    if (
      !isWithinInterval(formattedDate, {
        start: bookingDates[0],
        end: bookingDates[nNights - 1],
      })
    ) {
      res.status(500).json({
        code: 500,
        message: `Esta reserva sólo incluye fechas entre ${ownerBooking.arrival.date} y ${ownerBooking.departure.date}`,
      })
    } else {
      const occupancyBed = await Bed.findOne({ code: bedCode })

      if (
        await Occupancy.exists({
          date: occupancyDate,
          bedId: occupancyBed._id,
        })
      ) {
        res.status(500).json({
          code: 500,
          message: `Esta cama ya está ocupada en la fecha ${occupancyDate}`,
        })
      } else {
        const newOccupancy = await Occupancy.create({
          date: occupancyDate,
          bedId: occupancyBed._id,
          booking,
        })
        res.json({ message: newOccupancy })
      }
    }
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message })
  }
})

// Get all occupancies

router.get("/", checkIfLoggedIn, (_req, res) =>
  Occupancy.find()
    .populate("booking", "name")
    .then((occupancies) => res.json({ message: occupancies }))
    .catch((error) => res.status(500).json({ code: 500, message: "Se ha producido un error", error: error.message }))
)

// Get occupancies by date

router.get("/range", checkIfLoggedIn, (req, res) =>
  Occupancy.find({ date: { $gte: req.query.startDate, $lte: req.query.endDate } })
    .populate("booking")
    .then((occupancies) => res.json({ message: occupancies }))
    .catch((error) => res.status(500).json({ code: 500, message: "Se ha producido un error", error: error.message }))
)

// Update occupancy

router.put("/:_id", checkIfLoggedIn, async (req, res) => {
  try {
    const updatedBed = await Bed.findById(req.body.bedId)

    const updatedOccupancy = await Occupancy.findByIdAndUpdate(
      req.params._id,
      { bedId: updatedBed },
      { omitUndefined: true, new: true }
    )
    res.json({ message: updatedOccupancy })
  } catch (error) {
    res.status(500).json({ code: 500, message: "No se ha podido actualizar la ocupación", error: error.message })
  }
})

// Delete one occupancy by id

router.delete("/delete/:_id", checkIfLoggedIn, (req, res) =>
  Occupancy.findByIdAndDelete(req.params._id)
    .then(() => res.json({ message: "Ocupación eliminada con éxito" }))
    .catch((error) => res.status(500).json({ code: 500, message: "Se ha producido un error", error: error.message }))
)

// Delete occupancies by date

router.delete("/:date", checkIfLoggedIn, (req, res) =>
  Occupancy.deleteMany({ date: new Date(req.params.date) })
    .then(() => res.json({ message: "Ocupaciones eliminadas con éxito" }))
    .catch((err) => res.status(500).json({ code: 500, message: "Se ha producido un error", error: err.message }))
)

module.exports = router
