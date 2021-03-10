import axios from "axios"

class BookingService {
  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/bookings`,
      withCredentials: true,
    })
  }

  getBookings = () => this.api.get("/")
  getPendingBookings = (page) => this.api.get(`/pending?page=${page}`)
  getBookingById = (id) => this.api.get(`/${id}`)
  getBookingByOpenSearch = (input, page) => this.api.get(`/open-search/${input}?page=${page}`)
  updateBookingById = (id, body) => this.api.put(`/${id}`, body)
  createBooking = (body) => this.api.post("/new", body)
  calculatePrice = (body) => this.api.post("price", body)
}

export default BookingService
