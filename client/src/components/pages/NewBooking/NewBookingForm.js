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
  Radio,
  Checkbox,
  RadioGroup,
  MenuItem,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Divider,
} from '@material-ui/core'

import PhoneIcon from '@material-ui/icons/Phone'
import EmailIcon from '@material-ui/icons/Email'
import CheckIcon from '@material-ui/icons/Check'
import ClearIcon from '@material-ui/icons/Clear'

import CustomAlert from '../../shared/Alert'

import clsx from 'clsx'

import BookingService from '../../../service/bookings.service'
import DiscountService from '../../../service/discounts.service'

const format = require('date-fns/format')
const addDays = require('date-fns/addDays')

class BookingForm extends Component {
  constructor() {
    super()

    this.state = {
      booking: {
        name: '',
        arrival: {
          date: undefined,
        },
        departure: {
          date: undefined,
        },
        dni: '',
        email: '',
        phoneNumber: '',
        surfLevel: '',
        foodMenu: 'Normal',
        accommodation: 'surfcampLongbeach',
        groupCode: '',
        additionalInfo: undefined,
        discountCode: '',
      },
      dateError: false,
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

  handleInputChange = (e) => {
    const { name, value } = e.target
    this.setState({ booking: { ...this.state.booking, [name]: value } })
  }

  handleCheckboxChange = (e) => {
    this.setState({ booking: { ...this.state.booking, [e.target.name]: !e.target.checked } })
  }

  handleDateChange = (e) => {
    const { name, value } = e.target
    const date = new Date(value)
    this.setState({
      booking: {
        ...this.state.booking, [name]:
          { ...this.state.booking[name], date: date.toUTCString() }
      }, dateError: false, alertType: 'success', alertMssg: ''
    })
  }

  handleGroupChange = (e) => {
    this.setState({ group: e.target.value })
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

  handleValidateDiscount = async (discountCode) => {
    this.setState({
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
    if (addDays(new Date(), -1) > new Date(this.state.booking.arrival.date)) {
      this.setState({ alertMssg: 'La fecha de llegada debe mayor o igual a la de hoy', alertType: 'error', })
    }
    else if (new Date(this.state.booking.arrival.date) >= new Date(this.state.booking.departure.date)) {
      this.setState({ alertMssg: 'La fecha de llegada debe menor a la de salida', alertType: 'error', })
    }
    else if (!this.state.booking.arrival.date || !this.state.booking.departure.date) {
      this.setState({ alertMssg: 'Introduce fecha de llegada y salida', alertType: 'error', })
    } else {
      this.bookingService
        .calculatePrice(this.state.booking)
        .then((response) =>
          this.setState({ booking: { ...this.state.booking, price: response.data.message }, price: response.data.message, showPrice: true })
        )
        .catch((error) =>
          this.setState({ alertMssg: error.message, alertType: 'error', })
        )
    }
  }

  handleCreateBooking = (e) => {
    e.preventDefault()

    this.bookingService
      .createBooking(this.state.booking)
      .then((response) => {
        this.setState({ booking: response.data.message, bookingSent: true })
      })
      .catch((error) =>
        this.setState({
          alertMssg: error.response.data.error,
          alertType: 'error',
        })
      )
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

        {!this.state.bookingSent ? (
          <div className={clsx(classes.paper, this.props.className)}>
            <form onSubmit={this.handleCreateBooking} className={classes.form}>
              <Typography variant="subtitle1" style={{ color: '#e92868' }}>Los campos marcados con * son obligatorios</Typography>

              {/* Name */}
              <TextField
                style={{ marginBottom: '10px' }}
                required
                fullWidth
                name="name"
                label="Nombre"
                type="text"
                value={this.state.booking.name}
                onChange={this.handleInputChange}
              />
              <FormControlLabel
                style={{ fontSize: '0.9rem' }}
                control={
                  <Checkbox
                    onChange={this.handleCheckboxChange}
                    color="primary"
                    name="firstTime"
                    size="small"
                  />
                }
                label="Soy antiguo alumno"
              />

              {/* Dates */}
              <Grid style={{ display: 'flex', justifyContent: 'space-between' }}>
                <TextField
                  required
                  name="arrival"
                  label="Fecha de llegada"
                  type="date"
                  format="dd/MM/yyyy"
                  onChange={this.handleDateChange}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  required
                  name="departure"
                  label="Fecha de salida"
                  type="date"
                  format="dd/MM/yyyy"
                  onChange={this.handleDateChange}
                  InputLabelProps={{ shrink: true }}
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
              <FormControl style={{ marginTop: "15px" }}>
                <FormLabel required component="legend">
                  Nivel de surf
                  </FormLabel>
                <RadioGroup value={this.state.booking.surfLevel} name="surfLevel" onChange={this.handleInputChange}>
                  <FormControlLabel
                    value="0"
                    control={<Radio color="primary" />}
                    label={<Typography variant="body2">0 - Nunca he practicado surf, pero tengo muchas ganas</Typography>}
                  />
                  <FormControlLabel
                    value="0.5"
                    control={<Radio color="primary" />}
                    label={<Typography variant="body2">0.5 - Di alguna clase, pero aún soy iniciación</Typography>}
                  />
                  <FormControlLabel
                    value="1"
                    control={<Radio color="primary" />}
                    label={<Typography variant="body2">1 - Me pongo de pie en espumas, saludo al personal y me caigo</Typography>}
                  />
                  <FormControlLabel
                    value="1.5"
                    control={<Radio color="primary" />}
                    label={<Typography variant="body2">1.5 - Empiezo a ir al pico cuando está pequeño</Typography>}
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio color="primary" />}
                    label={<Typography variant="body2">2 - Voy al pico, cojo paredes y corro la ola</Typography>}
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
                helperText="Indica aquí tus intolerancias o el tipo de dieta que sigues"
                onChange={this.handleInputChange}
              />

              {/* Accomodation */}
              <FormControl>
                <FormLabel required component="legend">
                  ¿Vas a alojarte en la escuela?
                    </FormLabel>
                <RadioGroup defaultValue="surfcampLongbeach" name="accommodation" onChange={this.handleInputChange}>
                  <FormControlLabel
                    value="surfcampLongbeach"
                    control={<Radio color="primary" />}
                    label={<Typography variant="body2">Sí</Typography>}
                  />
                  <FormControlLabel
                    value="none"
                    control={<Radio color="primary" />}
                    label={<Typography variant="body2">No</Typography>}
                  />
                </RadioGroup>
              </FormControl>

              {/* Transfer */}
              <FormControl>
                <FormLabel component="legend">¿Necesitas transfer?</FormLabel>
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
                      helperText="El servicio de transfer se paga aparte"
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
                      helperText="El servicio de transfer se paga aparte"
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
                      helperText="El servicio de transfer se paga aparte"
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
              <FormControl>
                <FormLabel required component="legend">
                  ¿Vienes en grupo?
                    </FormLabel>
                <RadioGroup defaultValue="noGroup" onChange={this.handleGroupChange}>
                  <FormControlLabel value="noGroup" control={<Radio color="primary" />} label="No" />
                  <FormControlLabel value="group" control={<Radio color="primary" />} label="Sí" />
                </RadioGroup>
                {this.state.group === 'group' && (
                  <TextField
                    name="groupCode"
                    label="Código de grupo"
                    type="text"
                    helperText="Elige un nombre para tu grupo y compártelo con tus compañeros"
                    value={this.state.booking.groupCode}
                    onChange={this.handleInputChange}
                  />
                )}
              </FormControl>


              {/* Additional Info */}
              <TextField
                multiline
                name="additionalInfo"
                label="Información adicional"
                type="text"
                value={this.state.booking.additionalInfo}
                helperText="Cualquier cosa que nos quieras decir que sea relevante"
                onChange={this.handleInputChange}
              />

              {/* Discount Code */}
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
              </Grid>

              {/* Price */}
              {this.state.showPrice && (
                <Typography>El precio de esta reserva es de {this.state.price}€</Typography>
              )}

              {!this.state.price ? (
                <Button
                  variant="contained"
                  color="primary"
                  disabled={this.state.isDiscountLoading}
                  onClick={this.calculateBookingPrice}
                >
                  Calcular precio
                </Button>
              ) : (
                <Button variant="contained" color="primary" type="submit">Enviar reserva</Button>
              )}
            </form>
          </div>
        ) : (
          <Card className={classes.summaryCard}>
            <CardContent>
              <Typography variant="h5" component="h2" style={{ marginBottom: '25px' }} >
                ¡Reserva realizada! Éste es el resumen de tu reserva:
              </Typography>
              <Typography variant="body1">{this.state.booking.name}</Typography>
              <Divider style={{ margin: '10px 0' }} />
              <Typography variant="body1">
                <EmailIcon style={{ verticalAlign: 'middle' }} /> {this.state.booking.email}
              </Typography>
              <Divider style={{ margin: '10px 0' }} />
              <Typography variant="body1">
                <PhoneIcon style={{ verticalAlign: 'middle' }} /> {this.state.booking.phoneNumber}
              </Typography>
              <Divider style={{ margin: '10px 0' }} />
              <Typography variant="body1">
                Del {format(new Date(this.state.booking.arrival.date), 'dd-MM-yyyy')} al {format(new Date(this.state.booking.departure.date), 'dd-MM-yyyy')}
              </Typography>
              <Divider style={{ margin: '10px 0' }} />
              <Typography variant="body1">Nivel de surf: {this.state.booking.surfLevel}</Typography>
              <Divider style={{ margin: '10px 0' }} />
              <Typography variant="body1">Menú de comidas: {this.state.booking.foodMenu.toLocaleLowerCase()}</Typography>
              <Divider style={{ margin: '10px 0' }} />
              <Typography variant="body1">
                Alojamiento: {this.state.booking.accommodation === 'none' ? 'no' : 'sí'}
              </Typography>
              <Divider style={{ margin: '10px 0' }} />
              <Typography variant="body1">Precio: {this.state.booking.price}€</Typography>
              <Divider style={{ margin: '10px 0' }} />
              <Typography variant="body1">Código de grupo: {this.state.booking.groupCode || 'voy sól@'}</Typography>
              <Divider style={{ margin: '10px 0' }} />
              <Typography variant="body1">
                Transfer: {
                  !this.state.transfer
                    ? 'no requiere'
                    : this.state.transfer === 'transfer'
                      ? `sí, desde ${this.state.booking.arrival.transfer}*`
                      : this.state.transfer === 'arrivalTransferOnly'
                        ? `sólo al llegar, desde ${this.state.booking.arrival.transfer}*`
                        : `sólo al salir, hasta ${this.state.booking.departure.transfer}*`
                }
              </Typography>
              {this.state.transfer && <Typography variant="body1" style={{ fontSize: '0.8rem', fontWeight: '200' }}>*Recuerda que el transfer no está incluído en el precio</Typography>}
              <Divider style={{ margin: '10px 0' }} />
              <Typography variant="body1">
                Información adicional: {this.state.booking.additionalInfo || '-'}
              </Typography>
              <Divider style={{ margin: '10px 0' }} />
              <Typography variant="body1">Éste es el código de tu reserva: {this.state.booking.bookingCode}</Typography>
            </CardContent>
          </Card>
        )}
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
    height: '80vh',
    overflowY: 'scroll',
    width: theme.spacing(60),
    position: 'absolute',
    top: theme.spacing(12),
    backgroundColor: theme.palette.secondary.light,
    border: '2px solid #e92868',
    borderRadius: '10px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(5, 7, 3),
  },
})

export default withStyles(styles)(BookingForm)
