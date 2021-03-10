import axios from "axios"

class BedService {
  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/beds`,
      withCredentials: true,
    })
  }

  getBeds = () => this.api.get("/")
}

export default BedService
