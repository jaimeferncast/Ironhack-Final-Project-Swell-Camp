const differenceInCalendarDays = require("date-fns/differenceInCalendarDays")
const isWithinInterval = require("date-fns/isWithinInterval")
const addDays = require("date-fns/addDays")

const Rate = require("../models/rate.model")
const Season = require("../models/season.model")

class CalculateRateService {
  constructor(accomodationType, surfLevel, arrivalDate, departureDate) {
    this.accomodationType = accomodationType
    this.surfLevel = surfLevel
    this.arrivalDate = arrivalDate
    this.departureDate = departureDate
  }

  async getFinalRate() {
    // const nNights = getNights(arrivalDate, departureDate)

    // Only lessons
    if (this.accomodationType === "none") return this.getLessonsRate()
    // Only accomodation
    else if (this.surfLevel === "noClass") {
      const ratesArr = await this.getBookingRates(this.nNights)

      return ratesArr.reduce((acc, rateDocument) => {
        return acc + rateDocument.rate
      }, 0)
    }
    // Surfcamp
    else {
      const ratesArr = await this.getBookingRates(this.nNights, this.surfLevel)

      const sumRates = ratesArr.reduce((acc, rateDocument) => {
        return acc + rateDocument.rate
      }, 0)

      return sumRates / this.nNights
    }
  }

  get nNights() {
    return differenceInCalendarDays(
      new Date(this.departureDate),
      new Date(this.arrivalDate)
    )
  }

  async getBookingRates(nNights, surfLevel) {
    const bookingDates = []
    for (let i = 0; i < nNights; i++) {
      bookingDates.push(addDays(new Date(this.arrivalDate), i))
    }

    const seasons = await Promise.all(
      bookingDates.map((elm) => this.getSeason(elm))
    )

    const ratesArr = await Promise.all(
      seasons.map((e) =>
        Rate.findOne({
          rateType: this.accomodationType,
          season: e,
          number: surfLevel ? nNights : 1,
        })
      )
    )

    return ratesArr
  }

  async getSeason(date) {
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
    } catch { (err) => console.error(err) }
  }

  async getLessonsRate() {
    const nClasses =
      2 *
      (differenceInCalendarDays(
        new Date(this.departureDate),
        new Date(this.arrivalDate)
      ) +
        1)
    if (nClasses <= 20) {
      const price = await Rate.findOne({
        rateType: "lessons",
        number: nClasses,
      }).select("rate")
      return price.rate
    } else {
      const price = await Rate.findOne({
        rateType: "lessons",
        number: 20,
      }).select("rate")

      return price.rate + 20 * (nClasses - 20)
    }
  }
}

module.exports = CalculateRateService
