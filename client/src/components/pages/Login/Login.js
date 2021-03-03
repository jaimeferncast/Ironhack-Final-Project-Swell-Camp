import {
  Button,
  Card,
  Grid,
  TextField,
  Typography,
  withStyles,
} from "@material-ui/core"
import { Component } from "react"
import backgroundImage from "../../../assets/indexBackground.jpg"
import AuthService from "../../../service/auth.service"

class Login extends Component {
  state = {
    username: "",
    password: "",
  }
  authService = new AuthService()

  handleInputChange = (e) => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    console.log(this.state)
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
      <form onSubmit={this.handleSubmit}>
        <Grid container className={classes.container}>
          <Card className={classes.card}>
            <Typography variant="h4" align="center" component="h1">
              Salinas Surf
            </Typography>
            <TextField
              id="username"
              label="Username"
              type="text"
              name="username"
              value={this.state.username}
              onChange={this.handleInputChange}
            />
            <TextField
              id="password"
              label="Password"
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
          </Card>
        </Grid>
      </form>
    )
  }
}

const styles = (theme) => ({
  container: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    minHeight: "100vh",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(3),
  },
  submitButton: {
    marginTop: theme.spacing(3),
  },
})

export default withStyles(styles)(Login)
