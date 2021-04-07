const Discount = require('../models/discount.model')

const isDiscountValid = async (discountCode) => {
  try {
    const discountDoc = await Discount.findOne({ code: discountCode })
    return !!discountDoc
  } catch (error) {
    console.error(error)
  }
}

module.exports = isDiscountValid
