import { Component } from "react"

import { Grid, Typography, Button } from "@material-ui/core"

import BookingCard from "./BookingCard"
import BookingService from "../../../service/bookings.service"

class SearchResults extends Component {
  state = {
    searchedBooking: undefined,
    resultsPage: 1,
  }
  BookingService = new BookingService()

  componentDidMount = () => {
    this.fetchSearchedBookings(this.state.resultsPage)
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.bookingSearchInput !== this.props.bookingSearchInput) {
      this.fetchSearchedBookings(1)
    } else if (!this.props.bookingSearchInput) { this.props.restorePendingBookings() }
  }

  fetchSearchedBookings = async (page) => {
    const DBBookings = await this.BookingService.getBookingByOpenSearch(this.props.bookingSearchInput, page)
    this.setState({ searchedBooking: DBBookings, resultsPage: page })
  }

  goToNextPage = () => {
    this.fetchSearchedBookings(this.state.resultsPage + 1)
  }

  goToPreviousPage = () => {
    this.fetchSearchedBookings(this.state.resultsPage - 1)
  }

  render() {
    const { classes } = this.props
    return (
      <>
        <Typography className={classes.title} variant="h4" component="h1" gutterBottom>
          Resultado de la búsqueda:
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
          {this.state.searchedBooking?.data.message.map((booking) => (
            <BookingCard className={classes.card} key={booking._id} {...booking} />
          ))}
        </Grid>
      </>
    )
  }
}

export default SearchResults
