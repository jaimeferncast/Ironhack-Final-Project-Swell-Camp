import { NavLink, Link } from "react-router-dom";

import AuthService from "../../../service/auth.service";

import {
  makeStyles,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

const ButtonAppBar = ({ storeUser, loggedUser /* handleAlert */ }) => {
  const authService = new AuthService();
  const classes = useStyles();

  // const logoutUser = () => {

  //     authService
  //         .logout()
  //         .then(() => {
  //             storeUser(undefined)
  //             handleAlert(true, undefined, 'Has cerrado sesión')
  //         })
  //         .catch(err => console.log(err))
  // }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            News
          </Typography>
          <NavLink to="/reservar">
            <Button color="inherit">Login</Button>
          </NavLink>
        </Toolbar>
      </AppBar>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

export default ButtonAppBar;
