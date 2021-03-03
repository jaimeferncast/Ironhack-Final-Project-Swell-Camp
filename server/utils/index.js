const differenceInCalendarDays = require("date-fns/differenceInCalendarDays")
const isWithinInterval = require("date-fns/isWithinInterval")
const addDays = require("date-fns/addDays")

module.exports = {
  cleanText: (text) => text.trim(),
  capitalizeText: (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
  countNights: (arrivalDate, departureDate) => differenceInCalendarDays(new Date(departureDate), new Date(arrivalDate)),
  fillArrayWithDates: (arrivalDate, nNights, bookingDates) => {
    for (let i = 0; i < nNights; i++) bookingDates.push(addDays(new Date(arrivalDate), i))
  }
}