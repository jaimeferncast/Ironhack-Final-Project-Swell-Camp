import { Grid, Typography, withStyles, LinearProgress, Fab } from "@material-ui/core"
import { Component } from "react"
import LessonService from "../../../service/lessons.service"
import DeleteItem from "../../shared/DeleteItem"
import LessonsShift from "./LessonsShift"

class LessonsTable extends Component {
  state = {
    lessons: [],
    maxStudents: [],
    disableDelete: true,
    clickedBookingData: [],
  }
  lessonService = new LessonService()
  surfLevels = ["0", "0.5", "1", "1.5", "2"]

  fetchLessons = async (startDate, endDate) => {
    const lessonsByLevel = await Promise.all(this.surfLevels.map((level) => this.lessonService.getLessonsByDateRange(startDate, endDate, level)))
    this.setState({ lessons: lessonsByLevel }, this.getMaxStudents)
  }

  getMaxStudents = () => {
    const maxMorningArray = this.state.lessons.map((levelLessons) => {
      if (!levelLessons.data.length) return 0
      return levelLessons.data[0].bookings.length
    })
    const maxAfternoonArray = this.state.lessons.map((levelLessons) => {
      if (!levelLessons.data.length) return 0
      return levelLessons.data[1].bookings.length
    })
    this.setState({ maxStudents: [Math.max(...maxMorningArray), Math.max(...maxAfternoonArray)] })
  }
  componentDidMount = () => {
    this.fetchLessons(this.props.startDate, this.props.endDate)
  }

  handleClick = (bookingId, lessonId) => {
    this.setState({ disableDelete: false, clickedBookingData: [bookingId, lessonId] })
  }
  handleDelete = () => {
    this.lessonService
      .removeStudentFromLesson(this.state.clickedBookingData[0], this.state.clickedBookingData[1])
      .then(() => this.setState({ disableDelete: true, clickedBookingData: [] }), this.fetchLessons(this.props.startDate, this.props.endDate))
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
          <>
            <Typography variant="h6" component="h1" style={{ margin: "30px 0", textAlign: "center" }}>
              Clases del día {this.props.startDate}
            </Typography>
            <Grid container className={classes.container} style={{ maxWidth: "1250px" }}>
              <LessonsShift
                shift="mañana"
                surfLevels={this.surfLevels}
                lessons={this.state.lessons}
                maxStudents={this.state.maxStudents}
                clickedBooking={this.state.clickedBookingData}
                onClick={this.handleClick}
              ></LessonsShift>
              <LessonsShift
                shift="tarde"
                surfLevels={this.surfLevels}
                lessons={this.state.lessons}
                maxStudents={this.state.maxStudents}
                clickedBooking={this.state.clickedBookingData}
                onClick={this.handleClick}
              ></LessonsShift>
              <DeleteItem disabled={this.state.disableDelete} onClick={this.handleDelete} />
            </Grid>
          </>
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
export default withStyles(styles)(LessonsTable)
