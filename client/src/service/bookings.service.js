import axios from "axios"

class BookingService {

  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/bookings`,
      withCredentials: true,
    })
  }

  getBookings = () => this.api.get("/")
  getPendingBookings = () => this.api.get("/pending")
  getBookingById = (id) => this.api.get(`/${id}`)
}

export default BookingService
