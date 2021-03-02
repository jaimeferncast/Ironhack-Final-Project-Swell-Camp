const differenceInCalendarDays = require("date-fns/differenceInCalendarDays")
const isWithinInterval = require("date-fns/isWithinInterval")
const addDays = require("date-fns/addDays")

const Rate = require("../models/rate.model")
const Season = require("../models/season.model")

const calculateRate = async (
  accomodationType,
  surfLevel,
  arrivalDate,
  departureDate
) => {
  if (accomodationType === "none") {
    return getLessonsRate(arrivalDate, departureDate)
  } else if (surfLevel === "noClass") {
    // Consultar fechas y sacar season
    const nNights = differenceInCalendarDays(
      new Date(departureDate),
      new Date(arrivalDate)
    )

    const bookingDates = []
    for (let i = 0; i < nNights; i++) {
      bookingDates.push(addDays(new Date(arrivalDate), i))
    }
    let seasonMap = []
    bookingDates.map((elm) =>
      getSeason(elm)
        .then((season) => {
          console.log("testseason", season)
          seasonMap.push(season)
        })
        .catch((err) => console.error(err))
    )

    return seasonMap
  }
}

// Find out if date is within any season interval
const getSeason = async (date) => {
  try {
    const arrayAlta = await Season.find({ seasonType: "alta" })
    const arrayMedia = await Season.find({ seasonType: "media" })
    arrayAlta.forEach((elm) => {
      if (
        isWithinInterval(date, {
          start: elm.startDate,
          end: elm.endDate,
        })
      )
        return "alta"
    })

    arrayMedia.forEach((elm) => {
      if (
        isWithinInterval(date, {
          start: elm.startDate,
          end: elm.endDate,
        })
      )
        return "media"
    })
    return "baja"
  } catch {
    ;(err) => console.error(err)
  }
}

// Get rate for only lessons booking
const getLessonsRate = async (arrivalDate, departureDate) => {
  const nClasses =
    2 *
    (differenceInCalendarDays(new Date(departureDate), new Date(arrivalDate)) +
      1)
  if (nClasses <= 20) {
    price = await Rate.findOne({
      rateType: "lessons",
      number: nClasses,
    }).select("rate")
    return price.rate
  } else {
    price = await Rate.findOne({
      rateType: "lessons",
      number: 20,
    }).select("rate")

    return price.rate + 20 * (nClasses - 20)
  }
}

module.exports = { calculateRate }
