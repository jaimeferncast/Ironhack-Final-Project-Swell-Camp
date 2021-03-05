import { Component } from "react"
import { Grid, Typography, withStyles } from "@material-ui/core"

import CalendarTable from "../../shared/CalendarTable"

class OccupationsCalendar extends Component {
  render() {
    const { classes } = this.props
    return (
      <Grid container className={classes.container}>
        <Typography variant="h4" component="h1">
          Occupations
        </Typography>
        <CalendarTable />
      </Grid>
    )
  }
}

const styles = (theme) => ({
  container: {
    paddingTop: theme.spacing(9),
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
})
export default withStyles(styles)(OccupationsCalendar)
