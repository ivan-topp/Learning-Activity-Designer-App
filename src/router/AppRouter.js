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
import { SharedWithMePage } from '../pages/SharedWithMe/SharedWithMePage';
import { PublicRepositoryPage } from '../pages/PublicRepository/PublicRepositoryPage';
import { SearchUsersPage } from '../pages/SearchUsersPage/SearchUsersPage';
import { DesignPage } from '../pages/DesignPage/DesignPage';

export const AppRouter = () => {
    const { authState } = useAuthState();
    const { token, checking } = authState;

    if (!token && checking) {
        return <h1>Espere...</h1>;
    }

    return (
        <Router>
            <div>
                <UserConfigProvider>
                    <CssBaseline/>
                    <NavBar />
                    <Switch>
                        <PublicRoute exact path="/" component={ LandingPage } isAuthenticated={!checking && !!token }/>
                        <PrivateRoute exact path="/profile/:uid" component={ UserProfile } isAuthenticated={ !checking && !!token }/>
                        <PrivateRoute exact path="/my-designs" component={MyDesignsPage} isAuthenticated={!checking && !!token }/>
                        <PrivateRoute path="/my-designs/:urlPath+/" component={MyDesignsPage} isAuthenticated={!checking && !!token }/>
                        <PrivateRoute exact path="/shared-with-me" component={SharedWithMePage} isAuthenticated={!checking && !!token }/>
                        <PrivateRoute exact path="/public-repository" component={PublicRepositoryPage} isAuthenticated={!checking && !!token }/>
                        <PrivateRoute exact path="/users/search" component={SearchUsersPage} isAuthenticated={!checking && !!token }/>
                            <PrivateRoute exact path="/designs/:id" component={DesignPage} isAuthenticated={!checking && !!token }/>
                        <Redirect to="/" />
                    </Switch>
                    <Footer />
                </UserConfigProvider>
            </div>
        </Router>
    );
};
