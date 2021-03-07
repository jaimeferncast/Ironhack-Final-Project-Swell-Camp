import { Button, makeStyles, TableCell } from "@material-ui/core"
import { truncateString } from "../../utils"

import clsx from "clsx"

const CellButton = (props) => {
  const classes = useStyles()
  const cellState = props.data.cellState
  const { variant, colorClass } = useCellButtonStyle(cellState)

  return (
    <TableCell align="center" padding="none" style={{ borderBottom: "1px solid rgba(0, 0, 0, 0)" }}>
      <Button onClick={props.data.onClick} variant={variant} color="secondary" className={clsx(classes.button, classes[colorClass])} >
        {cellState === "empty" ? "DISPONIBLE" : truncateString(props.data.name, 15)}
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
    case "outOfRange":
      return { variant: "contained", colorClass: "unavailable" }
    default:
      throw new Error(`State ${state} not implemented`)
  }
}

const useStyles = makeStyles((theme) => ({
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
  unavailable: {
    backgroundColor: theme.palette.secondary.light + "61",
    color: "#00000061",
    "&:hover": {
      backgroundColor: theme.palette.secondary.light + "61",
    }
  },
  button: {
    borderRadius: theme.spacing(1),
    height: theme.spacing(3),
    width: theme.spacing(14),
    margin: "1px 1px 0",
    fontSize: "0.7rem",
    padding: "1px 0 0",
  },
}))

export default CellButton
