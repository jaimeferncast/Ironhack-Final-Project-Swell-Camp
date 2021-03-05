import { Switch, Route, Redirect } from "react-router-dom"

import { makeStyles } from "@material-ui/core"

import IndexPage from "../pages/IndexPage/IndexPage"
import Login from "../pages/Login/Login"
import OccupanciesCalendar from "../pages/Occupancies/OccupanciesCalendar"
import NewReservation from "./../pages/NewReservation/NewReservation"
import Calendar from "./../pages/Calendar/Calendar"
import WeekPlan from "../pages/WeekPlan/WeekPlan"
import Lessons from "../pages/Lessons/Lessons"
import Meals from "../pages/Meals/Meals"


const Routes = ({ storeUser, loggedUser, searchedBooking /* handleAlert */ }) => {
  const classes = useStyles()

  return (
    <Switch>
      <Route
        path="/login"
        render={props => <Login storeUser={storeUser} {...props} />}
      />
      <Route
        path="/"
        exact
        render={() =>
          loggedUser
            ? <IndexPage searchedBooking={searchedBooking} />
            : <Redirect to="/login" />
        }
      />
      <Route
        path="/validar-reserva/:id"
        render={props =>
          loggedUser
            ? <OccupanciesCalendar {...props} />
            : <Redirect to="/login" />
        }
      />
      <Route
        path="/calendario"
        render={props =>
          loggedUser
            ? <Calendar storeUser={storeUser} {...props} />
            : <Redirect to="/login" />
        }
      />
      <Route
        path="/semana"
        render={props =>
          loggedUser
            ? <WeekPlan storeUser={storeUser} {...props} />
            : <Redirect to="/login" />
        }
      />
      <Route
        path="/clases"
        render={props =>
          loggedUser
            ? <Lessons storeUser={storeUser} {...props} />
            : <Redirect to="/login" />
        }
      />
      <Route
        path="/comidas"
        render={props =>
          loggedUser
            ? <Meals storeUser={storeUser} {...props} />
            : <Redirect to="/login" />
        }
      />
      <Route
        path="/reservar"
        render={() =>
          loggedUser
            ? <NewReservation className={classes.newReservation} />
            : <Redirect to="/login" />
        }
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