import { Link } from "react-router-dom"
import { Button, Card, makeStyles, Typography, Grid } from "@material-ui/core"
import clsx from "clsx"

const BookingCard = (props) => {
  const classes = useStyle()

  return (
    <Card className={clsx(props.className, classes.card)}>
      <Grid container>
        <Typography>{props.name}&emsp;|&emsp;</Typography>
        <Typography>{props.email}&emsp;|&emsp;</Typography>
        <Typography>{props.accomodation === "none"   /* TO-DO util para cambiar alojmiento y que no salga en cameCase */
          ? "Sólo clases"
          : props.accomodation}&emsp;|&emsp;</Typography>
        <Typography>Llegada: {props.arrival.date.split("T")[0]}&emsp;|&emsp;</Typography>
        <Typography>Salida: {props.departure.date.split("T")[0]}</Typography>
      </Grid>
      <Grid container justify="flex-end">
        <Button className={classes.link} component={Link} to={`validar-reserva/${props._id}`}> {/* pasar props en el link y ahorrarnos la llamda al back? */}
        Gestionar reserva
      </Button>
      </Grid>
    </Card>
  )
}

const useStyle = makeStyles((theme) => ({
  card: {
    backgroundColor: theme.palette.secondary.main + "70",
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
