import { Grid } from "@material-ui/core"
import { useTheme } from "@material-ui/core/styles"

const Lessons = (props) => {
    const theme = useTheme()

    return (
        <Grid container style={theme.content} >
            clases de surf
        </Grid >
    )
}

export default Lessons