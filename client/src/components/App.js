import { Component } from "react"

import Routes from "./routes/Routes"
import Footer from "./layout/Footer/Footer"
import Navigation from "./layout/ButtonAppBar/Navigation"
import AuthService from "../service/auth.service"
import { CssBaseline, ThemeProvider } from "@material-ui/core"
import theme from "./theme"
// import Alert from './shared/Alert/Alert'

class App extends Component {
  constructor() {
    super()
    this.state = {
      loggedUser: undefined,
      bookingSearchInput: ''
      // alert: {
      //   show: false,
      //   title: '',
      //   text: ''
      // }
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
      .catch(() => this.storeUser(undefined))
  }

  componentDidMount() {
    this.fetchUser()
  }

  searchBooking(input) {
    this.setState({ bookingSearchInput: input })
  }

  // handleAlert = (show, title, text) => this.setState({ alert: { show, title, text } })

  render() {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navigation
          storeUser={(user) => this.storeUser(user)}
          loggedUser={this.state.loggedUser}
          searchBooking={input => this.searchBooking(input)}
        /* handleAlert={this.handleAlert} */
        />
        <main style={{ minHeight: "93vh" }}>
          {
            <Routes
              storeUser={(user) => this.storeUser(user)}
              loggedUser={this.state.loggedUser}
              searchedBooking={this.state.bookingSearchInput}
            /* handleAlert={this.handleAlert} */
            />
          }
        </main>
        <Footer />

        {/* <Alert handleAlert={this.handleAlert} show={this.state.alert.show} title={this.state.alert.title} text={this.state.alert.text} /> */}
      </ThemeProvider>
    )
  }
}

export default App
