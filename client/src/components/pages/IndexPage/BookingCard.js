import { Card, Typography } from "@material-ui/core"

const BookingCard = (props) => (
  <Card className={props.className}>
    <Typography>Booking: {props.name}</Typography>
    <Typography>Llegada: {props.arrival.date.split("T")[0]}</Typography>
    <Typography>Salida: {props.departure.date.split("T")[0]}</Typography>
  </Card>
)

export default BookingCard
