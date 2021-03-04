import axios from "axios"

class OccupancyService {
  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/occupancies`,
      withCredentials: true,
    })
  }

  getOccupancyByDate = (date) => this.api.get(`/${date}`)
}

export default OccupancyService
