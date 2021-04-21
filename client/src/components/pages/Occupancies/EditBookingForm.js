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
  CircularProgress,
} from '@material-ui/core'

import PhoneIcon from '@material-ui/icons/Phone'
import EmailIcon from '@material-ui/icons/Email'
import CheckIcon from '@material-ui/icons/Check'
import ClearIcon from '@material-ui/icons/Clear'

import Alert from '@material-ui/lab/Alert'

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
      showPrice: false,
      price: 0,
      isDiscountLoading: false,
      isDiscountValid: false,
      displayDiscountValidation: false,
      bookingSent: false,
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
      booking: { ...this.state.booking, [name]: { ...this.state.booking[name], date: date.toUTCString() } },
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

  handleValidateDiscount = async (discountCode) => {
    this.setState({
      // booking: { ...this.state.booking },
      isDiscountLoading: true,
      isDiscountValid: false,
      displayDiscountValidation: true,
    })

    try {
      const isValidResponse = await this.discountService.validateDiscount(discountCode)

      this.setState({
        booking: { ...this.state.booking },
        isDiscountValid: isValidResponse.data,
        displayDiscountValidation: true,
      }, () => this.calculateBookingPrice())
    } catch (error) {
      this.setState({
        booking: { ...this.state.booking },

        alertMssg: error.message,
        alertType: 'error',
      })
    }

    this.setState({
      booking: { ...this.state.booking },
      isDiscountLoading: false,
    })
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

  render() {
    const { classes } = this.props

    return (
      <>
        {this.state.alertMssg && (
          <Alert
            severity={this.state.alertType}
            className={classes.alert}
            onClose={() => {
              this.setState({ alertMssg: '', alertType: 'success' })
            }}
          >
            {this.state.alertMssg}
          </Alert>
        )}

        <div className={clsx(classes.paper, this.props.className)}>
          <form onSubmit={this.handleCreateBooking} className={classes.form}>
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
            />

            {/* Dates */}
            <Grid style={{ display: 'flex', justifyContent: 'space-between' }}>
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

            {(!this.props.newBooking || this.state.group === 'group') && (
              <TextField
                name="groupCode"
                label="Código de grupo"
                type="text"
                helperText="Si eres el primero de tu grupo en registrarte, escribe el código que quieras. Si no, escribe el código que ya haya elegido el primero de tu grupo"
                value={this.state.booking.groupCode}
                onChange={this.handleInputChange}
              />
            )}

            <Grid container className={classes.discountContainer}>
              <Grid
                item
                component={TextField}
                name="discountCode"
                label="Código de descuento"
                type="text"
                value={this.state.booking.discountCode}
                onChange={this.handleInputChange}
              />

              {this.props.newBooking ? (
                <>
                  {this.state.displayDiscountValidation &&
                    (this.state.isDiscountLoading ? (
                      <Grid item className={classes.validateIcon}>
                        <CircularProgress size={30} />
                      </Grid>
                    ) : this.state.isDiscountValid ? (
                      <Grid item className={classes.validateIcon}>
                        <CheckIcon classes={{ root: classes.checkIcon }} />
                      </Grid>
                    ) : (
                      <Grid item className={classes.validateIcon}>
                        <ClearIcon color="error" />
                      </Grid>
                    ))}
                  <Grid
                    item
                    component={Button}
                    children="validar"
                    variant="outlined"
                    color="primary"
                    onClick={() => this.handleValidateDiscount(this.state.booking.discountCode)}
                  />
                </>
              ) : (
                <Grid
                  item
                  component={TextField}
                  name="price"
                  label="Tarifa"
                  type="text"
                  value={this.state.booking.price}
                  onChange={this.handleInputChange}
                />
              )}
            </Grid>

            {this.props.newBooking && this.state.showPrice && (
              <Typography>El precio de esta reserva es de {this.state.price}€</Typography>
            )}

            {!this.props.newBooking && (
              <FormControl component="fieldset">
                <FormLabel style={{ fontSize: '0.8rem' }}>Estado de la reserva</FormLabel>

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
            )}

            {this.props.newBooking && !this.state.price ? (
              <Button
                variant="contained"
                color="primary"
                disabled={this.state.isDiscountLoading}
                onClick={this.calculateBookingPrice}
              >
                Calcular precio
              </Button>
            ) : (
              <Button variant="contained" color="primary" type="submit">
                {this.props.newBooking ? 'Enviar reserva' : 'Modificar reserva'}
              </Button>
            )}
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

  alert: {
    height: theme.spacing(6),
    position: 'fixed',
    transform: 'translateY(10px)',
    width: '100%',
    zIndex: '1000',
  },

  form: {
    width: theme.spacing(50),
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      marginBottom: theme.spacing(3),
    },
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
