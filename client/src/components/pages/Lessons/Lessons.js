import { Grid } from "@material-ui/core"
import { useTheme } from "@material-ui/core/styles"
import LessonsTable from "./LessonsTable"
const { format, addDays } = require("date-fns")

const Lessons = (props) => {
  const theme = useTheme()
  const startDate = format(addDays(new Date(), 2), "yyyy-MM-dd")
  const endDate = format(addDays(new Date(), 3), "yyyy-MM-dd")
  return (
    <Grid container style={theme.content}>
      <LessonsTable startDate={startDate} endDate={endDate}></LessonsTable>
    </Grid>
  )
}

export default Lessons
