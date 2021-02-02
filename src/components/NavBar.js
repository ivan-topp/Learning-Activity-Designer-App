import React, { useState } from 'react';
import { makeStyles, /*createMuiTheme, ThemeProvider*/ } from '@material-ui/core/styles';
import Logo from '../assets/img/Logo.png';
import { Avatar, Typography, Toolbar, AppBar, Button, ButtonGroup, IconButton, Menu, MenuItem } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import { useUiState } from '../contexts/UiContext';
import { useAuthState } from '../contexts/AuthContext';
import { logout } from '../services/AuthService';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    },
    logo: {
        width: theme.spacing(5),
        height: theme.spacing(5),
        margin: 'auto',
    },
}));

export const NavBar = () => {
    const [isMenuOpen, setMenuOpen] = useState(null);

    const { setUiState } = useUiState();
    const { authState } = useAuthState();
    const { setAuthState } = useAuthState();

    const handleLogout = () => {
        setMenuOpen(null);
        logout(setAuthState);
    };

    const handleOpenLoginModal = () => {
        setUiState((prevState) => ({
            ...prevState,
            isLoginModalOpen: true
        }));
    };

    const handleOpenRegisterModal = () => {
        setUiState((prevState) => ({
            ...prevState,
            isRegisterModalOpen: true
        }));
    }

    const handleMenu = (event) => {
        setMenuOpen(event.currentTarget);
    };

    const handleClose = () => {
        setMenuOpen(null);
    };

    const classes = useStyles();
    
    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Toolbar>
                    <Avatar className={classes.logo} src={Logo} alt="Logo" />
                    <Typography variant="h6" className={classes.title}>
                        LAD
                        </Typography>
                    {
                        (!authState.token) ?
                            <ButtonGroup variant="text" aria-label="text primary button group">
                                <Button onClick={handleOpenLoginModal} >
                                    Ingresar
                                    </Button>
                                <Button onClick={handleOpenRegisterModal}>
                                    Registrarme
                                    </Button>
                            </ButtonGroup>
                            :
                            <>
                                <IconButton onClick={handleMenu}>
                                    <SettingsIcon />
                                </IconButton>
                                <Menu
                                    anchorEl = {isMenuOpen}
                                    open = {Boolean(isMenuOpen)}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    onClose={handleClose}
                                >
                                    <MenuItem>
                                        <Button color="primary" onClick={handleLogout}>
                                            Cerrar sesión
                                        </Button>
                                    </MenuItem>
                                </Menu>
                            </>
                    }
                </Toolbar>
            </AppBar>
        </div>
    );
}