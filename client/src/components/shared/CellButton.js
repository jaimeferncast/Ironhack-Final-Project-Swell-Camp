import { Button, makeStyles, TableCell } from "@material-ui/core"
import clsx from "clsx"

const CellButton = (props) => {
  const classes = useStyles()
  const { variant, colorClass } = useCellButtonStyle(props.state)

  return (
    <TableCell align="center" className={classes.cell}>
      <Button variant={variant} color="secondary" className={clsx(classes.button, classes[colorClass])}>
        {props.children}
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

  button: {
    borderRadius: theme.spacing(1),
    minHeight: theme.spacing(5),
    minWidth: theme.spacing(12),
  },
}))

export default CellButton
