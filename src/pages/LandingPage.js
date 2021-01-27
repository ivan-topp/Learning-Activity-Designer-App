import React from 'react';
import Button from '@material-ui/core/Button';

export const LandingPage = () => {
    return (
        <div>
            <h1>LandingPage</h1>
            <Button variant="contained" color="primary">
                Login
            </Button>
            <Button variant="contained" color="primary">
                Register
            </Button>
        </div>
    );
};
