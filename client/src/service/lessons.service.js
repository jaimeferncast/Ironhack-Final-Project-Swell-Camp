import axios from "axios"

class LessonService {
  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/lessons`,
      withCredentials: true,
    })
  }

  getLessonsByDateRange = (startDate, endDate, surfLevel) =>
    this.api.get(`/filterOneDay?startDate=${startDate}&endDate=${endDate}&surfLevel=${surfLevel}`)
  removeStudentFromLesson = (bookingId, lessonId) => this.api.put(`/${lessonId}`, { deleteBooking: bookingId })
}

export default LessonService
