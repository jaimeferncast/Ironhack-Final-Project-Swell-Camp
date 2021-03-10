import { Link } from "react-router-dom"
import { Button, Card, makeStyles, Typography, Grid } from "@material-ui/core"
import clsx from "clsx"

import { formatDates } from "../../../utils"

const BookingCard = (props) => {
  const classes = useStyle()

  return (
    <Card className={clsx(props.className, classes.card)}>
      <Grid container>
        <Typography>{props.name}&emsp;|&emsp;</Typography>
        <Typography>{props.email}&emsp;|&emsp;</Typography>
        <Typography>Llegada: {formatDates(new Date(props.arrival.date))}&emsp;|&emsp;</Typography>
        <Typography>Salida: {formatDates(new Date(props.departure.date))}</Typography>
      </Grid>
      <Grid container justify="flex-end">
        <Button className={classes.link} component={Link} to={`validar-reserva/${props._id}`}>
          {" "}
          {/* pasar props en el link y ahorrarnos la llamda al back? */}
          Gestionar reserva
        </Button>
      </Grid>
    </Card>
  )
}

const useStyle = makeStyles((theme) => ({
  card: {
    backgroundColor: theme.palette.secondary.main + "A0",
    padding: theme.spacing(2),
    textDecoration: "none",
  },
  link: {
    "&:hover": {
      backgroundColor: theme.palette.secondary.main + "90",
    },
    marginRight: theme.spacing(1),
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
}))

export default BookingCard
