import { Grid } from "@material-ui/core"
import { useTheme } from "@material-ui/core/styles"

const Calendar = (props) => {
    const theme = useTheme()

    return (
        <Grid container style={theme.content} >
            calendario
        </Grid >
    )
}

export default Calendar