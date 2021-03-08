import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, makeStyles, Typography } from "@material-ui/core"
import CellButton from "../../shared/CellButton"
import clsx from "clsx"

const LessonsShift = (props) => {
  const classes = useStyles()
  const stateIndex = props.shift === "mañana" ? 0 : 1
  return (
    <TableContainer className={classes.tableContainer}>
      <Table stickyHeader style={{ borderCollapse: "collapse", width: "auto" }}>
        <TableHead>
          <TableRow className={classes.headerRow}>
            <TableCell className={clsx(classes.headerCell, classes.cell)}>
              <Typography>Horario {props.shift}</Typography>
            </TableCell>
            <TableCell className={clsx(classes.headerCell, classes.cell)}>
              <Typography>Nivel 0</Typography>
            </TableCell>
            <TableCell className={clsx(classes.headerCell, classes.cell)}>
              <Typography>Nivel 0.5</Typography>
            </TableCell>
            <TableCell className={clsx(classes.headerCell, classes.cell)}>
              <Typography>Nivel 1</Typography>
            </TableCell>
            <TableCell className={clsx(classes.headerCell, classes.cell)}>
              <Typography>Nivel 1.5</Typography>
            </TableCell>
            <TableCell className={clsx(classes.headerCell, classes.cell)}>
              <Typography>Nivel 2</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell className={clsx(classes.subheaderCell, classes.cell)}>
              <Typography> Nº alumnos</Typography>
            </TableCell>
            {props.surfLevels.map((level, idx) => (
              <TableCell key={level} className={clsx(classes.subheaderCell, classes.cell)}>
                {props.lessons[idx].data.length ? props.lessons[idx].data[stateIndex].bookings.length : 0}
              </TableCell>
            ))}
          </TableRow>
          {[...Array(props.maxStudents[1])].map((elm, studentsIndex) => (
            <TableRow key={studentsIndex}>
              <TableCell className={classes.cell}></TableCell>
              {props.surfLevels.map((surfLevel, surfLevelIndex) => (
                <TableCell key={surfLevel} className={classes.cell}>
                  <Typography>
                    {!props.lessons[surfLevelIndex].data.length
                      ? ""
                      : props.lessons[surfLevelIndex].data[stateIndex].bookings[studentsIndex]
                      ? props.lessons[surfLevelIndex].data[stateIndex].bookings[studentsIndex].name
                      : ""}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
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
  subheaderCell: {
    backgroundColor: theme.palette.primary.light + "9A",
  },
  headerCell: {
    backgroundColor: theme.palette.primary.main,
  },
}))

export default LessonsShift
