import { Component } from "react"
import { Grid, Typography, withStyles } from "@material-ui/core"

import CalendarTable from "../../shared/CalendarTable"

class OccupationsCalendar extends Component {
  render() {
    const { classes } = this.props
    const bookingId = this.props.match.params.id
    return (
      <Grid container className={classes.container}>
        <Typography variant="h4" component="h1">
          Occupations
        </Typography>
        <CalendarTable bookingId={bookingId} />
      </Grid>
    )
  }
}

const styles = (theme) => ({
  container: {
    marginTop: theme.spacing(9),
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
})
export default withStyles(styles)(OccupationsCalendar)
