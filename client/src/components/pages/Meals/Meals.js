import { Grid, Typography, withStyles, LinearProgress, Container } from "@material-ui/core"
import { Component } from "react"
import MealService from "../../../service/meals.service"
import DeleteItem from "../../shared/DeleteItem"
import AddItem from "../../shared/AddItem"
import Alert from "@material-ui/lab/Alert"
import MealsShift from "./MealsShift"
const { format, addDays } = require("date-fns")

class Meals extends Component {
  state = {
    meals: [],
    mealTypes: [[], []],
    disableDelete: true,
    disableAdd: true,
    clickedMeals: undefined,
    alertMssg: "",
    alertType: "success",
  }
  startDate = format(addDays(new Date(), 1), "yyyy-MM-dd")
  endDate = format(addDays(new Date(), 2), "yyyy-MM-dd")
  mealService = new MealService()

  fetchMeals = (startDate, endDate) => {
    this.mealService
      .getMealsByDateRange(startDate, endDate)
      .then((response) => {
        this.setState({ meals: response.data }, () => this.getMealTypes())
      })
      .catch((err) => console.error(err))
  }

  getMealTypes = () => {
    let lunchTypes = []
    let dinnerTypes = []
    if (this.state.meals[0]?.length) {
      lunchTypes = this.state.meals[0].map((meal) => meal.mealType)
    }
    if (this.state.meals[1]?.length) {
      dinnerTypes = this.state.meals[1].map((meal) => meal.mealType)
    }
    this.setState({ mealTypes: [lunchTypes, dinnerTypes] })
  }

  componentDidMount = () => {
    this.fetchMeals(this.startDate, this.endDate)
  }

  handleClick = (mealId) => {
    this.setState({ disableDelete: false, disableAdd: false, clickedMeals: mealId })
  }
  handleAdd = () => {
    this.mealService
      .addOneMeal(this.state.clickedMeals, 1)
      .then((response) => {
        this.setState(
          { clickedMeals: undefined, disableAdd: true, disableDelete: true, alertMssg: response.data.message, alertType: response.status === 200 ? "success" : "error" },
          () => this.fetchMeals(this.startDate, this.endDate)
        )
      })
      .catch((err) => console.error(err))
  }
  handleDelete = () => {
    this.mealService
      .removeOneMeal(this.state.clickedMeals, 1)
      .then((response) =>
        this.setState(
          { clickedMeals: undefined, disableAdd: true, disableDelete: true, alertMssg: response.data.message, alertType: response.status === 200 ? "success" : "error" },
          () => this.fetchMeals(this.startDate, this.endDate)
        )
      )
      .catch((err) => console.error(err))
  }
  render() {
    const { classes } = this.props
    return (
      <>
        {!this.state.meals.length ? (
          <Typography style={{ margin: "30px 0" }} variant="h5" component="h1">
            <LinearProgress />
          </Typography>
        ) : (
          <Grid container className={classes.outerContainer}>
            {this.state.alertMssg && (
              <Alert
                severity={this.state.alertType}
                onClose={() => {
                  this.setState({ alertMssg: "", alertType: "success" })
                }}
              >
                {this.state.alertMssg}
              </Alert>
            )}
            <Grid item>
              <Typography variant="h6" component="h1" style={{ margin: "30px 0", textAlign: "center" }}>
                Comidas del día {this.startDate}
              </Typography>
            </Grid>
            <Grid item>
              <Grid container className={classes.container} style={{ maxWidth: "1250px" }}>
                <Grid item>
                  <MealsShift
                    shift="Comida"
                    header={this.state.mealTypes[0]}
                    categories={this.state.mealTypes[0]}
                    iterable={this.state.meals[0]}
                    clickedMeals={this.state.clickedMeals}
                    onClick={this.handleClick}
                  ></MealsShift>
                </Grid>
                <Grid item>
                  <AddItem />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container className={classes.container} style={{ maxWidth: "1250px" }}>
                <Grid item>
                  <MealsShift
                    shift="Cena"
                    header={this.state.mealTypes[1]}
                    categories={this.state.mealTypes[1]}
                    iterable={this.state.meals[1]}
                    clickedMeals={this.state.clickedMeals}
                    onClick={this.handleClick}
                  ></MealsShift>
                </Grid>
                <Grid item>
                  <AddItem />
                </Grid>
              </Grid>
            </Grid>
            <Grid item className={classes.editContainer}>
              <AddItem disabled={this.state.disableAdd} onClick={this.handleAdd} />
              <DeleteItem disabled={this.state.disableDelete} onClick={this.handleDelete} />
            </Grid>
          </Grid>
        )}
      </>
    )
  }
}
const styles = (theme) => ({
  content: theme.content,
  outerContainer: {
    flexDirection: "column",
  },
  container: {
    maxHeight: theme.spacing(60),
    maxWidth: theme.spacing(170),
    justifyContent: "center",
  },
  gridItem: {
    flexWrap: "nowrap",
  },
  tableContainer: {
    width: "auto",
  },

  header: {
    backgroundColor: theme.palette.primary.main,
    zIndex: "1000",
  },
  firstCol: {
    position: "sticky",
    left: "0",
    zIndex: "999",
    width: theme.spacing(12),
    padding: "0 0 0 7px",
    backgroundColor: theme.palette.primary.light,
    border: "1px solid #e0e0e0",
    borderCollapse: "collapse",
  },
  editContainer: {
    display: "flex",
    justifyContent: "center",
  },
  button: {
    height: theme.spacing(3),
    minWidth: theme.spacing(12),
  },
  submitButton: {
    marginTop: theme.spacing(5),
  },
})

export default withStyles(styles)(Meals)
