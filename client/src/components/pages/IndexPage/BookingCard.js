import { Link } from "react-router-dom"
import { Button, Card, makeStyles, Typography } from "@material-ui/core"
import clsx from "clsx"

const BookingCard = (props) => {
  const classes = useStyle()

  return (
    <Card className={clsx(props.className, classes.card)}>
      <Typography>Booking: {props.name}</Typography>
      <Typography>Llegada: {props.arrival.date.split("T")[0]}</Typography>
      <Typography>Salida: {props.departure.date.split("T")[0]}</Typography>

      <Button component={Link} to={`validar-reserva/${props._id}`}>
        Aprobar reserva
      </Button>
    </Card>
  )
}

const useStyle = makeStyles((theme) => ({
  card: {
    backgroundColor: theme.palette.primary.main + "AA",
    padding: theme.spacing(2),
    textDecoration: "none",
  },
  link: {
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
}))
export default BookingCard
