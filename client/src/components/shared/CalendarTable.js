import { Component } from "react"
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, withStyles } from "@material-ui/core"
import { truncateString } from "../../utils"
import clsx from "clsx"

class CalendarTable extends Component {
  render() {
    const { classes } = this.props
    return (
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Cama</TableCell>
              <TableCell align="center">06/09/2021</TableCell>
              <TableCell align="center">07/09/2021</TableCell>
              <TableCell align="center">07/09/2021</TableCell>
              <TableCell align="center">08/09/2021</TableCell>
              <TableCell align="center">09/09/2021</TableCell>
              <TableCell align="center">10/09/2021</TableCell>
              <TableCell align="center">11/09/2021</TableCell>
              <TableCell align="center">12/09/2021</TableCell>
              <TableCell align="center">13/09/2021</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="center">1.1</TableCell>
              <TableCell className={classes.cell} align="center">
                <Button variant="contained" className={clsx(classes.button, classes.filled)}>
                  {truncateString("Maria Josefa", 9)}
                </Button>
              </TableCell>
              <TableCell className={classes.cell} align="center">
                <Button variant="contained" className={clsx(classes.button, classes.empty)}>
                  {truncateString("", 9)}
                </Button>
              </TableCell>
              <TableCell className={classes.cell} align="center">
                <Button variant="contained" className={clsx(classes.button, classes.empty)}>
                  {truncateString("", 9)}
                </Button>
              </TableCell>
              <TableCell className={classes.cell} align="center">
                <Button variant="contained" className={clsx(classes.button, classes.filled)}>
                  {truncateString("Antonio", 9)}
                </Button>
              </TableCell>
              <TableCell className={classes.cell} align="center">
                <Button variant="contained" className={clsx(classes.button, classes.empty)}>
                  {truncateString("", 9)}
                </Button>
              </TableCell>
              <TableCell className={classes.cell} align="center">
                <Button variant="contained" className={clsx(classes.button, classes.filled)}>
                  {truncateString("Ana", 9)}
                </Button>
              </TableCell>
              <TableCell className={classes.cell} align="center">
                <Button variant="contained" className={clsx(classes.button, classes.filled)}>
                  {truncateString("Ana", 9)}
                </Button>
              </TableCell>
              <TableCell className={classes.cell} align="center">
                <Button variant="contained" className={clsx(classes.button, classes.filled)}>
                  {truncateString("Ana", 9)}
                </Button>
              </TableCell>
              <TableCell className={classes.cell} align="center">
                <Button variant="contained" className={clsx(classes.button, classes.filled)}>
                  {truncateString("Ana", 9)}
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">1.2</TableCell>
              <TableCell align="center">BB</TableCell>
              <TableCell align="center">BB</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center">CC</TableCell>
              <TableCell align="center" className={classes.cell}>
                CC
              </TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">2.1</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">2.2</TableCell>
              <TableCell align="center">BB</TableCell>
              <TableCell align="center">BB</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center">CC</TableCell>
              <TableCell align="center">CC</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">3.1</TableCell>
              <TableCell align="center">BB</TableCell>
              <TableCell align="center">BB</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center">CC</TableCell>
              <TableCell align="center">CC</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">3.2</TableCell>
              <TableCell align="center">BB</TableCell>
              <TableCell align="center">BB</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center">CC</TableCell>
              <TableCell align="center">CC</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">Bahamas.1</TableCell>
              <TableCell align="center">BB</TableCell>
              <TableCell align="center">BB</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center">CC</TableCell>
              <TableCell align="center">CC</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">Bahamas.2</TableCell>
              <TableCell align="center">BB</TableCell>
              <TableCell align="center">BB</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center">CC</TableCell>
              <TableCell align="center">CC</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">Bahamas.3</TableCell>
              <TableCell align="center">BB</TableCell>
              <TableCell align="center">BB</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center">CC</TableCell>
              <TableCell align="center">CC</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">Bahamas.4</TableCell>
              <TableCell align="center">BB</TableCell>
              <TableCell align="center">BB</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center">CC</TableCell>
              <TableCell align="center">CC</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">Bahamas.4</TableCell>
              <TableCell align="center">BB</TableCell>
              <TableCell align="center">BB</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center">CC</TableCell>
              <TableCell align="center">CC</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">Bahamas.4</TableCell>
              <TableCell align="center">BB</TableCell>
              <TableCell align="center">BB</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center">CC</TableCell>
              <TableCell align="center">CC</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">Bahamas.4</TableCell>
              <TableCell align="center">BB</TableCell>
              <TableCell align="center">BB</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center">CC</TableCell>
              <TableCell align="center">CC</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">Bahamas.4</TableCell>
              <TableCell align="center">BB</TableCell>
              <TableCell align="center">BB</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center">CC</TableCell>
              <TableCell align="center">CC</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    )
  }
}

const styles = (theme) => ({
  container: {
    maxHeight: theme.spacing(70),
    maxWidth: theme.spacing(170),
  },
  cell: {
    padding: 0,
  },
  filled: {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: "8px",
    textAlign: "center",
  },
  empty: {
    backgroundColor: theme.palette.secondary.light,
    borderRadius: "8px",
    textAlign: "center",
  },
  button: {
    minHeight: theme.spacing(5),
    minWidth: theme.spacing(12),
  },
})
export default withStyles(styles)(CalendarTable)
