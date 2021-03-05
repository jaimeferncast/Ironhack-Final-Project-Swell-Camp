import { Grid, makeStyles, Typography } from "@material-ui/core"

import BookingCard from "./BookingCard"

const BookingsList = (props) => {
  const classes = useStyle()

  return (
    <>{props.searchedBooking
      ? <><Typography className={classes.title} variant="h4" component="h1" gutterBottom="true">
        Resultado de la búsqueda:
            </Typography>
        <Grid item className={classes.scrollableList}>
          {props.searchedBooking.data.message.map((booking) => (
            <BookingCard className={classes.card} key={booking._id} {...booking} />
          ))}
        </Grid></>
      : <><Typography className={classes.title} variant="h4" component="h1" gutterBottom="true">
        Reservas pendientes de aprobación:
            </Typography>
        <Grid item className={classes.scrollableList}>
          {props.pendingBookings
            ? props.pendingBookings.data.message.map((booking) => (
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
    }</>
  )
}

const useStyle = makeStyles((theme) => ({
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
}))

export default BookingsList
