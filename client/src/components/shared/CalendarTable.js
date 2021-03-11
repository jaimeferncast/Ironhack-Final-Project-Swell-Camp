import { Component } from "react"
import { withRouter } from "react-router-dom"

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
  LinearProgress,
  Grid,
  Dialog,
} from "@material-ui/core"

import CellButton from "../shared/CellButton"
import BookingForm from "../shared/BookingForm"

import BedService from "../../service/beds.service"
import BookingService from "../../service/bookings.service"
import OccupancyService from "../../service/occupancies.service"

import { countNights, fillArrayWithDates, formatDates } from "../../utils"

const addDays = require("date-fns/addDays")
const addHours = require("date-fns/addHours")
const format = require("date-fns/format")

class CalendarTable extends Component {
  constructor(props) {
    super()
    this.state = {
      beds: [],
      booking: {},
      dates: [],
      otherOccupancies: [],
      occupancyToUpdate: undefined,
      canRender: false,
      modalState: false,
      prevArrival: undefined,
      prevDeparture: undefined,
      prevSurfLevel: undefined,
    }

    this.bedService = new BedService()
    this.bookingService = new BookingService()
    this.occupancyService = new OccupancyService()
  }

  fetchBeds = () => {
    this.bedService
      .getBeds()
      .then((response) => this.setState({ beds: response.data }))
      .catch((err) => console.error(err))
  }

  fetchBooking = () => {
    this.bookingService
      .getBookingById(this.props.bookingId)
      .then((response) =>
        this.setState(
          {
            booking: response.data.message,
            prevArrival: response.data.message.arrival.date,
            prevDeparture: response.data.message.departure.date,
            prevSurfLevel: response.data.message.surfLevel,
          },
          this.calculateDates
        )
      )
      .catch((err) => console.error(err))
  }

  calculateDates = () => {
    const arrivalDate = this.state.booking.arrival.date
    const departureDate = this.state.booking.departure.date
    const nNights = countNights(arrivalDate, departureDate) < 9 ? 9 : countNights(arrivalDate, departureDate)
    this.setState({ dates: fillArrayWithDates(this.state.booking.arrival.date, nNights) }, () =>
      this.fetchOccupancies()
    )
  }

  fetchOccupancies = async () => {
    const firstTableDate = addHours(addDays(new Date(this.state.booking.arrival.date), -1), -1)
    const lastTableDate =
      this.state.dates.length < 9
        ? addDays(new Date(firstTableDate), 9)
        : addDays(new Date(firstTableDate), this.state.dates.length)
    const response = await this.occupancyService.getOccupancyByDateRange(firstTableDate, lastTableDate)
    const occupanciesArray = response.data.message
    const otherOccupancies = occupanciesArray.filter((occupancy) => occupancy.booking._id !== this.state.booking._id)

    let bookingOccupancies =
      this.state.bookingOccupancies ||
      occupanciesArray.filter((occupancy) => occupancy.booking._id === this.state.booking._id)

    bookingOccupancies = bookingOccupancies.map((occupancy) => {
      occupancy.status = "current"
      return occupancy
    })

    this.setState({ otherOccupancies, bookingOccupancies, canRender: true })
  }

  componentDidMount = () => {
    this.fetchBeds()
    this.fetchBooking()
  }

  getOccupancy = (bedId, date, occupancies) => {
    if (occupancies.length) {
      return occupancies.find((elm) => elm.bedId === bedId && !countNights(date, elm.date))
    }
  }

  handleClickEmpty = (bedId, date) => {
    let bookingOccupancies = [...this.state.bookingOccupancies]
    let otherOccupancies = [...this.state.otherOccupancies]
    const occupancyFromBooking = bookingOccupancies.find((elm) => elm === this.state.occupancyToUpdate) ? true : false

    if (!this.state.occupancyToUpdate) {
      const doubleOccupancy = bookingOccupancies.filter((elm) => elm.date === date)
      if (!doubleOccupancy.length) {
        const tempOccupancy = { status: "current", date, bedId, booking: this.state.booking }
        bookingOccupancies.push(tempOccupancy)
      }
      this.setState({ bookingOccupancies, occupancyToUpdate: undefined })
    } else {
      if (occupancyFromBooking) {
        bookingOccupancies = bookingOccupancies.filter((elm) => elm.status !== "selected")
        const tempOccupancy = {
          status: "updated",
          date: this.state.occupancyToUpdate.date,
          bedId,
          booking: this.state.occupancyToUpdate.booking,
          _id: this.state.occupancyToUpdate._id,
        }
        bookingOccupancies.push(tempOccupancy)
        this.setState({ bookingOccupancies, occupancyToUpdate: undefined })
      } else {
        otherOccupancies = otherOccupancies.filter((elm) => elm.status !== "selected")
        const tempOccupancy = {
          status: "updated",
          date: this.state.occupancyToUpdate.date,
          bedId,
          booking: this.state.occupancyToUpdate.booking,
          _id: this.state.occupancyToUpdate._id,
        }
        otherOccupancies.push(tempOccupancy)
        this.setState({ otherOccupancies, occupancyToUpdate: undefined })
      }
    }
  }

