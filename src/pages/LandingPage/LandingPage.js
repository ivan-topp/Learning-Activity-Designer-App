import React from 'react';
import Button from '@material-ui/core/Button';
import { RegisterModal } from './RegisterModal';

export const LandingPage = () => {

    const [ open, setOpen ] = React.useState(false);

    const handleRegisterModalOpen = () => {
        setOpen(true);
    };

    return (
        <div>
            <h1>LandingPage</h1>
            <Button variant="contained" color="primary">
                Login
            </Button>
            <Button variant="contained" color="primary" onClick={ handleRegisterModalOpen }>
                Register
            </Button>

            <RegisterModal state={ [ open, setOpen ] } />
        </div>
    );
};
