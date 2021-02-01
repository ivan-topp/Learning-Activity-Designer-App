import React from 'react'
import { Button } from '@material-ui/core'
import { logout } from '../../services/AuthService';
import { useAuthState } from '../../contexts/AuthContext';


export const MyDesignsPage = () => {

    const { setAuthState } = useAuthState();

    const handleLogout = () =>{
        logout(setAuthState);
    };

    return (
        <>
            <h1>MyDesignsPage</h1>
            <Button color="primary" variant='outlined' onClick={ handleLogout } fullWidth>
                Logout
            </Button>
        </>
    )
}
