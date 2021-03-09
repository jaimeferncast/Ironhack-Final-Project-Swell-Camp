import { Grid, Typography, withStyles, LinearProgress, Container } from "@material-ui/core"
import { Component } from "react"
import MealService from "../../../service/meals.service"
import DeleteItem from "../../shared/DeleteItem"
import LessonsShift from "../Lessons/LessonsShift"
import MealsShift from "./MealsShift"
const { format, addDays, addHours } = require("date-fns")

class Meals extends Component {
  state = {
    meals: [],
    maxMeals: [],
    mealTypes: [[], []],
    disableDelete: true,
    clickedMeals: undefined,
  }
  startDate = format(addDays(new Date(), 1), "yyyy-MM-dd")
  endDate = format(addDays(new Date(), 2), "yyyy-MM-dd")
  mealService = new MealService()

  fetchMeals = (startDate, endDate) => {
    this.mealService
      .getMealsByDateRange(startDate, endDate)
      .then((response) => this.setState({ meals: response.data }, this.getMaxMeals))
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

  getMaxMeals = () => {
    let maxLunches = 0
    let maxDinners = 0
    if (this.state.meals[0].length) {
      maxLunches = Math.max(...this.state.meals[0].map((mealType) => mealType.quantity))
    }
    if (this.state.meals[1].length) {
      maxDinners = Math.max(...this.state.meals[1].map((mealType) => mealType.quantity))
    }
    this.setState({ maxMeals: [maxLunches, maxDinners] }, this.getMealTypes)
  }
  componentDidMount = () => {
    this.fetchMeals(this.startDate, this.endDate)
  }

  handleClick = (mealId) => {
    this.setState({ disableDelete: false, clickedMeals: mealId })
  }
  // handleDelete = () => {
  //   this.lessonService
  //     .removeStudentFromLesson(this.state.clickedBookingData[0], this.state.clickedBookingData[1])
  //     .then(() => this.setState({ disableDelete: true, clickedBookingData: [] }), this.fetchLessons(this.props.startDate, this.props.endDate))
  //     .catch((err) => {
  //       throw new Error(err)
  //     })
  // }
  render() {
    const { classes } = this.props
    return (
      <>
        {!this.state.meals.length ? (
          <Typography style={{ margin: "30px 0" }} variant="h5" component="h1">
            <LinearProgress />
          </Typography>
        ) : (
          <Container>
            <Typography variant="h6" component="h1" style={{ margin: "30px 0", textAlign: "center" }}>
              Comidas del día {this.startDate}
            </Typography>
            <Grid container className={classes.container} style={{ maxWidth: "1250px" }}>
              <MealsShift
                shift="Comida"
                header={this.state.mealTypes[0]}
                categories={this.state.mealTypes[0]}
                iterable={this.state.meals[0]}
                maxMeals={this.state.maxMeals[0]}
                clickedMeals={this.state.clickedMeals}
                onClick={this.handleClick}
              ></MealsShift>
              <MealsShift
                shift="Cena"
                header={this.state.mealTypes[1]}
                categories={this.state.mealTypes[1]}
                iterable={this.state.meals[1]}
                maxMeals={this.state.maxMeals[1]}
                clickedMeals={this.state.clickedMeals}
                onClick={this.handleClick}
              ></MealsShift>

              <DeleteItem disabled={this.state.disableDelete} onClick={this.handleDelete} />
            </Grid>
          </Container>
        )}
      </>
    )
  }
}
const styles = (theme) => ({
  content: theme.content,
  container: {
    maxHeight: theme.spacing(60),
    maxWidth: theme.spacing(170),
    flexDirection: "row",
    justifyContent: "space-around",
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
  button: {
    height: theme.spacing(3),
    minWidth: theme.spacing(12),
  },
  submitButton: {
    marginTop: theme.spacing(5),
  },
})

export default withStyles(styles)(Meals)
