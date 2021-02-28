const express = require("express");
const router = express.Router();

const differenceInCalendarDays = require("date-fns/differenceInCalendarDays");
const addDays = require("date-fns/addDays");
const isWithinInterval = require("date-fns/isWithinInterval");

const Booking = require("../models/booking.model");
const Occupancy = require("../models/occupancy.model");
const Bed = require("../models/bed.model");

// Create new occupancy
// TO-DO
// Add loggedIn middleware
router.post("/new", async (req, res) => {
  const { booking, occupancyDate, bedCode } = req.body;
  try {
    const ownerBooking = await Booking.findById(booking).select(
      "name groupCode accomodation arrivalDate departureDate"
    );

    const nNights = differenceInCalendarDays(
      ownerBooking.departureDate,
      ownerBooking.arrivalDate
    );
    const bookingDates = [];
    for (let i = 0; i < nNights; i++) {
      bookingDates.push(addDays(ownerBooking.arrivalDate, i));
    }

    const formattedDate = new Date(occupancyDate);
    if (
      !isWithinInterval(formattedDate, {
        start: bookingDates[0],
        end: bookingDates[nNights - 1]
      })
    ) {
      res.status(500).json({
        message: `This booking only includes dates from ${ownerBooking.arrivalDate} to ${ownerBooking.departureDate}`
      });
    } else {
      const occupancyBed = await Bed.find({ code: bedCode });
      if (
        await Occupancy.exists({
          date: occupancyDate,
          bedCode: occupancyBed[0]._id
        })
      ) {
        res.status(500).json({
          message: `This bed is already occupied for ${occupancyDate}`
        });
      } else {
        const newOccupancy = await Occupancy.create({
          date: occupancyDate,
          bedCode: occupancyBed[0]._id,
          booking
        });
        res.status(200).json({ message: newOccupancy });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
