const express = require("express");
const router = express.Router();
const { dateFormat } = require("../utils");

const Booking = require("../models/booking.model");

// Create new booking
router.post("/new", async (req, res) => {
  const newBookingData = {
    name: req.body.name,
    dni: req.body.dni,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    groupCode: req.body.groupCode,
    accomodation: req.body.accomodation,
    arrivalDate: req.body.arrivalDate,
    arrivalTransfer: req.body.arrivalTransfer,
    departureDate: req.body.departureDate,
    departureTransfer: req.body.departureTransfer,
    firstTime: req.body.firstTime,
    surfLevel: req.body.surfLevel,
    foodMenu: req.body.foodMenu,
    discountCode: req.body.discountCode,
    additionalInfo: req.body.additionalInfo,
    referencedBy: req.body.referencedBy,
    paid: req.body.paid,
    status: req.body.accomodation === "none" ? "accepted" : "pending"
  };

  try {
    const newBooking = await Booking.create({ ...newBookingData });
    res.status(200).json({ message: newBooking });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error creating booking", error: error.message });
  }
});
module.exports = router;
