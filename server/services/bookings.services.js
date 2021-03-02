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
  // Only lessons
  if (accomodationType === "none")
    return getLessonsRate(arrivalDate, departureDate)
  // Only accomodation
  else if (surfLevel === "noClass") {
    // Consultar fechas y sacar season
    const nNights = differenceInCalendarDays(
      new Date(departureDate),
      new Date(arrivalDate)
    )

    const bookingDates = []
    for (let i = 0; i < nNights; i++) {
      bookingDates.push(addDays(new Date(arrivalDate), i))
    }

    const seasons = await Promise.all(bookingDates.map((elm) => getSeason(elm)))

    const ratePrice = await Promise.all(
      seasons.map((e) =>
        Rate.findOne({
          rateType: accomodationType,
          season: e,
        })
      )
    )
      .then((ratesArr) => {
        console.log(ratesArr)
        return ratesArr.reduce((acc, foundRate) => {
          return acc + foundRate.rate
        }, 0)
      })
      .then((finalPrice) => (price = finalPrice))
      .catch((err) => console.error(err))

    return ratePrice
  }

  ////////////////////
  else {
    const nNights = differenceInCalendarDays(
      new Date(departureDate),
      new Date(arrivalDate)
    )

    const bookingDates = []
    for (let i = 0; i < nNights; i++) {
      bookingDates.push(addDays(new Date(arrivalDate), i))
    }

    const seasons = await Promise.all(bookingDates.map((elm) => getSeason(elm)))

    const ratePrice = await Promise.all(
      seasons.map((e) =>
        Rate.findOne({
          rateType: accomodationType,
          season: e,
          number: nNights,
        })
      )
    )
      .then((ratesArr) => {
        console.log(ratesArr)
        return ratesArr.reduce((acc, foundRate) => {
          return acc + foundRate.rate
        }, 0)
      })
      .then((finalPrice) => (price = finalPrice / nNights))
      .catch((err) => console.error(err))

    return ratePrice
  }
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
