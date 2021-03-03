import { makeStyles } from "@material-ui/core"
import { Switch, Route, Redirect } from "react-router-dom"
import IndexPage from "../pages/IndexPage/IndexPage"
import Login from "../pages/Login/Login"
import OccupationsCalendar from "../pages/Occupations/OccupationsCalendar"

import NewReservation from "./../pages/NewReservation/NewReservation"

const Routes = ({ storeUser, loggedUser /* handleAlert */ }) => {
  const classes = useStyles()
  console.log("logged user", loggedUser)
  return (
    <Switch>
      <Route
        path="/"
        exact
        render={() =>
          loggedUser ? <IndexPage /> : <Redirect to="/login"></Redirect>
        }
      />
      <Route
        path="/login"
        render={(props) => <Login storeUser={storeUser} {...props} />}
      />
      <Route
        path="/validar-reserva/:id"
        render={(props) =>
          loggedUser ? (
            <OccupationsCalendar {...props} />
          ) : (
            <Redirect to="/login"></Redirect>
          )
        }
      ></Route>
      <Route
        path="/reservar"
        render={() => <NewReservation className={classes.newReservation} />}
      />
    </Switch>
  )
}

const useStyles = makeStyles((theme) => ({
  newReservation: {
    marginLeft: theme.spacing(2),
  },
}))
export default Routes
