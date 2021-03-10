import { Component } from "react"
import { withRouter } from 'react-router-dom'

import { Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, withStyles, LinearProgress, Grid } from "@material-ui/core"

import CellButton from "../../shared/CellButton"

import BedService from "../../../service/beds.service"
import OccupancyService from "../../../service/occupancies.service"

import { countNights, formatDates } from "../../../utils"

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

    fetchOccupancies = async () => {
        const response = await this.occupancyService.getOccupancyByDateRange(this.state.firstDate, this.state.lastDate)
        const occupanciesArray = response.data.message
        this.setState({ occupancies: occupanciesArray, canRender: true })
    }

    getOccupancy = (bedId, date) => {
        if (this.state.occupancies.length) {
            return this.state.occupancies.find((elm) => elm.bedId === bedId && !countNights(date, elm.date))
        }
    }

    handleClickOccupied = (occupancy) => {
        this.props.history.push(`/validar-reserva/${occupancy.booking._id}`)
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        const newBedsArray = this.state.occupancies
            .filter(occupancy => occupancy.status === "created")
            .map(occupancy => occupancy.bedId)

        if (newBedsArray.length) {
            const formData = { ...this.state.booking, bedIds: newBedsArray }
            formData.status = "accepted"
            await this.bookingService.updateBookingById(this.state.booking._id, formData)
        }

        const updatedOccupancies = this.state.occupancies
            .filter((occupancy) => occupancy.status === "updated")
        if (updatedOccupancies.length) {
            await Promise.all(updatedOccupancies.map((occupancy) => this.occupancyService.updateOccupancy(occupancy._id, occupancy)))
        }

        this.props.history.push('/')
    }

    useCellButton = (bed_id, day) => {

        const occupancy = this.getOccupancy(bed_id, day)
        const cellState = occupancy ? "occupied" : "empty"
        const clickHandler = () => cellState === "occupied" && this.handleClickOccupied(occupancy)

        let cellButtonProps = {
            cellState,
            occupancyId: occupancy?._id || undefined,
            name: occupancy ? occupancy.booking?.name : "",
            groupCode: occupancy ? occupancy.booking?.groupCode : "",
            onClick: clickHandler,
        }
        return { ...cellButtonProps }
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
                        {<Typography variant="h6" component="h1" style={{ margin: "30px 0", textAlign: "center", width: "100%" }}>
                            Reservas del {format(new Date(this.state.firstDate), "d/MM")} al {format(addDays(new Date(this.state.lastDate), -1), "d/MM")}
                        </Typography>}
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
                                            <TableCell align="left" padding="none" classes={{ root: classes.firstCol }}>
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
                        <Grid style={{ display: "flex", justifyContent: "flex-start" }}>
                            <form onSubmit={this.handleSubmit}>
                                <Button variant="contained" color="primary" className={classes.submitButton} type="submit">
                                    Guardar</Button>
                            </form>
                            <form onSubmit={this.openModal} style={{ marginLeft: "50px" }}>
                                <Button variant="contained" color="primary" className={classes.submitButton} type="submit">
                                    Ver detalles de reserva</Button>
                            </form>
                        </Grid>
                    </>
                }
            </Grid>
        )
    }
}

const styles = (theme) => ({
    container: {
        maxHeight: theme.spacing(60),
        maxWidth: theme.spacing(170),
    },
    header: {
        backgroundColor: theme.palette.primary.main,
        zIndex: "1000",
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
    bedButton: {
        padding: "0 0 0 7px",
        fontSize: "0.7rem",
        justifyContent: "flex-start",
        "&:hover": {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.third.main,
        }
    },
    button: {
        height: theme.spacing(3),
        minWidth: theme.spacing(12),
    },
    submitButton: {
        marginTop: theme.spacing(5),
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default withStyles(styles)(withRouter(Calendar))
