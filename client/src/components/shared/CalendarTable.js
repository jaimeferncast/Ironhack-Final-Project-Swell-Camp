import { Component } from "react"
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, withStyles } from "@material-ui/core"
import clsx from "clsx"
import CellButton from "../shared/CellButton"
import BedService from "../../service/beds.service"
import BookingService from "../../service/bookings.service"
import OccupancyService from "../../service/occupancies.service"
import { countNights, fillArrayWithDates, formatDates, truncateString } from "../../utils"

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
    const occupancies = await Promise.all(this.state.dates.map((day) => this.occupancyService.getOccupancyByDate(day)))
    this.setState({ occupancies: occupancies })
  }

  componentDidMount = () => {
    this.fetchBeds()
    this.fetchBooking()
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
                <TableCell align="center">{formatDates(day)}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.beds.map((bed) => (
              <TableRow>
                <TableCell align="center" className={classes.firstCol}>
                  {bed.code}
                </TableCell>
                {this.state.dates.map((day) => (
                  <CellButton key={`${bed.code}-${day}`} state="occupied">
                    {truncateString("María José", 9)}
                  </CellButton>
                ))}
              </TableRow>
            ))}
            {/* <TableRow>
              <TableCell align="center" className={classes.firstCol}>
                1.1
              </TableCell>
              <CellButton state="occupied">{truncateString("María José", 9)}</CellButton>
              <CellButton state="selected">{truncateString("José Carlos", 9)}</CellButton>
              <CellButton state="empty">{truncateString("", 9)}</CellButton>
              <TableCell className={classes.cell} align="center">
                <Button variant="contained" className={clsx(classes.button, classes.filled)}>
                  {truncateString("Antonio", 9)}
                </Button>
              </TableCell>
              <TableCell className={classes.cell} align="center">
                <Button variant="contained" className={clsx(classes.button, classes.empty)}>
                  {truncateString("", 9)}
                </Button>
              </TableCell>
              <TableCell className={classes.cell} align="center">
                <Button variant="contained" className={clsx(classes.button, classes.filled)}>
                  {truncateString("Ana", 9)}
                </Button>
              </TableCell>
              <TableCell className={classes.cell} align="center">
                <Button variant="contained" className={clsx(classes.button, classes.filled)}>
                  {truncateString("Ana", 9)}
                </Button>
              </TableCell>
              <TableCell className={classes.cell} align="center">
                <Button variant="contained" className={clsx(classes.button, classes.filled)}>
                  {truncateString("Ana", 9)}
                </Button>
              </TableCell>
              <TableCell className={classes.cell} align="center">
                <Button variant="contained" className={clsx(classes.button, classes.filled)}>
                  {truncateString("Ana", 9)}
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center" className={classes.firstCol}>
                1.2
              </TableCell>
              <TableCell align="center">BB</TableCell>
              <TableCell align="center">BB</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center">CC</TableCell>
              <TableCell align="center" className={classes.cell}>
                CC
              </TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
            <TableRow> */}
            {/* <TableCell align="center" className={classes.firstCol}>
                2.1
              </TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
            </TableRow> */}
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
    position: "-webkit-sticky",
    position: "sticky",
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
