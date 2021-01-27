import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Redirect
} from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { PublicRoute } from './PublicRoute';


export const AppRouter = () => {

  const [isLogged, setIsLogged] = useState(false);

  return (
    <Router>
      <div>
        <Switch>
            <PublicRoute exact path="/" component={ LandingPage } isAuthenticated={ isLogged }/>
            <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  )
}
