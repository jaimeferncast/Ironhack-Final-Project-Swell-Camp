import { Component } from 'react'

import { Button, TextField, withStyles, Grid, FormLabel, FormControl, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core'

const format = require("date-fns/format")

const styles = (theme) => ({
    paper: {
        position: "absolute",
        backgroundColor: theme.palette.secondary.light,
        border: "2px solid #e92868",
        borderRadius: "10px",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(5, 7, 2),
    },
    form: {
        width: theme.spacing(50),
        display: "flex",
        flexDirection: "column",
        "& > *": {
            marginBottom: theme.spacing(3),
        },
    },
    formControl: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    }
})

class BookingForm extends Component {
    constructor() {
        super()
        this.state = {
            booking: {},
        }
    }

    componentDidMount = () => {
        this.setState({ booking: this.props.booking })
    }

    handleInputChange(e) {
        const { name, value } = e.target
        this.setState({ booking: { ...this.state.booking, [name]: value } })
    }

    handleDateChange(e) {
        const { name, value } = e.target
        const date = new Date(value)
        this.setState({ booking: { ...this.state.booking, [name]: { ...this.state.booking[name], date: date.toUTCString() } } })
    }

    handleStatusChange(e) {
        const status = e.target.checked ? "accepted" : "pending"
        this.setState({ booking: { ...this.state.booking, status } })
    }

    handlePaidChange(e) { this.setState({ booking: { ...this.state.booking, paid: e.target.checked } }) }

    render() {
        const { classes } = this.props

        return (
            <>{
                this.state.booking.arrival &&
                <div className={classes.paper}>
                    <form
                        onSubmit={e => this.props.handleModalFormSubmit(e, { ...this.state.booking })}
                        className={classes.form}
                    >
                        <TextField fullWidth
                            name="name"
                            label="Nombre"
                            type="text"
                            value={this.state.booking.name}
                            onChange={e => this.handleInputChange(e)} />
                        <Grid style={{ display: "flex", justifyContent: "space-between" }}>
                            <TextField
                                name="arrival"
                                label="Fecha de llegada"
                                type="date"
                                format="dd/MM/yyyy"
                                defaultValue={format(new Date(this.state.booking.arrival.date), "yyyy-MM-dd")}
                                onChange={e => this.handleDateChange(e)}
                                InputLabelProps={{
                                    shrink: true,
                                }} />
                            <TextField
                                name="departure"
                                label="Fecha de salida"
                                type="date"
                                format="dd/MM/yyyy"
                                defaultValue={format(new Date(this.state.booking.departure.date), "yyyy-MM-dd")}
                                onChange={e => this.handleDateChange(e)}
                                InputLabelProps={{
                                    shrink: true,
                                }} />
                        </Grid>
                        <Grid style={{ display: "flex", justifyContent: "space-between" }}>
                            <TextField
                                name="dni"
                                label="DNI"
                                type="text"
                                value={this.state.booking.dni}
                                onChange={e => this.handleInputChange(e)} />
                            <TextField
                                name="phoneNumber"
                                label="Número de teléfono"
                                type="text"
                                value={this.state.booking.phoneNumber}
                                onChange={e => this.handleInputChange(e)} />
                        </Grid>
                        <Grid style={{ display: "flex", justifyContent: "space-between" }}>
                            <TextField style={{ width: "65%" }}
                                name="email"
                                label="Email"
                                type="text"
                                value={this.state.booking.email}
                                onChange={e => this.handleInputChange(e)} />
                            <TextField style={{ width: "23%" }}
                                name="surfLevel"
                                label="Nivel de surf"
                                type="text"
                                value={this.state.booking.surfLevel}
                                onChange={e => this.handleInputChange(e)} />
                        </Grid>
                        <TextField multiline
                            name="foodMenu"
                            label="Preferencia de menú"
                            type="text"
                            value={this.state.booking.foodMenu}
                            onChange={e => this.handleInputChange(e)} />
                        <TextField multiline
                            name="additionalInfo"
                            label="Información adicional"
                            type="text"
                            value={this.state.booking.additionalInfo}
                            onChange={e => this.handleInputChange(e)} />
                        <TextField
                            name="groupCode"
                            label="Código de grupo"
                            type="text"
                            value={this.state.booking.groupCode}
                            onChange={e => this.handleInputChange(e)} />
                        <Grid style={{ display: "flex", justifyContent: "space-between" }}>
                            <TextField
                                name="discountCode"
                                label="Código de descuento"
                                type="text"
                                value={this.state.booking.discountCode}
                                onChange={e => this.handleInputChange(e)} />
                            <TextField
                                name="price"
                                label="Tarifa"
                                type="text"
                                value={this.state.booking.price}
                                onChange={e => this.handleInputChange(e)} />
                        </Grid>
                        <FormControl component="fieldset">
                            <FormLabel style={{ fontSize: "0.8rem" }}>Estado de la reserva</FormLabel>
                            <FormGroup className={classes.formControl}>
                                <FormControlLabel
                                    control={
                                        <Checkbox disabled={this.state.booking.status === "pending" ? true : false}
                                            checked={this.state.booking.status === "accepted" ? true : false}
                                            onChange={e => this.handleStatusChange(e)} color="primary" />
                                    }
                                    label="Reserva aceptada"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={this.state.booking.paid}
                                            onChange={e => this.handlePaidChange(e)} color="primary" />
                                    }
                                    label="Reserva pagada"
                                />
                            </FormGroup>
                        </FormControl>
                        <Button variant="contained" color="primary" type="submit">
                            Modificar reserva</Button>
                    </form>
                </div>
            }</>
        )
    }
}

export default withStyles(styles)(BookingForm)