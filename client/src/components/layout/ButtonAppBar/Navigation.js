import { Component } from "react"
import { Link } from "react-router-dom"
import AuthService from "../../../service/auth.service"

import {
  withStyles,
  AppBar,
  Toolbar,
  Grid,
  Button,
  IconButton,
  InputBase
} from "@material-ui/core"

import BlockIcon from "@material-ui/icons/Block"
import SearchIcon from '@material-ui/icons/Search';

class Navigation extends Component {

  constructor() {
    super()
    this.state = {
      bookingSearchInput: ''
      // alert: {
      //   show: false,
      //   title: '',
      //   text: ''
      // }
    }
    this.authService = new AuthService()
  }

  logoutUser = () => {
    this.authService
      .logout()
      .then(() => {
        this.props.storeUser(null)
        // handleAlert(true, undefined, 'Has cerrado sesión')
      })
      .catch((err) => console.log(err))
  }

  handleInputChange(e) {
    this.setState({ bookingSearchInput: e.target.value }, () => this.props.searchBooking(this.state.bookingSearchInput))
  }

  render() {
    const { classes } = this.props
    return (
      <AppBar position="fixed" className={classes.root}>
        <Toolbar>
          {!this.props.loggedUser &&
            <Grid container alignItems="center" justify="center">
              <Grid item>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                  <BlockIcon />
                </IconButton>
              </Grid>
              <Grid item>
                Inicia sesión para acceder al sistema
            </Grid>
            </Grid>
          }
          {this.props.loggedUser &&
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <Grid container alignItems="center">
                  <Grid item>
                    <Link to="/" className="MuiButtonBase-root MuiButton-root MuiButton-text">Inicio</Link>
                    <Button onClick={this.logoutUser}>Cerrar sesión</Button>
                  </Grid>
                  <Grid item>
                    <InputBase style={{ width: '300px', marginLeft: '50px' }} placeholder="Buscar reserva (nombre, DNI o email)" startAdornment={<SearchIcon />} onChange={e => this.handleInputChange(e)} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Link to="/calendario" className="MuiButtonBase-root MuiButton-root MuiButton-text">Calendario</Link>
                <Link to="/semana" className="MuiButtonBase-root MuiButton-root MuiButton-text">Vista semanal</Link>
                <Link to="/clases" className="MuiButtonBase-root MuiButton-root MuiButton-text">Clases</Link>
                <Link to="/comidas" className="MuiButtonBase-root MuiButton-root MuiButton-text">Comidas</Link>
              </Grid>
            </Grid>
          }
        </Toolbar>
      </AppBar>
    )
  }
}

const styles = (theme) => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
})

export default withStyles(styles)(Navigation)