import { createMuiTheme } from "@material-ui/core/styles"
import { blue, amber } from "@material-ui/core/colors"

const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue[500],
    },
    secondary: {
      main: amber[200],
      light: amber[50],
    },
  },
})

export default theme
