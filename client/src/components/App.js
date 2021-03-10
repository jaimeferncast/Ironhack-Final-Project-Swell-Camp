import { Component } from "react"

import Routes from "./routes/Routes"
import Footer from "./layout/Footer/Footer"
import Navigation from "./layout/ButtonAppBar/Navigation"
import AuthService from "../service/auth.service"
import backgroundImage from "../assets/indexBackground.jpg"

import { CssBaseline, ThemeProvider, withStyles, Grid } from "@material-ui/core"
import theme from "./theme"

class App extends Component {
  constructor() {
    super()

    this.state = {
      loggedUser: null,
      bookingSearchInput: "",
    }
    this.authService = new AuthService()
  }

  storeUser(loggedUser) {
    this.setState({ loggedUser })
  }

  fetchUser() {
    this.authService
      .isLoggedIn()
      .then((response) => this.storeUser(response.data))
      .catch((err) => {
        this.storeUser(err.loggedUser)
      })
  }

  componentDidMount() {
    this.fetchUser()
  }

  fetchInputData(input) {
    this.setState({ bookingSearchInput: input })
  }

  render() {
    const { classes } = this.props
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navigation
          storeUser={(user) => this.storeUser(user)}
          loggedUser={this.state.loggedUser}
          fetchInputData={(input) => this.fetchInputData(input)}
        />
        <main className={classes.background}>
          {this.state.loggedUser !== null && (
            <Grid className={classes.container}>
              <Routes
                classes={this.props.classes}
                storeUser={(user) => this.storeUser(user)}
                loggedUser={this.state.loggedUser}
                bookingSearchInput={this.state.bookingSearchInput}
              ></Routes>
            </Grid>
          )}
        </main>
        <Footer />
      </ThemeProvider>
    )
  }
}

const styles = () => ({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    backgroundSize: "cover",
    paddingTop: "7vh",
    minHeight: "94vh",
    display: "flex",
    justifyContent: "center",
  },
  background: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    minHeight: "94vh",
  },
})

export default withStyles(styles)(App)
