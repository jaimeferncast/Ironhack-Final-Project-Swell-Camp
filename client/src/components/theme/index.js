import { createMuiTheme } from "@material-ui/core/styles"
import { blue, amber, pink } from "@material-ui/core/colors"

const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue[400],
      light: blue[200],
      dark: blue[900],
    },
    secondary: {
      main: amber[200],
      light: amber[50],
    },
    third: {
      main: pink[500],
    },
  },
})

export default theme
