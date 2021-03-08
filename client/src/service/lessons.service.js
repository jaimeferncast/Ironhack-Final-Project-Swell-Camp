import axios from "axios"

class LessonService {
  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/lessons`,
      withCredentials: true,
    })
  }

  getLessonsByDateRange = (startDate, endDate, surfLevel) => this.api.get(`/filter?startDate=${startDate}&endDate=${endDate}&surfLevel=${surfLevel}`)
}

export default LessonService
