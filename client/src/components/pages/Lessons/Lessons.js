import { Grid, Typography, withStyles, LinearProgress, Container } from "@material-ui/core"
import { Component } from "react"
import LessonService from "../../../service/lessons.service"
import DeleteItem from "../../shared/DeleteItem"
import LessonsShift from "./LessonsShift"
import Alert from "@material-ui/lab/Alert"

const { format, addDays } = require("date-fns")

class Lessons extends Component {
  state = {
    lessons: [],
    maxStudents: [],
    disableDelete: true,
    clickedBookingData: [],
    alertMssg: "",
    alertType: "success",
  }
  startDate = format(addDays(new Date(), 1), "yyyy-MM-dd")
  endDate = format(addDays(new Date(), 2), "yyyy-MM-dd")

  lessonService = new LessonService()
  surfLevels = ["0", "0.5", "1", "1.5", "2"]

  fetchLessons = async (startDate, endDate) => {
    const lessonsByLevel = await Promise.all(
      this.surfLevels.map((level) => this.lessonService.getLessonsByDateRange(startDate, endDate, level))
    )
    this.setState({ lessons: lessonsByLevel.map((elm) => elm.data) }, this.getMaxStudents)
  }

  getMaxStudents = () => {
    const maxMorningArray = this.state.lessons.map((levelLessons) => {
      if (!levelLessons.length || !levelLessons[0]) return 0
      return levelLessons[0].bookings.length
    })
    const maxAfternoonArray = this.state.lessons.map((levelLessons) => {
      if (!levelLessons.length || !levelLessons[1]) return 0
      return levelLessons[1].bookings.length
    })
    this.setState({
      maxStudents: [Math.max(...maxMorningArray), Math.max(...maxAfternoonArray)],
    })
  }

  componentDidMount = () => {
    this.fetchLessons(this.startDate, this.endDate)
  }

  handleClick = (bookingId, lessonId) => {
    this.setState({
      disableDelete: false,
      clickedBookingData: [bookingId, lessonId],
    })
  }
  handleDelete = () => {
    this.lessonService
      .removeStudentFromLesson(this.state.clickedBookingData[0], this.state.clickedBookingData[1])
      .then((response) =>
        this.setState(
          {
            disableDelete: true,
            clickedBookingData: [],
            alertMssg: response.data.message,
            alertType: response.status === 200 ? "success" : "error",
          },
          () => this.fetchLessons(this.startDate, this.endDate)
        )
      )
      .catch((err) => {
        throw new Error(err)
      })
  }

  render() {
    const { classes } = this.props
    return (
      <>
        {!this.state.lessons.length ? (
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
                  this.setState({ alertMssg: "", alertType: "success" })
                }}
              >
                {this.state.alertMssg}
              </Alert>
            )}
            <Typography variant="h6" component="h1" style={{ textAlign: "center", marginTop: "64px" }}>
              Clases del día {this.startDate}
            </Typography>
            <Grid container className={classes.container} style={{ maxWidth: "1250px" }}>
              <Grid item>
                <Grid container className={classes.lessonsContainer}>
                  <Grid item>
                    <LessonsShift
                      shift="Horario de mañana"
                      shiftIndex="0"
                      header={["Nivel 0", "Nivel 0.5", "Nivel 1", "Nivel 1.5", "Nivel 2"]}
                      categories={this.surfLevels}
                      iterable={this.state.lessons}
                      maxStudents={this.state.maxStudents[0]}
                      getNFunction={(iterable, shiftIndex, idx) => this.getNumberOfStudents(iterable, shiftIndex, idx)}
                      clickedBooking={this.state.clickedBookingData}
                      onClick={this.handleClick}
                    ></LessonsShift>
                  </Grid>
                  <Grid item>
                    <LessonsShift
                      shift="Horario de tarde"
                      shiftIndex="1"
                      header={["Nivel 0", "Nivel 0.5", "Nivel 1", "Nivel 1.5", "Nivel 2"]}
                      categories={this.surfLevels}
                      iterable={this.state.lessons}
                      maxStudents={this.state.maxStudents[1]}
                      clickedBooking={this.state.clickedBookingData}
                      onClick={this.handleClick}
                    ></LessonsShift>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <DeleteItem disabled={this.state.disableDelete} onClick={this.handleDelete} />
              </Grid>
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
    transform: "translateY(10px)",
    width: "100%",
  },
  content: theme.content,
  container: {
    maxWidth: theme.spacing(170),
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
  },
  lessonsContainer: {
    maxHeight: theme.spacing(60),
    overflowY: "scroll",
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

export default withStyles(styles)(Lessons)
