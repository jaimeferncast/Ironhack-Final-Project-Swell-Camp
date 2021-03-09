import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, makeStyles, Typography } from "@material-ui/core"
import clsx from "clsx"

const MealsShift = (props) => {
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
            {props.iterable.map((categoryType, idx) => {
              const isSelected = props.clickedMeals === categoryType._id ? true : false
              return (
                <TableCell
                  key={`${props.shift}-${idx}`}
                  className={clsx(classes.cell, isSelected ? classes.selected : null)}
                  onClick={() => props.onClick(categoryType._id)}
                >
                  {categoryType.quantity}
                </TableCell>
              )
            })}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    marginBottom: theme.spacing(5),
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
  selected: {
    border: `2px solid ${theme.palette.third.main}`,
    backgroundColor: "transparent",
    color: theme.palette.third.main,
  },
  headerCell: {
    backgroundColor: theme.palette.primary.main,
  },
}))

export default MealsShift
