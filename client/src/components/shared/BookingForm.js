import { makeStyles } from '@material-ui/core/styles'
import { Fade } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
    paper: {
        backgroundColor: "red",
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}))

const BookingForm = ({ booking, modalState }) => {
    const classes = useStyles()
    return (
        <Fade in={modalState}>
            <div className={classes.paper}>
                <h2 id="transition-modal-title">hola</h2>
                <p id="transition-modal-description">hola</p>
            </div>
        </Fade>
    )
}

export default BookingForm