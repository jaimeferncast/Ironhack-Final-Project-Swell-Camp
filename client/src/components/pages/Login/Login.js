import { Component } from "react"

import {
  Button,
  Card,
  Grid,
  TextField,
  Typography,
  withStyles,
} from "@material-ui/core"
import backgroundImage from "../../../assets/indexBackground.jpg"
import AuthService from "../../../service/auth.service"

class Login extends Component {

  constructor() {
    super()
    this.state = {
      username: '',
      password: ''
    }
    this.authService = new AuthService()
  }

  handleInputChange = (e) => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleSubmit = (e) => {
    e.preventDefault()

    this.authService
      .login(this.state)
      .then((response) => {
        this.props.storeUser(response.data)
        this.props.history.push("/")
      })
      .catch((err) => console.error(err))
  }

  render() {
    const { classes } = this.props
    return (
      <Grid container className={classes.container}>
        <Card className={classes.card}>
          <form onSubmit={this.handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h5" align="center" component="h1" gutterBottom>
              Swell Camp App
            </Typography>
            <TextField
              id="username"
              label="Nombre de usuario"
              type="text"
              name="username"
              value={this.state.username}
              onChange={this.handleInputChange}
            />
            <TextField
              id="password"
              label="Contraseña"
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleInputChange}
            />
            <Button
              variant="contained"
              color="primary"
              className={classes.submitButton}
              type="submit"
            >
              Entrar
            </Button>
          </form>
        </Card>
      </Grid>
    )
  }
}

const styles = (theme) => ({
  container: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: theme.palette.secondary.main + "70",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(4, 5),
  },
  submitButton: {
    marginTop: theme.spacing(5),
  },
})

export default withStyles(styles)(Login)
