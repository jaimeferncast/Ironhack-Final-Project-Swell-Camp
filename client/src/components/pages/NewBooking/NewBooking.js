import { makeStyles } from "@material-ui/core"
import BookingForm from "../../shared/BookingForm"

const NewBooking = (props) => {
  const classes = useStyles()
  return (
    <>
      <BookingForm newBooking={true} className={classes.bookingForm} />
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  bookingForm: {
    marginTop: theme.spacing(4),
  },
}))
export default NewBooking
