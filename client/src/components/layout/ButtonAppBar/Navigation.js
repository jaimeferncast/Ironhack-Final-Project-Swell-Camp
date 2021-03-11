import { Component } from "react"
import { Link, withRouter } from "react-router-dom"
import AuthService from "../../../service/auth.service"

import { withStyles, AppBar, Toolbar, Grid, Button, IconButton, InputBase, Typography } from "@material-ui/core"

import BlockIcon from "@material-ui/icons/Block"
import SearchIcon from "@material-ui/icons/Search"
import DeleteIcon from "@material-ui/icons/Delete"

class Navigation extends Component {
  constructor() {
    super()
    this.state = {
      bookingSearchInput: "",
    }
    this.authService = new AuthService()
  }

  logoutUser = () => {
    this.authService
      .logout()
      .then(() => {
        this.props.storeUser(undefined)
      })
      .catch((err) => console.log(err))
  }

  handleInputChange(e) {
    this.setState({ bookingSearchInput: e.target.value }, () =>
      this.props.fetchInputData(this.state.bookingSearchInput)
    )
  }

  clearInput = () => {
    document.querySelector("input").value = ""
    this.setState({ bookingSearchInput: "" }, () => this.props.fetchInputData(this.state.bookingSearchInput))
  }

  render() {
    const { classes } = this.props
    return (
      <AppBar position="fixed" className={classes.root}>
        {this.props.location.pathname !== "/reservar" ?
          <Toolbar>
            {!this.props.loggedUser ? (
              <Grid container alignItems="center" justify="center">
                <Grid item>
                  <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <BlockIcon />
                  </IconButton>
                </Grid>
                <Grid item>Inicia sesión para acceder al sistema</Grid>
              </Grid>
            ) : (
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <Grid container alignItems="center">
                    <Grid item>
                      <Link to="/" className="MuiButtonBase-root MuiButton-root MuiButton-text">
                        Inicio
                    </Link>
                      <Button onClick={this.logoutUser}>Cerrar sesión</Button>
                    </Grid>
                    {this.props.location.pathname === "/" && (
                      <><Grid item>
                        <InputBase
                          style={{ width: "300px", marginLeft: "50px" }}
                          placeholder="Buscar reserva (nombre, DNI o email)"
                          startAdornment={<SearchIcon />}
                          onChange={(e) => this.handleInputChange(e)}
                          value={this.state.bookingSearchInput}
                        />
                      </Grid>
                        {this.state.bookingSearchInput && (
                          <Grid item>
                            <Button style={{ width: "30px" }} onClick={this.clearInput}>
                              <DeleteIcon color="action" />
                            </Button>
                          </Grid>
                        )}
                      </>)}
                  </Grid>
                </Grid>
                <Grid item>
                  <Link to="/calendario" className="MuiButtonBase-root MuiButton-root MuiButton-text">
                    Calendario
                </Link>
                  <Link to="/clases" className="MuiButtonBase-root MuiButton-root MuiButton-text">
                    Clases
                </Link>
                  <Link to="/comidas" className="MuiButtonBase-root MuiButton-root MuiButton-text">
                    Comidas
                </Link>
                </Grid>
              </Grid>
            )}
          </Toolbar>
          :
          <Toolbar style={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="h5" component="h1" style={{ color: "black", fontWeight: "400" }}>
              Formulario de reservas Swell Camp
            </Typography>
          </Toolbar>
        }
      </AppBar>
    )
  }
}

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
})
const firstHOC = withStyles(styles)(Navigation)
export default withRouter(firstHOC)
