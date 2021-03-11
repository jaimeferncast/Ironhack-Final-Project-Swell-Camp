import { Component } from "react"

import { Grid, withStyles, Typography, Button, LinearProgress } from "@material-ui/core"

import SearchResults from "./SearchResults"
import BookingCard from "./BookingCard"
import BookingService from "../../../service/bookings.service"

class IndexPage extends Component {
  state = {
    pendingBookings: undefined,
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

  restorePendingBookings = () => {
    this.setState({ resultsPage: 1 })
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
      <Grid container className={classes.content}>
        {this.props.bookingSearchInput
          ? <SearchResults
            bookingSearchInput={this.props.bookingSearchInput}
            restorePendingBookings={() => this.restorePendingBookings()}
            classes={classes}
          />

          : <>
            <Typography className={classes.title} variant="h4" component="h1" gutterBottom>
              Reservas pendientes de aprobación:
            </Typography>
            <Grid container justify="space-between">
              <Button
                className={classes.link}
                onClick={() => this.goToPreviousPage()}
                disabled={this.state.resultsPage === 1 && true}
              >Anteriores 4 reservas</Button>
              <Button
                className={classes.link}
                onClick={() => this.goToNextPage()}
                disabled={this.state.searchedBooking?.data.message.length < 4 && true}
              >Siguientes 4 reservas</Button>
            </Grid>
            <Grid item className={classes.scrollableList}>
              {this.state.pendingBookings
                ? this.state.pendingBookings.data.message.map((booking) => (
                  <BookingCard
                    className={classes.card}
                    key={booking._id}
                    {...booking}
                  />))
                : <Typography className={classes.title} variant="h5" component="h1" gutterBottom>
                  <LinearProgress />
                </Typography>
              }
            </Grid>
          </>
        }
      </Grid>
    )
  }
}

const styles = (theme) => ({
  content: theme.content,
  title: {
    margin: theme.spacing(5, 8, 3)
  },
  scrollableList: {
    maxHeight: "69vh",
    width: "100%",
    overflowY: "scroll",
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
