import axios from "axios"

class MealService {
  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/meals`,
      withCredentials: true,
    })
  }

  getMealsByDateRange = (startDate, endDate) => this.api.get(`/filter?startDate=${startDate}&endDate=${endDate}`)
}

export default MealService
