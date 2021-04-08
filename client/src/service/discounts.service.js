import axios from 'axios'

class DiscountService {
  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/discounts`,
      withCredentials: true,
    })
  }

  validateDiscount = (discountCode) => this.api.get(`/validate/${discountCode}`)
}

export default DiscountService
