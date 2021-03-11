import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions } from "@material-ui/core"
import { Component } from "react"
import MealService from "../../../service/meals.service"
const { addHours } = require("date-fns")

class AddMealModal extends Component {
  state = {
    mealType: "",
    quantity: 0,
  }
  mealService = new MealService()

  handleInputChange = (e) => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }
  handleSubmit = (e) => {
    const add = this.props.addType === "lunch" ? 14 : 21

    // Set hour to 0:0:0, add 14 or 21 hours (for lunch or dinner) and convert to UTCString() to get 14:00:00 UTC
    const mealDate = addHours(new Date(this.props.date).setUTCHours(0, 0, 0), add).toUTCString()
    const mealData = {
      date: mealDate,
      mealType: this.state.mealType,
      quantity: this.state.quantity,
    }
    this.mealService
      .addMealType({ ...mealData })
      .then(() => this.props.submitOnClick())
      .catch((err) => console.error(err))
  }
  render() {
    return (
      <Dialog open={this.props.open}>
        <DialogTitle id="form-dialog-title">Añadir {this.props.addType}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="mealType"
            id="mealType"
            label="Tipo de menú"
            type="text"
            value={this.state.mealType}
            onChange={this.handleInputChange}
            fullWidth
          ></TextField>
          <TextField
            autoFocus
            margin="dense"
            name="quantity"
            id="quantity"
            label="Cantidad"
            type="number"
            value={this.state.quantity}
            onChange={this.handleInputChange}
            fullWidth
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.cancelOnClick} color="primary">
            Cancelar
          </Button>
          <Button onClick={this.handleSubmit} color="primary">
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default AddMealModal
