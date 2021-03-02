import {
  Card,
  Grid,
  TextField,
  Typography,
  withStyles
} from "@material-ui/core";
import { Component } from "react";
import backgroundImage from "../../../assets/indexBackground.jpg";

class IndexPage extends Component {
  render() {
    const { classes } = this.props;
    return (
      <form>
        <Grid container className={classes.container}>
          <Card className={classes.card}>
            <Typography variant="h4" align="center" component="h1">
              Salinas Surf
            </Typography>
            <TextField id="username" label="Username" />
            <TextField id="password" label="Password" type="password" />
          </Card>
        </Grid>
      </form>
    );
  }
}

const styles = (theme) => ({
  container: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    minHeight: "100vh",
    alignItems: "center",
    justifyContent: "center"
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(3)
  }
});

export default withStyles(styles)(IndexPage);
