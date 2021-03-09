import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Fab from "@material-ui/core/Fab"
import DeleteIcon from "@material-ui/icons/Delete"

const FloatingActionButtons = (props) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Fab color="secondary" aria-label="delete" disabled={props.disabled} onClick={props.onClick}>
        <DeleteIcon />
      </Fab>
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}))

export default FloatingActionButtons
