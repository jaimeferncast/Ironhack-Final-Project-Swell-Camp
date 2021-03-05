import { Component } from "react"

import { Grid, withStyles, Typography, Button } from "@material-ui/core"

import BookingCard from "./BookingCard"
import BookingService from "../../../service/bookings.service"
import backgroundImage from "../../../assets/indexBackground.jpg"

class IndexPage extends Component {
  state = {
    pendingBookings: undefined,
    searchedBooking: undefined,
    resultsPage: 1,
  }
  BookingService = new BookingService()

  componentDidMount = () => {
    this.fetchPendingBookings(this.state.resultsPage)
  }

  fetchPendingBookings = async (page) => {
    const DBBookings = await this.BookingService.getPendingBookings(page)
    this.setState({ pendingBookings: DBBookings, resultsPage: page })
  }

  componentDidUpdate = (prevProps) => {
    this.props.bookingSearchInput
      ? this.fetchSearchedBookings(prevProps.bookingSearchInput, this.state.resultsPage)
      : this.restorePendingBookings(prevProps.bookingSearchInput)
  }

  fetchSearchedBookings = async (prevSearchedBooking, page) => {
    if (prevSearchedBooking !== this.props.bookingSearchInput) {
      const DBBookings = await this.BookingService.getBookingByOpenSearch(this.props.bookingSearchInput, this.state.resultsPage)
      this.setState({ searchedBooking: DBBookings, resultsPage: page })
    }
  }

  restorePendingBookings = (prevSearchedBooking) => {
    prevSearchedBooking !== this.props.bookingSearchInput
      && this.setState({ searchedBooking: undefined, resultsPage: this.state.resultsPage })
  }

  goToNextPage = () => {
    this.fetchPendingBookings(this.state.resultsPage + 1)
  }

  goToPreviousPage = () => {
    this.fetchPendingBookings(this.state.resultsPage - 1)
  }

  render() {
    const { classes } = this.props
    return (
      <Grid container className={classes.container}>

        {this.state.searchedBooking
          ? <><Typography className={classes.title} variant="h4" component="h1" gutterBottom>
            Resultado de la búsqueda:
          </Typography>
            <Grid container justify="space-between">
              <Button
                className={classes.link}
                onClick={() => this.goToPreviousPage()}
                disabled={this.state.resultsPage === 1 && true}
              >Anteriores 5 reservas</Button>
              <Button
                className={classes.link}
                onClick={() => this.goToNextPage()}
              >Siguientes 5 reservas</Button>
            </Grid>
            <Grid item className={classes.scrollableList}>
              {this.state.searchedBooking.data.message.map((booking) => (
                <BookingCard className={classes.card} key={booking._id} {...booking} />
              ))}
            </Grid></>
          : <><Typography className={classes.title} variant="h4" component="h1" gutterBottom>
            Reservas pendientes de aprobación:
            </Typography>
            <Grid container justify="space-between">
              <Button
                className={classes.link}
                onClick={() => this.goToPreviousPage()}
                disabled={this.state.resultsPage === 1 && true}
              >Anteriores 5 reservas</Button>
              <Button
                className={classes.link}
                onClick={() => this.goToNextPage()}
              >Siguientes 5 reservas</Button>
            </Grid>
            <Grid item className={classes.list}>
              {this.state.pendingBookings
                ? this.state.pendingBookings.data.message.map((booking) => (
                  <BookingCard
                    className={classes.card}
                    key={booking._id}
                    {...booking}
                  />))
                : <Typography className={classes.title} variant="h5" component="h1" gutterBottom>
                  Estás al día con tu trabajo, bravo chaval.
            </Typography>
              }
            </Grid></>
        }
      </Grid>
    )
  }
}

const styles = (theme) => ({
  container: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    paddingTop: "7vh",
    minHeight: "94vh",
    flexDirection: "column",
  },
  title: {
    margin: theme.spacing(5, 8, 3)
  },
  list: {
    maxHeight: "69vh",
    width: "100%",
  },
  link: {
    display: "inline",
    width: "fit-content",
    margin: theme.spacing(0, 8, 3),
    backgroundColor: theme.palette.primary.main + "40",
    "&:hover": {
      backgroundColor: theme.palette.primary.main + "90"
    }
  },
  card: {
    margin: theme.spacing(0, 8, 3, 8),
  },
})

export default withStyles(styles)(IndexPage)
