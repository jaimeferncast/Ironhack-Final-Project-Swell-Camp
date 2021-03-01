import { Switch, Route, Redirect } from 'react-router-dom'

import NewReservation from './../pages/NewReservation/NewReservation'

const Routes = ({ storeUser, loggedUser, /* handleAlert */ }) => {

    return (
        <Switch>
            <Route path="/reservar" render={() => <NewReservation />} />
        </Switch>
    )
}

export default Routes