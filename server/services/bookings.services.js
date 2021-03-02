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
  const nNights = getNights(arrivalDate, departureDate)

  // Only lessons
  if (accomodationType === "none")
    return getLessonsRate(arrivalDate, departureDate)
  // Only accomodation
  else if (surfLevel === "noClass") {
    const ratesArr = await getBookingRates(
      accomodationType,
      arrivalDate,
      nNights
    )

    return ratesArr.reduce((acc, rateDocument) => {
      return acc + rateDocument.rate
    }, 0)
  }

  ////////////////////
  else {
    const ratesArr = await getBookingRates(
      accomodationType,
      arrivalDate,
      nNights,
      surfLevel
    )

    const sumRates = ratesArr.reduce((acc, rateDocument) => {
      return acc + rateDocument.rate
    }, 0)

    return sumRates / nNights
  }
}

// Get number of nights for this booking
const getNights = (arrivalDate, departureDate) => {
  return differenceInCalendarDays(
    new Date(departureDate),
    new Date(arrivalDate)
  )
}

// Get array of rates from DB corresponding to booking dates
const getBookingRates = async (
  accomodationType,
  arrivalDate,
  nNights,
  surfLevel
) => {
  const bookingDates = []
  for (let i = 0; i < nNights; i++) {
    bookingDates.push(addDays(new Date(arrivalDate), i))
  }

  const seasons = await Promise.all(bookingDates.map((elm) => getSeason(elm)))

  const ratesArr = await Promise.all(
    seasons.map((e) =>
      Rate.findOne({
        rateType: accomodationType,
        season: e,
        number: surfLevel ? nNights : 1,
      })
    )
  )

  return ratesArr
}

// Find out if date is within any season interval
const getSeason = async (date) => {
  try {
    let season = "baja"
    //TODO revisar si es una query y si es pasar al modelo
    const arrayAlta = await Season.find({ seasonType: "alta" })
    const arrayMedia = await Season.find({ seasonType: "media" })

    arrayMedia.forEach((elm) => {
      if (
        isWithinInterval(date, {
          start: elm.startDate,
          end: elm.endDate,
        })
      )
        season = "media"
    })

    arrayAlta.forEach((elm) => {
      if (
        isWithinInterval(date, {
          start: elm.startDate,
          end: elm.endDate,
        })
      )
        season = "alta"
    })

    return season
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
