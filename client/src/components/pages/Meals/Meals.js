import { Grid } from "@material-ui/core"
import { useTheme } from "@material-ui/core/styles"

const Meals = (props) => {
    const theme = useTheme()

    return (
        <Grid container style={theme.content} >
            comidas y cenas
        </Grid >
    )
}

export default Meals