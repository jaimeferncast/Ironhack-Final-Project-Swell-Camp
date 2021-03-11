import { Component } from "react"
import { withRouter } from 'react-router-dom'

import { Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, withStyles, LinearProgress, Grid } from "@material-ui/core"

import BedService from "../../../service/beds.service"
import OccupancyService from "../../../service/occupancies.service"

import { countNights, formatDates } from "../../../utils"
import CellButton from "../../shared/CellButton"

const addDays = require("date-fns/addDays")
const format = require("date-fns/format")

class Calendar extends Component {
  constructor() {
    super()
    this.state = {
      beds: [],
      firstDate: new Date().toUTCString(),
      lastDate: addDays(new Date(), 9).toUTCString(),
      dates: [],
      resultsPage: 1,
      occupancies: [],
      canRender: false,
    }

    this.bedService = new BedService()
    this.occupancyService = new OccupancyService()
  }


  componentDidMount = () => {
    this.fetchBeds()
  }

  fetchBeds = () => {
    this.bedService
      .getBeds()
      .then((response) => this.setState({ beds: response.data }, this.calculateDates(this.state.firstDate, this.state.lastDate)))
      .catch((err) => console.error(err))
  }

  calculateDates = (firstDate, lastDate) => {
    const nNights = countNights(firstDate, lastDate)
    const datesArray = []
    for (let i = 0; i < nNights; i++) datesArray.push(addDays(new Date(firstDate), i))
    this.setState({ dates: datesArray }, this.fetchOccupancies)
  }

  goToNextPage = () => {
    const firstDate = addDays(new Date(this.state.firstDate), 9)
    const lastDate = addDays(new Date(this.state.lastDate), 9)
    this.setState({ firstDate, lastDate, resultsPage: this.state.resultsPage + 1 }, this.calculateDates(firstDate, lastDate))
  }

  goToPreviousPage = () => {
    const firstDate = addDays(new Date(this.state.firstDate), -9)
    const lastDate = addDays(new Date(this.state.lastDate), -9)
    this.setState({ firstDate, lastDate, resultsPage: this.state.resultsPage - 1 }, this.calculateDates(firstDate, lastDate))
  }

  fetchOccupancies = async () => {
    const firstDateAdjusted = addDays(new Date(this.state.firstDate), -1)
    const response = await this.occupancyService.getOccupancyByDateRange(firstDateAdjusted, this.state.lastDate)
    const occupanciesArray = response.data.message
    this.setState({ occupancies: occupanciesArray, canRender: true })
  }

  getOccupancy = (bedId, date) => {
    if (this.state.occupancies.length) {
      return this.state.occupancies.find((elm) => elm.bedId === bedId && !countNights(date, elm.date))
    }
  }

  handleClick = (occupancy) => {
    this.props.history.push(`/validar-reserva/${occupancy.booking._id}`)
  }

  useCellButton = (bed_id, day) => {

    const occupancy = this.getOccupancy(bed_id, day)
    const cellState = occupancy ? "occupied" : "empty"
    const clickHandler = () => cellState === "occupied" && this.handleClick(occupancy)

    let cellButtonProps = {
      cellState,
      occupancyId: occupancy?._id || undefined,
      name: occupancy ? occupancy.booking?.name : "",
      groupCode: occupancy ? occupancy.booking?.groupCode : "",
      onClick: clickHandler,
    }
    return { ...cellButtonProps }
  }

  checkArrivals = (day) => {
    const checkins = this.state.occupancies.filter(elm => {
      const elmDate = new Date(elm.booking.arrival.date)
      return elmDate.getDate() === day.getDate()
    })
    const distinct = [...new Set(checkins.map(elm => elm.booking.dni))]
    return distinct.length
  }

