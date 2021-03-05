import { Component } from "react"

import { Grid, withStyles, Typography } from "@material-ui/core"

import BookingCard from "./BookingCard"
import BookingService from "../../../service/bookings.service"
import backgroundImage from "../../../assets/indexBackground.jpg"

class IndexPage extends Component {
  state = {
    pendingBookings: undefined,
    searchedBooking: undefined,
  }
  BookingService = new BookingService()

  componentDidMount = () => {
    this.fetchPendingBookings()
  }

  componentDidUpdate = (prevProps) => {
    prevProps.searchedBooking !== this.state.searchedBooking
      && this.setState({ searchedBooking: this.props.searchedBooking })
  }

  fetchPendingBookings = async () => {
    const DBBookings = await this.BookingService.getPendingBookings()
    this.setState({ pendingBookings: DBBookings })
  }

  // fetchSearchedBookings = async () => {
  //   this.set
  // }

  render() {
    const { classes } = this.props
    return (
      <Grid container className={classes.container}>

        {this.state.searchedBooking
          ? <><Typography className={classes.title} variant="h4" component="h1" gutterBottom="true">
            Resultado de la búsqueda: {this.state.searchedBooking}
          </Typography></>
          /* <Grid item className={classes.scrollableList}>
            {this.state.searchedBooking.data.message.map((booking) => (
              <BookingCard className={classes.card} key={booking._id} {...booking} />
            ))}
          </Grid></> */

          : <><Typography className={classes.title} variant="h4" component="h1" gutterBottom="true">
            Reservas pendientes de aprobación:
            </Typography>
            <Grid item className={classes.scrollableList}>

              {this.state.pendingBookings
                ? this.state.pendingBookings.data.message.map((booking) => (
                  <BookingCard
                    className={classes.card}
                    key={booking._id}
                    {...booking}
                  />))

                : <Typography className={classes.title} variant="h5" component="h1" gutterBottom="true">
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
    margin: theme.spacing(5, 8)
  },
  scrollableList: {
    maxHeight: "69vh",
    width: "100%",
    overflowY: "scroll",
  },
  card: {
    margin: theme.spacing(0, 8, 3, 8),
  },
})

export default withStyles(styles)(IndexPage)
