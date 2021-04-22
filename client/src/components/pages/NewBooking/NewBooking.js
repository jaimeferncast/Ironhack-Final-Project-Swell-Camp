import { makeStyles } from "@material-ui/core"
import NewBookingForm from "./NewBookingForm"

const NewBooking = (props) => {
  const classes = useStyles()
  return (
    <NewBookingForm newBooking={true} className={classes.bookingForm} />
  )
}

const useStyles = makeStyles((theme) => ({
  bookingForm: {
    marginTop: theme.spacing(4),
  },
}))
export default NewBooking
