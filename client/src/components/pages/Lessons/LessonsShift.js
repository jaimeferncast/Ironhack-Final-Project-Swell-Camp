import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, makeStyles, Typography } from "@material-ui/core"
import clsx from "clsx"

const LessonsShift = (props) => {
  const classes = useStyles()
  const shiftIndex = +props.shiftIndex
  return (
    <TableContainer className={classes.tableContainer}>
      <Table stickyHeader style={{ borderCollapse: "collapse", width: "auto" }}>
        <TableHead>
          <TableRow className={classes.headerRow}>
            <TableCell className={clsx(classes.headerCell, classes.cell)}>
              <Typography>{props.shift}</Typography>
            </TableCell>
            {props.header.map((level) => (
              <TableCell className={clsx(classes.headerCell, classes.cell)}>
                <Typography>{level}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell className={clsx(classes.subheaderCell, classes.cell)}>
              <Typography> Nº</Typography>
            </TableCell>
            {props.categories.map((categoryType, idx) => (
              <TableCell key={categoryType} className={clsx(classes.subheaderCell, classes.cell)}>
                {props.iterable[idx][shiftIndex] ? props.iterable[idx][shiftIndex].bookings.length : 0}
              </TableCell>
            ))}
          </TableRow>
          {[...Array(props.maxStudents)].map((elm, studentsIndex) => (
            <TableRow key={studentsIndex}>
              <TableCell className={classes.cell}></TableCell>
              {props.categories.map((surfLevel, surfLevelIndex) => {
                const bookingData = getBooking(props.iterable[surfLevelIndex], shiftIndex, studentsIndex)
                let isSelected = false
                if (bookingData[0]) {
                  if ((bookingData[0] === props.clickedBooking[0]) & (bookingData[2] === props.clickedBooking[1])) {
                    isSelected = true
                  }
                }
                return (
                  <TableCell
                    key={surfLevel}
                    className={clsx(classes.cell, isSelected ? classes.selected : null)}
                    onClick={() => props.onClick(bookingData[0], bookingData[2])}
                  >
                    <Typography>{bookingData[1]}</Typography>
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const getBooking = (lessonsArray, shiftIndex, studentsIndex) => {
  if (!lessonsArray[shiftIndex] || !lessonsArray[shiftIndex].bookings[studentsIndex]) return ""

  return [lessonsArray[shiftIndex].bookings[studentsIndex]._id, lessonsArray[shiftIndex].bookings[studentsIndex].name, lessonsArray[shiftIndex]._id]
}

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    width: theme.spacing(70),
  },
  headerRow: {
    borderLeft: "1px solid #e0e0e0",
    borderBottom: "1px solid #e0e0e0",
    height: theme.spacing(10),
  },
  cell: {
    width: theme.spacing(13),
    backgroundColor: theme.palette.secondary.main + "9A",
  },
  selected: {
    border: `2px solid ${theme.palette.third.main}`,
    backgroundColor: "transparent",
    color: theme.palette.third.main,
  },
  subheaderCell: {
    backgroundColor: theme.palette.primary.light + "9A",
  },
  headerCell: {
    backgroundColor: theme.palette.primary.main,
  },
}))

export default LessonsShift