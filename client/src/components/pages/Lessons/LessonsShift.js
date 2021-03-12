import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  makeStyles,
  Typography,
} from "@material-ui/core"
import clsx from "clsx"

const LessonsShift = (props) => {
  const classes = useStyles()
  return (
    <>
      <TableContainer className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow className={classes.headerRow}>
              <TableCell className={classes.headerCell} align="left" style={{ width: "70px" }}>
                <Typography align="left" style={{ fontWeight: "100", fontSize: "0.8rem" }}>
                  {props.shift}
                </Typography>
              </TableCell>
              {props.header.map((level) => (
                <TableCell key={level} className={classes.headerCell} style={{ width: "106px" }}>
                  {level}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell className={classes.subheaderCell} style={{ width: "70px" }}>
                <Typography align="left" style={{ fontWeight: "100", fontSize: "0.8rem" }}>
                  Alumnos
                </Typography>
              </TableCell>
              {props.categories.map((categoryType, idx) => (
                <TableCell key={categoryType} className={classes.subheaderCell} style={{ width: "106px" }}>
                  {props.iterable[idx][props.shiftCode] ? props.iterable[idx][props.shiftCode].bookings.length : 0}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer className={classes.tableContainer} style={{ height: "305px", overflowY: "scroll" }}>
        <Table>
          <TableBody>
            {[...Array(props.maxStudents)].map((elm, studentsIndex) => (
              <TableRow key={studentsIndex}>
                <TableCell style={{ backgroundColor: "#90caf99A", borderBottom: "0", width: "70px" }}></TableCell>
                {props.categories.map((surfLevel, surfLevelIndex) => {
                  const bookingData = getBooking(props.iterable[surfLevelIndex], props.shiftCode, studentsIndex)
                  let isSelected = false
                  if (bookingData[0]) {
                    if ((bookingData[0] === props.clickedBooking[0]) & (bookingData[2] === props.clickedBooking[1])) {
                      isSelected = true
                    }
                  }
                  return (
                    <TableCell
                      style={{ width: "106px" }}
                      key={surfLevel}
                      className={clsx(classes.cell, isSelected ? classes.selected : null)}
                      onClick={() => props.onClick(bookingData[0], bookingData[2])}
                    >
                      <Typography noWrap className={classes.studenName}>
                        {bookingData[1]}
                      </Typography>
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

const getBooking = (lessonsObject, shiftCode, studentsIndex) => {
  if (!lessonsObject[shiftCode] || !lessonsObject[shiftCode].bookings[studentsIndex]) return ""

  return [
    lessonsObject[shiftCode].bookings[studentsIndex]._id,
    lessonsObject[shiftCode].bookings[studentsIndex].name,
    lessonsObject[shiftCode]._id,
  ]
}

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    // width: theme.spacing(74),
  },
  headerRow: {
    height: theme.spacing(3),
  },
  cell: {
    padding: "0 5px",
    maxWidth: theme.spacing(13),
    minWidth: theme.spacing(13),
    borderBottom: "0",
    backgroundColor: theme.palette.secondary.main + "9A",
  },
  selected: {
    border: `2px solid ${theme.palette.third.main}`,
    backgroundColor: "transparent",
    color: theme.palette.third.main,
  },
  headerCell: {
    textAlign: "center",
    fontWeight: "100",
    padding: "5px 10px",
    borderBottom: "0",
    backgroundColor: theme.palette.primary.main,
  },
  subheaderCell: {
    textAlign: "center",
    fontWeight: "100",
    padding: "5px 10px",
    borderBottom: "0",
    backgroundColor: theme.palette.primary.light + "9A",
  },
  studenName: {
    fontSize: "0.8rem",
    "&:hover": {
      whiteSpace: "normal",
      backgroundColor: "transparent",
    },
  },
}))

export default LessonsShift
