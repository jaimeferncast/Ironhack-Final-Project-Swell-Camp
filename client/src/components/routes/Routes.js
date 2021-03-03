import { makeStyles } from "@material-ui/core";
import { Switch, Route, Redirect } from "react-router-dom";
import IndexPage from "../pages/IndexPage/IndexPage";
import Login from "../pages/Login/Login";

import NewReservation from "./../pages/NewReservation/NewReservation";

const Routes = ({ storeUser, loggedUser /* handleAlert */ }) => {
  const classes = useStyles();
  return (
    <Switch>
      <Route path="/" exact render={() => <IndexPage />} />
      <Route
        path="/login"
        render={(props) => <Login storeUser={storeUser} {...props} />}
      />
      <Route
        path="/reservar"
        render={() => <NewReservation className={classes.newReservation} />}
      />
    </Switch>
  );
};

const useStyles = makeStyles((theme) => ({
  newReservation: {
    marginLeft: theme.spacing(2)
  }
}));
export default Routes;
