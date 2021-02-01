import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Redirect
} from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage/LandingPage';
import { PublicRoute } from './PublicRoute';
import { PrivateRoute } from './PrivateRoute';
import { MyDesignsPage } from '../pages/MyDesigns/MyDesignsPage';
import { useAuthState } from '../contexts/AuthContext';
import { NavBar } from '../components/NavBar';

export const AppRouter = () => {
    const { authState } = useAuthState();
    const { token, checking } = authState;
    if(checking){
        return <h1>Espere...</h1>;
    }
    return (
        <Router>
            <div>
                <NavBar />
                <Switch>
                    <PublicRoute exact path="/" component={ LandingPage } isAuthenticated={ Boolean(token) } />
                    <PrivateRoute exact path="/my-designs" component={ MyDesignsPage } isAuthenticated={ Boolean(token) } />
                    <Redirect to="/" />
                </Switch>
            </div>
        </Router>
    );
};
