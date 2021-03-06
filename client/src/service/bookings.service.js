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
  updateBookingById = (id, body) => this.api.put(`/${id}`, body)
}

export default BookingService