  fillOccupanciesRow = (bedId) => {
    const otherOccupancies = [...this.state.otherOccupancies]
    const bookingOccupancies = [] /* [...this.state.bookingOccupancies] */
    // dejar solo las occ que no se vayan a poder rellenar
    const nNights = countNights(this.state.booking.arrival.date, this.state.booking.departure.date)
    const bookingDates = this.state.dates.slice(1, nNights + 1)
    bookingDates.forEach((date) => {
      if (!otherOccupancies.find((elm) => elm.bedId === bedId && !countNights(date, elm.date))) {
        const tempOccupancy = { status: "current", date, bedId, booking: this.state.booking }
        bookingOccupancies.push(tempOccupancy)
      }
    })
    this.setState({ bookingOccupancies, occupancyToUpdate: undefined })
  }

  handleClickOccupied = (occupancy) => {
    const selectedOccupancy = { ...occupancy, status: "selected" }
    let bookingOccupancies = [...this.state.bookingOccupancies]
    let otherOccupancies = [...this.state.otherOccupancies]

    const occupancyFromBooking = bookingOccupancies.find((elm) => elm === occupancy) ? true : false

    if (occupancyFromBooking) {
      bookingOccupancies = bookingOccupancies.filter((elm) => elm !== occupancy)
      bookingOccupancies.push(selectedOccupancy)
      this.setState({ occupancyToUpdate: selectedOccupancy, bookingOccupancies })
    } else {
      otherOccupancies = otherOccupancies.filter((elm) => elm !== occupancy)
      otherOccupancies.push(selectedOccupancy)
      this.setState({ occupancyToUpdate: selectedOccupancy, otherOccupancies })
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    const bookingOccupancies = [...this.state.bookingOccupancies]
    const otherOccupancies = [...this.state.otherOccupancies]

    const allOccupancies = bookingOccupancies.concat(otherOccupancies)
    allOccupancies.find((occupancy) => occupancy.status === "selected") &&
      alert("Debes asignar una nueva cama a la casilla seleccionada antes de guardar los cambios.")

    const newBedsArray = bookingOccupancies.map((occupancy) => occupancy.bedId)
    console.log("las camas", newBedsArray)
    if (newBedsArray.length) {
      const formData = {
        bedIds: newBedsArray,
      }
      formData.status = "accepted"
      await this.bookingService.updateBookingById(this.state.booking._id, formData)
    }

    const updatedOccupancies = allOccupancies.filter((occupancy) => occupancy.status === "updated")
    if (updatedOccupancies.length) {
      await Promise.all(
        updatedOccupancies.map((occupancy) => this.occupancyService.updateOccupancy(occupancy._id, occupancy))
      )
    }

    this.props.history.push("/")
  }

  useCellButton = (bed_id, day) => {
    const occupancy =
      this.getOccupancy(bed_id, day, this.state.bookingOccupancies) ||
      this.getOccupancy(bed_id, day, this.state.otherOccupancies)

    let cellState
    if (
      day < addHours(new Date(this.state.booking.arrival.date), -1) ||
      day >= addHours(new Date(this.state.booking.departure.date), -1)
    ) {
      cellState = "outOfRange"
    } else if (!occupancy) {
      cellState = "empty"
    } else if (occupancy.status) {
      cellState = occupancy.status
    } else {
      cellState = "occupied"
    }

    let clickHandler
    if (cellState !== "outOfRange") {
      occupancy
        ? (clickHandler = () => this.handleClickOccupied(occupancy))
        : (clickHandler = () => this.handleClickEmpty(bed_id, day))
    }

    let cellButtonProps = {
      cellState,
      occupancyId: occupancy?._id || undefined,
      name: occupancy ? occupancy.booking.name : "",
      groupCode: occupancy ? occupancy.booking.groupCode : "",
      onClick: clickHandler,
    }
    return { ...cellButtonProps }
  }

  openModal = (e) => {
    e.preventDefault()
    this.setState({ modalState: true })
  }

  closeModal = () => {
    this.setState({ modalState: false })
  }

  handleModalFormSubmit = (e, updatedBooking) => {
    e.preventDefault()
    this.closeModal()
    const formData = {
      ...updatedBooking,
      // bedIds: newBedsArray,
      prevArrival: this.state.prevArrival,
      prevDeparture: this.state.prevDeparture,
      prevSurfLevel: this.state.prevSurfLevel,
    }
    this.bookingService
      .updateBookingById(updatedBooking._id, formData)
      .then((response) => {
        this.setState({ booking: response.data.message }, () => this.calculateDates())
      })
      .catch((error) => console.log(error))
  }

  render() {
    const { classes } = this.props

    return (
      <>
        {!this.state.canRender ? (
          <Typography style={{ margin: "30px 0" }} variant="h5" component="h1">
            <LinearProgress />
          </Typography>
        ) : (
          <>
            <Typography
              variant="h6"
              component="h1"
              style={{
                margin: "30px 0",
                textAlign: "center",
                width: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {this.state.booking.name}
              &emsp;|&emsp;Llega el {formatDates(new Date(this.state.booking.arrival.date))}
              &emsp;|&emsp;Sale el {formatDates(new Date(this.state.booking.departure.date))}
              &emsp;|&emsp;Reserva{" "}
              {this.state.booking.status === "pending" ? (
                <p style={{ color: "#ea2968", display: "inline" }}>pendiente de validar</p>
              ) : (
                "validada"
              )}
            </Typography>
            <TableContainer className={classes.container}>
              <Table stickyHeader style={{ borderCollapse: "collapse", width: "auto" }}>
                <TableHead>
                  <TableRow style={{ borderLeft: "1px solid #e0e0e0", borderBottom: "1px solid #e0e0e0" }}>
                    <TableCell
                      align="center"
                      padding="none"
                      className={classes.header}
                      style={{
                        borderRight: "2px solid #abbbd1",
                      }}
                    >
                      Cama
                    </TableCell>
                    {this.state.dates.map((day) => (
                      <TableCell
                        key={day}
                        align="center"
                        padding="none"
                        style={
                          day >= addHours(new Date(this.state.booking.arrival.date), -1) &&
                          day < addHours(new Date(this.state.booking.departure.date), -1)
                            ? { borderRight: "2px solid #abbbd1", backgroundColor: "#ffe082de" }
                            : {
                                borderRight: "2px solid #abbbd1",
                                backgroundColor: "#fff8e1cc",
                                color: "rgb(166 166 166)",
                              }
                        }
                      >
                        {format(day, "eeeeee dd/MM/yyyy")}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.beds.sort().map((bed) => (
                    <TableRow key={bed._id}>
                      <TableCell align="left" padding="none" classes={{ root: classes.firstCol }}>
                        <Button onClick={() => this.fillOccupanciesRow(bed._id)} className={classes.bedButton}>
                          {bed.code}
                        </Button>
                      </TableCell>
                      {this.state.dates.map((day) => (
                        <CellButton
                          key={`${bed.code}-${day}`}
                          data={this.useCellButton(bed._id, day)}
                          groupCode={this.state.booking.groupCode}
                        />
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Grid style={{ display: "flex", justifyContent: "flex-start" }}>
              <form onSubmit={this.handleSubmit}>
                <Button variant="contained" color="primary" className={classes.submitButton} type="submit">
                  Guardar
                </Button>
              </form>
              <form onSubmit={this.openModal} style={{ marginLeft: "50px" }}>
                <Button variant="contained" color="primary" className={classes.submitButton} type="submit">
                  Ver detalles de reserva
                </Button>
              </form>
            </Grid>

            <Dialog
              PaperProps={{ className: classes.paperModal }}
              aria-labelledby="modificar-reserva"
              open={this.state.modalState}
              className={classes.modal}
              onClose={this.closeModal}
            >
              <BookingForm booking={{ ...this.state.booking }} handleModalFormSubmit={this.handleModalFormSubmit} />
            </Dialog>
          </>
        )}
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
    padding: "0",
    backgroundColor: theme.palette.primary.light,
    border: "1px solid #e0e0e0",
    borderCollapse: "collapse",
  },
  bedButton: {
    width: "90px",
    padding: "0 0 0 7px",
    fontSize: "0.7rem",
    justifyContent: "flex-start",
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.third.main,
    },
  },
  button: {
    height: theme.spacing(3),
    minWidth: theme.spacing(12),
  },
  submitButton: {
    marginTop: theme.spacing(5),
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paperModal: {
    backgroundColor: "transparent",
  },
})

export default withStyles(styles)(withRouter(CalendarTable))
