import { Grid, Typography, withStyles, LinearProgress, Container, TextField } from "@material-ui/core"
import { Component } from "react"
import MealService from "../../../service/meals.service"
import DeleteItem from "../../shared/DeleteItem"
import AddItem from "../../shared/AddItem"
import Alert from "@material-ui/lab/Alert"
import MealsShift from "./MealsShift"
import AddMealModal from "./AddMealModal"
const { format, addDays } = require("date-fns")

class Meals extends Component {
  state = {
    meals: {
      lunch: [],
      dinner: [],
    },
    disableDelete: true,
    disableAdd: true,
    clickedMeals: undefined,
    alertMssg: "",
    alertType: "success",
    addMeal: false,
    addType: "",
    startDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    endDate: format(addDays(new Date(), 2), "yyyy-MM-dd"),
  }
  mealService = new MealService()

  fetchMeals = (startDate, endDate) => {
    let fetchResponse
    this.mealService
      .getMealsByDateRange(startDate, endDate)
      .then((response) => {
        fetchResponse = response
        const emptyLunches = response.data.lunch.filter((elm) => !elm.quantity)
        Promise.all(emptyLunches.map((meal) => this.mealService.removeMealType(meal._id)))
      })
      .then(() => {
        const emptyDinners = fetchResponse.data.dinner.filter((elm) => !elm.quantity)
        Promise.all(emptyDinners.map((meal) => this.mealService.removeMealType(meal._id)))
      })
      .then(() => this.mealService.getMealsByDateRange(this.state.startDate, this.state.endDate))
      .then((response) => this.setState({ meals: response.data }))
      .catch((err) => console.error(err))
  }

  componentDidMount = () => {
    this.fetchMeals(this.state.startDate, this.state.endDate)
  }

  handleClick = (mealId) => {
    const backupMeals = { ...this.state.meals }

    this.setState({
      meals: backupMeals,
      disableDelete: false,
      disableAdd: false,
      clickedMeals: mealId,
    })
  }
  handleAdd = () => {
    this.mealService
      .addOneMeal(this.state.clickedMeals, 1)
      .then((response) => {
        this.setState(
          {
            clickedMeals: undefined,
            disableAdd: true,
            disableDelete: true,
            alertMssg: response.data.message,
            alertType: response.status === 200 ? "success" : "error",
          },
          () => this.fetchMeals(this.state.startDate, this.state.endDate)
        )
      })
      .catch((err) => console.error(err))
  }
  handleDelete = () => {
    this.mealService
      .removeOneMeal(this.state.clickedMeals, 1)
      .then((response) =>
        this.setState(
          {
            clickedMeals: undefined,
            disableAdd: true,
            disableDelete: true,
            alertMssg: response.data.message,
            alertType: response.status === 200 ? "success" : "error",
          },
          () => this.fetchMeals(this.state.startDate, this.state.endDate)
        )
      )
      .catch((err) => console.error(err))
  }

  handleAddMealType = (mealType) => {
    console.log(mealType)
    const backupMeals = { ...this.state.meals }
    this.setState({
      meals: backupMeals,
      addMeal: true,
      addType: mealType,
    })
  }

  handleCancelDialog = () => {
    const backupMeals = { ...this.state.meals }
    this.setState({
      meals: backupMeals,
      addMeal: false,
    })
  }

  handleSubmitDialog = () => {
    this.setState(
      {
        addMeal: false,
        addType: "",
      },
      () => this.fetchMeals(this.state.startDate, this.state.endDate)
    )
  }
  handleDatePicker = (e) => {
    const newStartDate = format(new Date(e.target.value), "yyyy-MM-dd")
    const newEndDate = format(addDays(new Date(newStartDate), 1), "yyyy-MM-dd")
    this.setState({ startDate: newStartDate, endDate: newEndDate }, () =>
      this.fetchMeals(this.state.startDate, this.state.endDate)
    )
  }
  render() {
    const { classes } = this.props
    return (
      <>
        {!(this.state.meals.lunch.length || this.state.meals.dinner.length) ? (
          <Typography style={{ margin: "30px 0" }} variant="h5" component="h1">
            <LinearProgress />
          </Typography>
        ) : (
          <Container>
            {this.state.alertMssg && (
              <Alert
                severity={this.state.alertType}
                className={classes.alert}
                onClose={() => {
                  const backupMeals = { ...this.state.meals }
                  this.setState({ meals: backupMeals, alertMssg: "", alertType: "success" })
                }}
              >
                {this.state.alertMssg}
              </Alert>
            )}
            <div className={classes.titleContainer}>
              <Typography variant="h5" component="h1" style={{ textAlign: "center", margin: "40px 15px 28px" }}>
                Comidas del día
              </Typography>

              <form onChange={this.handleDatePicker}>
                <TextField id="date" label="Selecciona otra fecha" type="date" value={this.state.startDate} />
              </form>
            </div>
            <Grid item>
              <AddMealModal
                open={this.state.addMeal}
                addType={this.state.addType}
                date={this.state.startDate}
                cancelOnClick={this.handleCancelDialog}
                submitOnClick={this.handleSubmitDialog}
              />
            </Grid>

            <Grid container justify="space-around" style={{ height: "430px", overflow: "scroll" }}>
              <Grid item>
                <Grid container className={classes.container} style={{ maxWidth: "1250px" }}>
                  <Grid item className={classes.mealShift}>
                    <MealsShift
                      shift="Comida"
                      iterable={this.state.meals.lunch}
                      clickedMeals={this.state.clickedMeals}
                      onClick={this.handleClick}
                    ></MealsShift>
                  </Grid>
                  <Grid item>
                    <AddItem size="small" onClick={() => this.handleAddMealType("lunch")} />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <Grid container className={classes.container} style={{ maxWidth: "1250px" }}>
                  <Grid item className={classes.mealShift}>
                    <MealsShift
                      shift="Cena"
                      iterable={this.state.meals.dinner}
                      clickedMeals={this.state.clickedMeals}
                      onClick={this.handleClick}
                    ></MealsShift>
                  </Grid>
                  <Grid item>
                    <AddItem size="small" onClick={() => this.handleAddMealType("dinner")} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item className={classes.editContainer}>
              <AddItem size="large" disabled={this.state.disableAdd} onClick={this.handleAdd} />
              <DeleteItem disabled={this.state.disableDelete} onClick={this.handleDelete} />
            </Grid>
          </Container>
        )}
      </>
    )
  }
}
const styles = (theme) => ({
  alert: {
    height: theme.spacing(6),
    position: "fixed",
    transform: "translate(25px, 610px)",
    width: "400px",
    opacity: "0.7",
  },
  content: theme.content,
  container: {
    maxHeight: theme.spacing(60),
    maxWidth: theme.spacing(170),
    flexDirection: "column-reverse",
    alignItems: "center",
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mealsShiftsContainer: {
    height: theme.spacing(60),
    overflowY: "scroll",
  },
  mealShift: {
    // width: "80%",
  },
  gridItem: {
    flexWrap: "nowrap",
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
