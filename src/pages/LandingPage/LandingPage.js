import React from 'react';
import { LoginModal } from './LoginModal';
import { RegisterModal } from './RegisterModal';

export const LandingPage = () => {

    return (
        <>
            <h1>LandingPage</h1>
            <hr/>
            <LoginModal />
            <RegisterModal />
        </>
    );
};
