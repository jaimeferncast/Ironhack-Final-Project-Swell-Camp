import { Component } from "react"
import { Link } from "react-router-dom"

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
    this.fetchPendingBookings()
  }

  fetchPendingBookings = async () => {
    const DBBookings = await this.BookingService.getPendingBookings(this.state.resultsPage)
    this.setState({ pendingBookings: DBBookings })
  }

  componentDidUpdate = (prevProps) => {
    this.props.searchedBooking
      && this.fetchSearchedBookings(prevProps.searchedBooking)
  }

  fetchSearchedBookings = async (prevSearchedBooking) => {
    if (prevSearchedBooking !== this.state.searchedBooking) {
      const DBBookings = await this.BookingService.getBookingByOpenSearch(this.props.searchedBooking, this.state.resultsPage)
      this.props.searchedBooking
        ? this.setState({ searchedBooking: DBBookings })
        : this.setState({ searchedBooking: undefined })
    }
  }

  goToNextPage = () => {
    this.setState({ resultsPage: this.state.resultsPage + 1 })
  }

  goToPreviousPage = () => {
    this.setState({ resultsPage: this.state.resultsPage - 1 })
  }

  render() {
    const { classes } = this.props
    return (
      <Grid container className={classes.container}>

        {this.state.searchedBooking
          ? <><Typography className={classes.title} variant="h4" component="h1" gutterBottom>
            Resultado de la búsqueda:
          </Typography>

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
