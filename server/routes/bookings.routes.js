const express = require("express");
const router = express.Router();

const Booking = require("../models/booking.model");

// Get all bookings
// TO-DO
// Add loggedIn middleware
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json({ message: bookings });
  } catch (error) {
    res.status(500).json({
      message: "Error getting bookings from DB",
      error: error.message
    });
  }
});

// Get bookings with pending status
// TO-DO
// Add loggedIn middleware
router.get("/pending", async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "pending" });
    res.status(200).json({ message: bookings });
  } catch (error) {
    res.status(500).json({
      message: "Error getting bookings from DB",
      error: error.message
    });
  }
});

// Create new booking
// TO-DO
// Add loggedIn middleware
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

// Update booking
// TO-DO
// Add loggedIn middleware
router.put("/:_id", async (req, res) => {
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
    status: req.body.status
  };
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params._id,
      { ...newBookingData },
      { omitUndefined: true, new: true }
    );
    res.status(200).json({ message: updatedBooking });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating booking", error: error.message });
  }
});

// Delete booking
// TO-DO
// Add loggedIn middleware
router.delete("/:_id", async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params._id);
    res.status(200).json({
      message: `The following booking was deleted from DB:\n${deletedBooking}`
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error deleting booking from DB",
        error: error.message
      });
  }
});

module.exports = router;
