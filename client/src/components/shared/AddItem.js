import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Fab from "@material-ui/core/Fab"
import AddIcon from "@material-ui/icons/Add"

const FloatingActionButtons = (props) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Fab size={props.size} color="primary" aria-label="add" disabled={props.disabled} onClick={props.onClick}>
        <AddIcon />
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
