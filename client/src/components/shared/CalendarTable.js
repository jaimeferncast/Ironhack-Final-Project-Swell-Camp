import { Component } from "react"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, withStyles } from "@material-ui/core"
import clsx from "clsx"
import CellButton from "../shared/CellButton"
import BedService from "../../service/beds.service"
import BookingService from "../../service/bookings.service"
import OccupancyService from "../../service/occupancies.service"
import { countNights, fillArrayWithDates, formatDates } from "../../utils"

class CalendarTable extends Component {
  state = {
    beds: [],
    booking: {},
    dates: [],
    occupancies: [],
  }

  bedService = new BedService()
  bookingService = new BookingService()
  occupancyService = new OccupancyService()

  fetchBeds = () => {
    this.bedService
      .getBeds()
      .then((response) => this.setState({ beds: response.data }))
      .catch((err) => console.error(err))
  }

  fetchBooking = () => {
    this.bookingService
      .getBookingById(this.props.bookingId)
      .then((response) => this.setState({ booking: response.data.message }, this.calculateDates))
      .catch((err) => console.error(err))
  }

  calculateDates = () => {
    const nNights = countNights(this.state.booking.arrival.date, this.state.booking.departure.date)
    this.setState({ dates: fillArrayWithDates(this.state.booking.arrival.date, nNights) }, this.fetchOccupancies)
  }

  fetchOccupancies = async () => {
    const response = await this.occupancyService.getOccupancyByDateRange(this.state.booking.arrival.date, this.state.booking.departure.date)
    const occupanciesArray = response.data.message
    this.setState({ occupancies: occupanciesArray })
  }

  componentDidMount = () => {
    this.fetchBeds()
    this.fetchBooking()
  }

  getOccupancy = (bedId, date) => {
    if (this.state.occupancies.length) {
      return this.state.occupancies.find((elm) => elm.bedId === bedId && !countNights(date, elm.date))
    }
  }

  render() {
    const { classes } = this.props

    return (
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="center" className={classes.firstCol}>
                Cama
              </TableCell>
              {this.state.dates.map((day) => (
                <TableCell key={day} align="center">
                  {formatDates(day)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.beds.map((bed) => (
              <TableRow key={bed._id}>
                <TableCell align="center" className={classes.firstCol}>
                  {bed.code}
                </TableCell>
                {this.state.dates.map((day) => (
                  <CellButton key={`${bed.code}-${day}`} occupancy={this.getOccupancy(bed._id, day)} />
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }
}

const styles = (theme) => ({
  container: {
    maxHeight: theme.spacing(70),
    maxWidth: theme.spacing(170),
  },
  firstCol: {
    position: "sticky",
    width: theme.spacing(8),
    left: 0,
    backgroundColor: theme.palette.primary.light,
    zIndex: 10,
  },
  button: {
    height: theme.spacing(3),
    minWidth: theme.spacing(12),
  },
})
export default withStyles(styles)(CalendarTable)
