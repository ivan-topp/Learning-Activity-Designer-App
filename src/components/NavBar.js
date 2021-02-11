import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Logo from '../assets/img/Logo.png';
import { Avatar, Typography, Toolbar, AppBar, Button, ButtonGroup, IconButton, Menu, MenuItem, Switch, FormControlLabel } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import { useUiState } from '../contexts/UiContext';
import { useAuthState } from '../contexts/AuthContext';
import { logout } from '../services/AuthService';
import { useQueryClient } from 'react-query';
import { useUserConfigState } from '../contexts/UserConfigContext';

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
    const queryClient = useQueryClient();
    const [ isMenuOpen, setMenuOpen ] = useState(null);
    const { userConfig, setUserConfig } = useUserConfigState();
    const { setUiState } = useUiState();
    const { authState } = useAuthState();
    const { setAuthState } = useAuthState();
    
    const handleLogout = () => {
        queryClient.clear();
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
    };

    const handleMenu = (event) => {
        setMenuOpen(event.currentTarget);
    };

    const handleClose = () => {
        setMenuOpen(null);
    };

    const handleChangeUserConfig = (event) => {
        setUserConfig({ ...userConfig, [event.target.name]: event.target.checked });
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
                                <div>
                                    <Typography>
                                        {authState.user.name}
                                    </Typography>
                                </div>
                                <IconButton onClick={handleMenu}>
                                    <SettingsIcon />
                                </IconButton>
                                
                                <Menu
                                    anchorEl={isMenuOpen}
                                    open={Boolean(isMenuOpen)}
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
                                        <FormControlLabel
                                            control={<Switch checked={userConfig.darkTheme} onChange={handleChangeUserConfig} name="darkTheme" />}
                                            label="Tema Oscuro"
                                        />
                                    </MenuItem>
                                    <MenuItem>
                                        <FormControlLabel
                                            control={<Switch checked={userConfig.modeAdvanced} onChange={handleChangeUserConfig} name="modeAdvanced" />}
                                            label="Modo Avanzado"
                                        />
                                    </MenuItem>
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