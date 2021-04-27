import { makeStyles, Grid } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'

function CustomAlert(props) {
  const classes = useStyles()

  return (
    <Grid className={classes.veil}>
      <Alert
        severity={props.alertType}
        className={classes.alert}
        onClose={() => props.clearAlert()}
      >
        {props.alertMssg}
      </Alert>
    </Grid>
  )
}

const useStyles = makeStyles((theme) => ({
  alert: {
    height: theme.spacing(6),
    position: 'fixed',
    transform: 'translateY(30vh)',
    width: '90%',
    maxWidth: theme.spacing(80),
    zIndex: '1000',
    backgroundColor: '#ff98ba',
  },
  veil: {
    position: 'fixed',
    width: '100%',
    height: '100vh',
    zIndex: '999',
    backgroundColor: '#ffffff80',
    display: 'flex',
    justifyContent: 'center',
  },
}))

export default CustomAlert