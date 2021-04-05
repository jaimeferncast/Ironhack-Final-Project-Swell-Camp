const Rate = require('../models/rate.model')
const Season = require('../models/season.model')
const Discount = require('../models/discount.model')
const { differenceInCalendarDays, addDays } = require('date-fns')

const priceAfterDiscount = async (price, discountCode) => {
  if (discountCode) {
    try {
      const discountDocument = await Discount.findOne({ code: discountCode }).select('discountPercentage')
      const discount = discountDocument.discountPercentage

      return price * (1 - discount / 100)
    } catch (err) {
      console.error(err)
    }
  }
  return price
}

const calculateRate = async (accommodation, departureDate, arrivalDate, surfLevel, discountCode) => {
  try {
    if (accommodation == 'none') {
      const nClasses = 2 * (differenceInCalendarDays(new Date(departureDate), new Date(arrivalDate)) + 1)

      const theRate = await Rate.findOne({
        rateType: 'lessons',
        number: nClasses,
      }).select('rate')

      return priceAfterDiscount(theRate.rate, discountCode)
    } else {
      const nNights = differenceInCalendarDays(new Date(departureDate), new Date(arrivalDate))
      const bookingDates = []

      for (let i = 0; i < nNights; i++) {
        bookingDates.push(addDays(new Date(arrivalDate), i))
      }

      const seasons = await Promise.all(
        bookingDates.map(
          async (elm) =>
            await Season.findOne({ $and: [{ startDate: { $lte: elm } }, { endDate: { $gte: elm } }] })
              .select('priority seasonType')
              .sort({
                priority: 1,
              })
        )
      )

      const ratesArr = await Promise.all(
        seasons.map((e) =>
          Rate.findOne({
            rateType: accommodation,
            season: e.seasonType,
            number: surfLevel !== 'noClass' ? nNights : 1,
          })
        )
      )

      const sumRates = ratesArr.reduce((acc, rateDocument) => {
        return acc + rateDocument.rate
      }, 0)

      return this.surfLevel === 'noClass'
        ? priceAfterDiscount(sumRates, discountCode)
        : priceAfterDiscount(sumRates / nNights, discountCode)
    }
  } catch (err) {
    console.error(err)
  }
}

module.exports = calculateRate
