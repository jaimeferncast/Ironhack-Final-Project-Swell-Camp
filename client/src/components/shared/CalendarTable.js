import { Component } from "react"
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  withStyles,
  LinearProgress
} from "@material-ui/core"
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
    occupancyToUpdate: undefined,
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
    const arrivalDate = this.state.booking.arrival.date
    const departureDate = this.state.booking.departure.date
    const nNights = countNights(arrivalDate, departureDate) < 8 ? 8 : countNights(arrivalDate, departureDate) + 1
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

  handleClickEmpty = (bedId, date) => {
    const stateOccupancies = [...this.state.occupancies]
    if (!this.state.occupancyToUpdate) {
      const tempOccupancy = { status: "created", date: date, bedId: bedId, booking: this.state.booking }
      stateOccupancies.push(tempOccupancy)
    } else {
      const occupancyIndex = stateOccupancies.indexOf(this.state.occupancyToUpdate)
      const updatedOccupancy = { ...this.state.occupancyToUpdate }
      updatedOccupancy.bedId = bedId
      updatedOccupancy.status = "updated"
      stateOccupancies.splice(occupancyIndex, 1, updatedOccupancy)
    }
    this.setState({ occupancies: stateOccupancies, occupancyToUpdate: undefined })
  }

  handleClickOccupied = (occupancy) => {
    this.setState({ occupancyToUpdate: occupancy })
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    const newBedsArray = this.state.occupancies.filter((occupancy) => occupancy.status === "created").map((occupancy) => occupancy.bedId)
    if (newBedsArray.length) {
      const formData = { ...this.state.booking, bedIds: newBedsArray }
      formData.status = "accepted"
      await this.bookingService.updateBookingById(this.state.booking._id, formData)
    }

    const updatedOccupancies = this.state.occupancies.filter((occupancy) => occupancy.status === "updated")
    if (updatedOccupancies.length) {
      await Promise.all(updatedOccupancies.map((occupancy) => this.occupancyService.updateOccupancy(occupancy._id, occupancy)))
    }

    this.fetchOccupancies()
  }

  useCellButton = (bed_id, day) => {
    const occupancy = this.getOccupancy(bed_id, day)
    const cellState = !occupancy ? "empty" : occupancy.status ? "selected" : "occupied"
    let cellButtonProps = {
      cellState,
      occupancyId: occupancy?._id || undefined,
      name: occupancy ? occupancy.booking.name : "",
      onClick: occupancy ? () => this.handleClickOccupied(occupancy) : () => this.handleClickEmpty(bed_id, day),
    }
    return { ...cellButtonProps }
  }

  render() {
    const { classes } = this.props

    return (
      <>
        {!this.state.booking.departure
          ? <Typography style={{ margin: "30px 0" }} variant="h5" component="h1">
            <LinearProgress />
          </Typography>
          : <>
            <Typography variant="h6" component="h1" style={{ margin: "30px 0", textAlign: "center" }}>
              {this.state.booking.name}&emsp;|&emsp;llegada: {formatDates(new Date(this.state.booking.arrival.date))}&emsp;|&emsp;salida: {formatDates(new Date(this.state.booking.departure.date))}&emsp;|&emsp;alojamiento: {this.state.booking.accommodation}
            </Typography>
            <TableContainer className={classes.container}>
              <Table stickyHeader style={{ borderCollapse: "collapse", width: "auto" }}>
                <TableHead>
                  <TableRow style={{ borderLeft: "1px solid #e0e0e0", borderBottom: "1px solid #e0e0e0" }}>
                    <TableCell align="center" padding="none" className={classes.header} style={{
                      borderRight: "2px solid #abbbd1"
                    }}>
                      Cama
                </TableCell>
                    {this.state.dates.map((day) => (
                      <TableCell key={day} align="center" padding="none" style={
                        (day >= new Date(this.state.booking.arrival.date) && day <= new Date(this.state.booking.departure.date))
                          ? { borderRight: "2px solid #abbbd1", backgroundColor: "#ffe082de" }
                          : { borderRight: "2px solid #abbbd1", backgroundColor: "#fff8e1cc", color: "rgb(166 166 166)" }
                      }>
                        {formatDates(day)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.beds.map((bed) => (
                    <TableRow key={bed._id} >
                      <TableCell align="left" padding="none" classes={{ root: classes.firstCol }}>
                        {bed.code}
                      </TableCell>
                      {this.state.dates.map((day) => (
                        <CellButton
                          key={`${bed.code}-${day}`}
                          data={this.useCellButton(bed._id, day)}
                        />
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <form onSubmit={this.handleSubmit}>
              <Button variant="contained" color="primary" className={classes.submitButton} type="submit">
                Validar
          </Button>
            </form>
          </>
        }
      </>
    )
  }
}

const styles = (theme) => ({
  container: {
    maxHeight: theme.spacing(60),
    maxWidth: theme.spacing(170),
  },
  header: {
    backgroundColor: theme.palette.primary.main,
    zIndex: "1000",
  },
  firstCol: {
    position: "sticky",
    left: "0",
    zIndex: "999",
    width: theme.spacing(12),
    padding: "0 0 0 7px",
    backgroundColor: theme.palette.primary.light,
    border: "1px solid #e0e0e0",
    borderCollapse: "collapse",
  },
  button: {
    height: theme.spacing(3),
    minWidth: theme.spacing(12),
  },
  submitButton: {
    marginTop: theme.spacing(5),
  },
})

export default withStyles(styles)(CalendarTable)
