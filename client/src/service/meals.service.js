import axios from "axios"

class MealService {
  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/meals`,
      withCredentials: true,
    })
  }

  getMealsByDateRange = (startDate, endDate) => this.api.get(`/filter?startDate=${startDate}&endDate=${endDate}`)
  removeOneMeal = (id, deleteQuantity) => this.api.put(`/${id}`, { deleteQuantity })
  addOneMeal = (id, increaseQuantity) => this.api.put(`/${id}`, { increaseQuantity })
  addMealType = (mealData) => this.api.post("/new", { ...mealData })
  removeMealType = (id) => this.api.delete(`/${id}`)
}

export default MealService
