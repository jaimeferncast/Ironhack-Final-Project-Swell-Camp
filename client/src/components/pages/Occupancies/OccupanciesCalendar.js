import { Component } from "react"

import { Grid, withStyles } from "@material-ui/core"

import CalendarTable from "../../shared/CalendarTable"

class OccupanciesCalendar extends Component {
  render() {
    const { classes } = this.props
    const bookingId = this.props.match.params.id
    return (
      <Grid container className={classes.content} style={{ maxWidth: "1133px" }}>
        <CalendarTable bookingId={bookingId} />
      </Grid>
    )
  }
}

const styles = (theme) => ({
  content: theme.content,
})

export default withStyles(styles)(OccupanciesCalendar)
