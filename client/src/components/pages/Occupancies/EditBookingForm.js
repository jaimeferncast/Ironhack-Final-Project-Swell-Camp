import { Component } from 'react'

import {
  Button,
  TextField,
  withStyles,
  Grid,
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Typography,
  MenuItem,
} from '@material-ui/core'

import CustomAlert from '../../shared/Alert'

import clsx from 'clsx'

import BookingService from '../../../service/bookings.service'
import DiscountService from '../../../service/discounts.service'

const format = require('date-fns/format')

class EditBookingForm extends Component {
  constructor(props) {
    super()

    this.state = {
      booking: props.booking,
      group: 'noGroup',
      transfer: '',
      alertMssg: '',
      alertType: 'success',
    }

    this.bookingService = new BookingService()
    this.discountService = new DiscountService()
  }

  componentDidMount = () => {
    const { arrival, departure } = this.props.booking
    let transfer = ""
    if (arrival.transfer && departure.transfer) { transfer = "transfer" }
    else if (arrival.transfer && !departure.transfer) { transfer = "arrivalTransferOnly" }
    else if (!arrival.transfer && departure.transfer) { transfer = "departureTransferOnly" }
    this.setState({ transfer })
  }

  handleInputChange = (e) => {
    const { name, value } = e.target
    this.setState({ booking: { ...this.state.booking, [name]: value } })
  }

  handleDateChange = (e) => {
    const { name, value } = e.target
    const date = new Date(value)

    this.setState({
      booking: { ...this.state.booking, [name]: { ...this.state.booking[name], date: date.toUTCString() } }
    }, () => this.calculateBookingPrice())
  }

  handleStatusChange = (e) => {
    const status = e.target.checked ? 'accepted' : 'pending'
    this.setState({ booking: { ...this.state.booking, status } })
  }

  handlePaidChange = (e) => {
    this.setState({ booking: { ...this.state.booking, paid: e.target.checked } })
  }

  handleTransferChange = (e) => {
    const { name, value } = e.target
    switch (value) {
      case "":
        this.setState({
          booking: {
            ...this.state.booking, arrival: { ...this.state.booking.arrival, transfer: "" }, departure: { ...this.state.booking.departure, transfer: "" }
          }, [name]: value,
        })
        break;
      case "transfer":
        this.setState({
          booking: {
            ...this.state.booking, arrival: { ...this.state.booking.arrival, transfer: "" }, departure: { ...this.state.booking.departure, transfer: "" }
          }, [name]: value,
        })
        break;
      case "arrivalTransferOnly":
        this.setState({
          booking: {
            ...this.state.booking, departure: { ...this.state.booking.departure, transfer: "" }
          }, [name]: value,
        })
        break;
      case "departureTransferOnly":
        this.setState({
          booking: {
            ...this.state.booking, arrival: { ...this.state.booking.arrival, transfer: "" }
          }, [name]: value,
        })
        break;
      default:
        break;
    }
    this.setState({ [name]: value })
  }

  handleTransferInfoChange = (e) => {
    const { name, value } = e.target
    if (name === "arrivalAndDeparture") {
      this.setState({
        booking: {
          ...this.state.booking, arrival: { ...this.state.booking.arrival, transfer: value }, departure: { ...this.state.booking.departure, transfer: value }
        },
      })
    } else {
      this.setState({
        booking: { ...this.state.booking, [name]: { ...this.state.booking[name], transfer: value } },
      })
    }
  }

  calculateBookingPrice = () => {
    this.bookingService
      .calculatePrice(this.state.booking)
      .then((response) =>
        this.setState({ booking: { ...this.state.booking, price: response.data.message }, price: response.data.message, showPrice: true })
      )

      .catch((error) =>
        this.setState({
          booking: { ...this.state.booking },
          alertMssg: error.message,
          alertType: 'error',
        })
      )
  }

  handleEditBooking = (e) => {
    e.preventDefault()
    this.props.handleModalFormSubmit(e, { ...this.state.booking })
  }

  clearAlert = () => {
    this.setState({ alertMssg: '', alertType: 'success', })
  }

