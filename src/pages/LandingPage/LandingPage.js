import { makeStyles } from '@material-ui/core';
import React from 'react';
import { LoginModal } from './LoginModal';
import { RegisterModal } from './RegisterModal';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: 'calc(100vh - 64px)',
    }
}));

export const LandingPage = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <h1>LandingPage</h1>
            <hr/>
            <LoginModal />
            <RegisterModal />
        </div>
    );
};
