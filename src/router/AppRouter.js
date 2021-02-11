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
import { UserProfile } from '../pages/UserProfile/UserProfile';
import { useAuthState } from '../contexts/AuthContext';
import { NavBar } from '../components/NavBar';
import { UserConfigProvider} from '../contexts/UserConfigContext';
import { Footer } from '../components/Footer';
import { CssBaseline } from '@material-ui/core';

export const AppRouter = () => {
    const { authState } = useAuthState();
    const { token, checking } = authState;
    
    if(checking){
        return <h1>Espere...</h1>;
    }
    return (
        <Router>
            <div>
                <UserConfigProvider>
                    <CssBaseline/>
                    <NavBar />
                    <Switch>
                        <PublicRoute exact path="/" component={ LandingPage } isAuthenticated={ Boolean(token) } />
                        {/*<PrivateRoute exact path="/my-designs" component={ MyDesignsPage } isAuthenticated={ Boolean(token) } />*/}
                        <PrivateRoute exact path="/my-perfil" component={ UserProfile } isAuthenticated={ Boolean(token) } />
                        <Redirect to="/" />
                    </Switch>
                </UserConfigProvider>
            </div>
        </Router>
    );
};
