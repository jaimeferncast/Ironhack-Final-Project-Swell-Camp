import { createMuiTheme } from "@material-ui/core/styles"
import { blue, amber, pink } from "@material-ui/core/colors"

const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue[600],
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
  content: {
    maxWidth: "1200px",
    flexDirection: "column",
  },
})

export default theme
