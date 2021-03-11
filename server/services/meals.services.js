const { countNights, fillArrayWithDates, forkDates } = require("../utils")
const addHours = require("date-fns/addHours")
const Meal = require("../models/meal.model")

const updateMeals = (arrivalDate, departureDate, foodMenu) => {
  const nNights = countNights(arrivalDate, departureDate)
  const bookingDates = fillArrayWithDates(arrivalDate, nNights)
  const bookingMeals = forkDates(bookingDates, 14, 21)
  bookingMeals.push(addHours(new Date(bookingMeals[bookingMeals.length - 1]), 17))

  bookingMeals.forEach((elm) => {
    Meal.findOneAndUpdate({ date: elm, mealType: foodMenu }, { $inc: { quantity: 1 } }, { upsert: true, new: true, setDefaultsOnInsert: true }).catch((err) => {
      throw new Error(err)
    })
  })
}

const clearMeals = (arrivalDate, departureDate, foodMenu) => {
  const meatTimeDeparture = addHours(new Date(departureDate), 14)
  return Meal.updateMany({ $and: [{ date: { $gte: arrivalDate } }, { date: { $lte: meatTimeDeparture } }], mealType: { $eq: foodMenu } }, { $inc: { quantity: -1 } }).catch((err) => {
    throw new Error(err)
  })
}

module.exports = { updateMeals, clearMeals }
