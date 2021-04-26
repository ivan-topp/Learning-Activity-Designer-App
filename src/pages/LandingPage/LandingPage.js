import { makeStyles } from '@material-ui/core';
import React from 'react';

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
            
        </div>
    );
};
