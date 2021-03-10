import axios from "axios"

class OccupancyService {
  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/occupancies`,
      withCredentials: true,
    })
  }

  getOccupancyByDateRange = (startDate, endDate) => this.api.get(`/range?startDate=${startDate}&endDate=${endDate}`)
  updateOccupancy = (id, body) => this.api.put(`/${id}`, body)
}

export default OccupancyService