  render() {
    const { classes } = this.props

    return (
      <>
        {this.state.alertMssg && (
          <CustomAlert
            alertType={this.state.alertType}
            alertMssg={this.state.alertMssg}
            clearAlert={() => this.clearAlert()}
          />
        )}

        <div className={clsx(classes.paper, this.props.className)}>
          <form onSubmit={this.handleEditBooking} className={classes.form}>
            <Typography variant="subtitle1" style={{ color: '#e92868' }}>CÓDIGO DE RESERVA: {this.state.booking.bookingCode}</Typography>

            {/* Name */}
            <TextField
              required
              fullWidth
              name="name"
              label="Nombre"
              type="text"
              value={this.state.booking.name}
              onChange={this.handleInputChange}
              style={{ marginBottom: "5px" }}
            />
            {!this.state.booking.firstTime && (
              <Typography variant="subtitle2" style={{ color: '#e92868', fontWeight: "200" }}>
                Es antiguo alumno
              </Typography>
            )}

            {/* Dates */}
            <Grid style={{ display: 'flex', justifyContent: 'space-between', marginBottom: "8px" }}>
              <TextField
                required
                name="arrival"
                label="Fecha de llegada"
                type="date"
                format="dd/MM/yyyy"
                defaultValue={
                  !this.props.newBooking && format(new Date(this.state.booking.arrival.date), 'yyyy-MM-dd')
                }
                onChange={this.handleDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                required
                name="departure"
                label="Fecha de salida"
                type="date"
                format="dd/MM/yyyy"
                defaultValue={
                  !this.props.newBooking && format(new Date(this.state.booking.departure.date), 'yyyy-MM-dd')
                }
                onChange={this.handleDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Typography variant="subtitle3" style={{ color: '#e92868', fontSize: "0.757rem", fontWeight: "200" }}>
              Si cambias alguna de las fechas, la tarifa se actualizará automáticamente y tendrás que volver a asignar cama a la reserva.
                  </Typography>

            {/* DNI and Phone Number */}
            <Grid style={{ display: 'flex', justifyContent: 'space-between' }}>
              <TextField
                required
                name="dni"
                label="DNI"
                type="text"
                value={this.state.booking.dni}
                onChange={this.handleInputChange}
              />

              <TextField
                required
                name="phoneNumber"
                label="Número de teléfono"
                type="text"
                value={this.state.booking.phoneNumber}
                onChange={this.handleInputChange}
              />
            </Grid>

            {/* Email */}
            <TextField
              required
              name="email"
              label="Email"
              type="text"
              value={this.state.booking.email}
              onChange={this.handleInputChange}
            />

            {/* Surf Level */}
            <FormControl>
              <FormLabel required component="legend">
                Nivel de surf
                  </FormLabel>
              <RadioGroup value={this.state.booking.surfLevel} name="surfLevel" onChange={this.handleInputChange}>
                <FormControlLabel
                  value="0"
                  control={<Radio color="primary" />}
                  label={<Typography variant="body2">Nunca he practicado surf, pero tengo muchas ganas</Typography>}
                />
                <FormControlLabel
                  value="0.5"
                  control={<Radio color="primary" />}
                  label={<Typography variant="body2">Di alguna clase, pero aún soy iniciación</Typography>}
                />
                <FormControlLabel
                  value="1"
                  control={<Radio color="primary" />}
                  label={<Typography variant="body2">Me pongo de pie en espumas, saludo al personal y me caigo</Typography>}
                />
                <FormControlLabel
                  value="1.5"
                  control={<Radio color="primary" />}
                  label={<Typography variant="body2">Empiezo a ir al pico cuando está pequeño</Typography>}
                />
                <FormControlLabel
                  value="2"
                  control={<Radio color="primary" />}
                  label={<Typography variant="body2">Voy al pico, cojo paredes y corro la ola</Typography>}
                />
              </RadioGroup>
            </FormControl>

            {/* Menu */}
            <TextField
              required
              multiline
              name="foodMenu"
              label="Preferencia de menú"
              type="text"
              value={this.state.booking.foodMenu}
              onChange={this.handleInputChange}
            />

            {/* Additional Info */}
            <TextField
              multiline
              name="additionalInfo"
              label="Información adicional"
              type="text"
              value={this.state.booking.additionalInfo}
              onChange={this.handleInputChange}
            />

            {/* Transfer */}
            <FormControl>
              <FormLabel component="legend">Transfer</FormLabel>
              <FormGroup>
                <RadioGroup name="transfer" value={this.state.transfer} onChange={this.handleTransferChange}>
                  <Grid style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <FormControlLabel
                      value=""
                      control={<Radio color="primary" />}
                      label="No"
                    />
                    <FormControlLabel
                      value="transfer"
                      control={<Radio color="primary" />}
                      label="Sí, de llegada y salida"
                    />
                  </Grid>
                  <Grid style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <FormControlLabel
                      value="arrivalTransferOnly"
                      control={<Radio color="primary" />}
                      label="Sólo de llegada"
                    />
                    <FormControlLabel
                      value="departureTransferOnly"
                      control={<Radio color="primary" />}
                      label="Sólo de salida"
                    />
                  </Grid>
                </RadioGroup>

                {(this.state.transfer === "transfer") && (
                  <TextField
                    id="standard-select-currency"
                    select
                    name="arrivalAndDeparture"
                    label="Punto de recogida"
                    value={this.state.booking.arrival.transfer}
                    onChange={this.handleTransferInfoChange}
                  >
                    <MenuItem value="Aeropuerto de Asturias">Aeropuerto de Asturias</MenuItem>
                    <MenuItem value="Avilés">Avilés</MenuItem>
                    <MenuItem value="Gijón">Gijón</MenuItem>
                    <MenuItem value="Oviedo">Oviedo</MenuItem>
                  </TextField>
                )}
                {(this.state.transfer === "arrivalTransferOnly") && (
                  <TextField
                    id="standard-select-currency"
                    select
                    name="arrival"
                    label="Punto de recogida"
                    value={this.state.booking.arrival.transfer}
                    onChange={this.handleTransferInfoChange}
                  >
                    <MenuItem value="Aeropuerto de Asturias">Aeropuerto de Asturias</MenuItem>
                    <MenuItem value="Avilés">Avilés</MenuItem>
                    <MenuItem value="Gijón">Gijón</MenuItem>
                    <MenuItem value="Oviedo">Oviedo</MenuItem>
                  </TextField>
                )}
                {(this.state.transfer === "departureTransferOnly") && (
                  <TextField
                    id="standard-select-currency"
                    select
                    name="departure"
                    label="Punto de recogida"
                    value={this.state.booking.departure.transfer}
                    onChange={this.handleTransferInfoChange}
                  >
                    <MenuItem value="Aeropuerto de Asturias">Aeropuerto de Asturias</MenuItem>
                    <MenuItem value="Avilés">Avilés</MenuItem>
                    <MenuItem value="Gijón">Gijón</MenuItem>
                    <MenuItem value="Oviedo">Oviedo</MenuItem>
                  </TextField>
                )}
              </FormGroup>
            </FormControl>

            {/* Group Code */}
            <TextField
              name="groupCode"
              label="Código de grupo"
              type="text"
              value={this.state.booking.groupCode}
              onChange={this.handleInputChange}
            />

            {/* Discount Code and Price */}
            <Grid container justify="space-between" style={{ marginBottom: "8px" }}>
              <Grid item>
                <TextField
                  label="Código de descuento"
                  type="text"
                  defaultValue={this.state.booking.discountCode}
                  inputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid
                item
                component={TextField}
                name="price"
                label="Tarifa"
                type="text"
                value={this.state.booking.price}
                onChange={this.handleInputChange}
              />
            </Grid>
            <Typography variant="subtitle2" style={{ color: '#e92868', fontWeight: "200", fontSize: "0.757rem" }}>
              La tarifa puede ser modificada directamente si fuese necesario.
              </Typography>

            {/* Booking Status */}
            <FormControl component="fieldset" style={{ marginBottom: "5px" }}>
              <FormLabel style={{ fontSize: "0.8rem" }}>Estado de la reserva</FormLabel>
              <FormGroup className={classes.formControl}>
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled={this.state.booking.status === 'pending' ? true : false}
                      checked={this.state.booking.status === 'accepted' ? true : false}
                      onChange={this.handleStatusChange}
                      color="primary"
                    />
                  }
                  label="Reserva aceptada"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.booking.paid}
                      onChange={this.handlePaidChange}
                      color="primary"
                    />
                  }
                  label="Reserva pagada"
                />
              </FormGroup>
            </FormControl>
            <Typography variant="subtitle2" style={{ color: '#e92868', fontWeight: "200", fontSize: "0.757rem" }}>
              Desmarca la opción "Reserva aceptada" para que vuelva a aparecer en la página de inicio como reserva pendiente de validar.
              </Typography>

            <Button variant="contained" color="primary" type="submit">Modificar reserva</Button>
          </form>
        </div>
      </>
    )
  }
}

const styles = (theme) => ({
  paper: {
    height: '80vh',
    overflowY: 'scroll',
    backgroundColor: theme.palette.secondary.light,
    border: '2px solid #e92868',
    borderRadius: '10px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(5, 7, 2),
  },

  formControl: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  discountContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },

  validateIcon: {
    alignSelf: 'flex-end',
  },

  checkIcon: {
    color: theme.palette.validationSuccess.main,
  },

  summaryCard: {
    width: theme.spacing(60),
    position: 'absolute',
    top: theme.spacing(12),
    backgroundColor: theme.palette.secondary.light,
    border: '2px solid #e92868',
    borderRadius: '10px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(5, 7, 2),
  },
})

export default withStyles(styles)(EditBookingForm)
