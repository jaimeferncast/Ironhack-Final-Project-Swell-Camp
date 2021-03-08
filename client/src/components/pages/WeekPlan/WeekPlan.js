import { Component } from 'react'

import { Grid, withStyles } from "@material-ui/core"

class WeekPlan extends Component {
    constructor() {
        super()
        this.state = {

        }
    }



    render() {
        const { classes } = this.props
        return (
            <Grid container className={classes.content} >
                vista semanal
            </Grid >
        )
    }
}

const styles = (theme) => ({
    content: theme.content,
})

export default withStyles(styles)(WeekPlan)
