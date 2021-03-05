import { Typography, Container, Link } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

function Copyright() {
    return (
        <Typography variant="body2">
            {'Copyright © '}
            <Link color="inherit" href="#" target="_blank">
                Swell Camp
      </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    )
}

const Footer = () => {
    const classes = useStyles()

    return (
        <footer className={classes.footer}>
            <Container>
                <Copyright />
            </Container>
        </footer>
    )
}

const useStyles = makeStyles((theme) => ({
    footer: {
        textAlign: 'right',
        height: '6vh',
        padding: theme.spacing(2.2, 1),
        color: '#b3bacd',
        backgroundColor: '#002040'
    },
}))

export default Footer