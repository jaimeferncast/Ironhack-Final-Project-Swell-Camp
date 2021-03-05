import { Button, makeStyles, TableCell } from "@material-ui/core"
import { truncateString } from "../../utils"

import clsx from "clsx"

const CellButton = (props) => {
  const classes = useStyles()
  const cellState = !props.occupancy ? "empty" : props.occupancy._id === -1 ? "selected" : "occupied"
  const { variant, colorClass } = useCellButtonStyle(cellState)

  return (
    <TableCell align="center" className={classes.cell}>
      <Button onClick={props.onClick} variant={variant} color="secondary" className={clsx(classes.button, classes[colorClass])}>
        {truncateString(props.occupancy ? props.occupancy.booking.name : "", 9)}
      </Button>
    </TableCell>
  )
}

const useCellButtonStyle = (state) => {
  switch (state) {
    case "occupied":
      return { variant: "contained", colorClass: "filled" }
    case "empty":
      return { variant: "contained", colorClass: "empty" }
    case "selected":
      return { variant: "outlined", colorClass: "selected" }
    default:
      throw new Error(`State ${state} not implemented`)
  }
}

const useStyles = makeStyles((theme) => ({
  cell: {
    padding: 0,
  },
  filled: {
    backgroundColor: theme.palette.secondary.main,
  },
  empty: {
    backgroundColor: theme.palette.secondary.light,
  },
  selected: {
    borderColor: theme.palette.third.main,
    color: theme.palette.third.main,
  },

  button: {
    borderRadius: theme.spacing(1),
    height: theme.spacing(3),
    width: theme.spacing(14),
  },
}))

export default CellButton
