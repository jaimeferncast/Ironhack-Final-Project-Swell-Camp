const { differenceInCalendarDays, addDays, addHours } = require("date-fns")

module.exports = {
  cleanText: (text) => text.trim(),
  capitalizeText: (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
  countNights: (arrivalDate, departureDate) => differenceInCalendarDays(new Date(departureDate), new Date(arrivalDate)),
  fillArrayWithDates: (arrivalDate, nNights) => {
    const newArr = []
    for (let i = 0; i < nNights; i++) newArr.push(addDays(new Date(arrivalDate), i))
    return newArr
  },
  forkDates: (datesArr, nHoursToSum1, nHoursToSum2) => {
    const newArr = []
    datesArr.forEach((elm) => {
      newArr.push(addHours(new Date(elm), nHoursToSum1))
      newArr.push(addHours(new Date(elm), nHoursToSum2))
    })
    return newArr
  },
}
