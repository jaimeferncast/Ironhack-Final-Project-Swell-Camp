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

const MealsShift = (props) => {
  const classes = useStyles()
  return (
    <TableContainer className={classes.tableContainer}>
      <Table style={{ borderCollapse: "separate" }}>
        <TableHead>
          <TableRow className={classes.headerRow}>
            <TableCell className={clsx(classes.headerCell, classes.cell)}>
              <Typography style={{ fontWeight: "100", fontSize: "0.95rem" }}>
                Tipos de menú para la {props.shift}
              </Typography>
            </TableCell>
            <TableCell className={clsx(classes.headerCell, classes.cell)}>
              <Typography style={{ fontWeight: "100", fontSize: "0.9rem" }}>Nº</Typography>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {props.iterable.map((type, i) => {
            const isSelected = props.clickedMeals === type._id ? true : false
            return (
              <TableRow key={`${props.shift}-${type.mealType}`}>
                <TableCell className={classes.subheaderCell}>
                  <Typography noWrap className={classes.menuName}>
                    {type.mealType}
                  </Typography>
                </TableCell>
                <TableCell
                  align="center"
                  key={`${props.shift}-${i}`}
                  className={clsx(classes.cell, isSelected ? classes.selected : null)}
                  onClick={() => props.onClick(type._id)}
                >
                  {type.quantity}
                </TableCell>
              </TableRow>
            )
          })}
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
    height: theme.spacing(3),
  },
  cell: {
    backgroundColor: theme.palette.secondary.main + "9A",
    padding: "0 10px",
    border: "2px solid #ffffff00",
  },
  subheaderCell: {
    width: theme.spacing(64),
    maxWidth: theme.spacing(64),
    backgroundColor: theme.palette.primary.light + "9A",
    padding: "5px 10px",
    borderBottom: "0",
  },
  selected: {
    backgroundColor: "transparent",
    color: theme.palette.third.main,
    border: `2px solid ${theme.palette.third.main}`,
    zIndex: "999",
  },
  headerCell: {
    backgroundColor: theme.palette.primary.main,
    padding: "5px 10px",
  },
  menuName: {
    fontSize: "0.9rem",
    fontWeight: "100",
    "&:hover": {
      whiteSpace: "normal",
      backgroundColor: "transparent",
    },
  },
}))

export default MealsShift