  render() {
    const { classes } = this.props

    return (
      <Grid container className={classes.content} style={{ maxWidth: "1133px" }}>
        {!this.state.canRender
          ? <Typography style={{ margin: "30px 0" }} variant="h5" component="h1">
            <LinearProgress />
          </Typography>
          : <>
            <Grid container justify="space-between" alignItems="center">
              <Button
                className={classes.link}
                onClick={() => this.goToPreviousPage()}
                disabled={this.state.resultsPage === 1 && true}
              >Anteriores 9 días</Button>
              <Typography variant="h5" component="h1" style={{ margin: "30px 0", textAlign: "center" }}>
                Reservas del {format(new Date(this.state.firstDate), "d/MM")} al {format(addDays(new Date(this.state.lastDate), -1), "d/MM")}
              </Typography>
              <Button
                className={classes.link}
                onClick={() => this.goToNextPage()}
              >Siguientes 9 días</Button>
            </Grid>
            <TableContainer className={classes.container}>
              <Table stickyHeader style={{ borderCollapse: "collapse", width: "auto" }}>
                <TableHead>
                  <TableRow style={{ borderLeft: "1px solid #e0e0e0", borderBottom: "1px solid #e0e0e0" }}>
                    <TableCell align="center" padding="none" className={classes.header} style={{
                      borderRight: "2px solid #abbbd1"
                    }}>Cama</TableCell>
                    {this.state.dates.map((day) => (
                      <TableCell key={day} align="center" padding="none" style={{ borderRight: "2px solid #abbbd1", backgroundColor: "#ffe082de" }}>
                        {formatDates(day)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.beds.sort().map((bed) => (
                    <TableRow key={bed._id} >
                      <TableCell align="left" padding="none" classes={{ root: classes.firstCol }} style={{ borderRightWidth: "2px", fontSize: "0.78rem" }}>
                        {bed.code}
                      </TableCell>
                      {this.state.dates.map((day) => (
                        <CellButton key={`${bed.code}-${day}`} data={this.useCellButton(bed._id, day)} />
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TableContainer className={classes.container}>
              <Table stickyHeader style={{ borderCollapse: "collapse", width: "auto" }}>
                <TableBody>
                  <TableRow>
                    <TableCell align="left" className={classes.totalsLabel}>
                      CHECK-INs ={">"}
                    </TableCell>
                    {this.state.dates.map(day => (
                      <TableCell key={day} align="center" className={classes.totalsCell}>
                        <div className={classes.totalsCellBack}>{this.checkArrivals(day)}</div>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </>
        }
      </Grid>
    )
  }
}

const styles = (theme) => ({
  content: theme.content,
  container: {
    maxHeight: theme.spacing(60),
    maxWidth: theme.spacing(170),
  },
  header: {
    backgroundColor: theme.palette.primary.main,
    zIndex: "1000",
  },
  link: {
    width: "fit-content",
    height: "fit-content",
    marginRight: theme.spacing(1),
    backgroundColor: theme.palette.primary.main + "40",
    "&:hover": {
      backgroundColor: theme.palette.primary.main + "90"
    }
  },
  firstCol: {
    position: "sticky",
    left: "0",
    zIndex: "999",
    width: theme.spacing(12),
    padding: "0 0 0 7px",
    backgroundColor: theme.palette.primary.light,
    border: "1px solid #e0e0e0",
    borderCollapse: "collapse",
  },
  button: {
    height: theme.spacing(3),
    minWidth: theme.spacing(12),
  },
  totalsLabel: {
    width: "98px",
    padding: "13px 0 0 7px",
    fontSize: "0.8rem",
    borderBottom: "0",
    color: theme.palette.third.main,
  },
  totalsCell: {
    width: "113.5px",
    padding: "13px 0 0",
    fontSize: "1rem",
    borderBottom: "0",
    color: theme.palette.third.main,
  },
  totalsCellBack: {
    height: "30px",
    width: "30px",
    borderRadius: "50%",
    margin: "auto",
    lineHeight: "32px",
    backgroundColor: theme.palette.secondary.main + "90",
  },
})

export default withStyles(styles)(withRouter(Calendar))
