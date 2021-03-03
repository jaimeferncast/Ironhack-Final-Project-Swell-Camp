import { Grid, withStyles } from "@material-ui/core"
import { Component } from "react"
import BookingCard from "./BookingCard"
import BookingService from "../../../service/bookings.service"
import backgroundImage from "../../../assets/indexBackground.jpg"

class IndexPage extends Component {
  state = {
    bookings: [],
  }
  BookingService = new BookingService()

  componentDidMount = () => {
    this.fetchBookings()
  }

  fetchBookings = async () => {
    const DBBookings = await this.BookingService.getBookings()
    this.setState({ bookings: DBBookings })
  }

  render() {
    const { classes, theme } = this.props
    return (
      <Grid container className={classes.container}>
        <Grid item className={classes.scrollableList}>
          {this.state.bookings.data?.message.map((booking) => (
            <BookingCard
              className={classes.card}
              key={booking._id}
              {...booking}
            ></BookingCard>
          ))}
        </Grid>
      </Grid>
    )
  }
}

const styles = (theme) => ({
  container: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    minHeight: "100vh",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  scrollableList: {
    maxHeight: "300px",
    overflowY: "scroll",
  },
  card: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary,
  },
})

export default withStyles(styles)(IndexPage)
