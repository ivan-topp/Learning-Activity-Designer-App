import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Logo from '../assets/img/Logo.png';
import { Avatar, Typography, Toolbar, AppBar, Button, ButtonGroup, IconButton, Menu, MenuItem, Switch, FormControlLabel, TextField } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import { useUiState } from '../contexts/UiContext';
import { useAuthState } from '../contexts/AuthContext';
import { logout } from '../services/AuthService';
import { useUserConfigState } from '../contexts/UserConfigContext';
import { searchOtherUsers } from '../services/UserService';
import { useForm } from '../hooks/useForm';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
        color:  theme.palette.text.primary
    },
    logo: {
        width: theme.spacing(5),
        height: theme.spacing(5),
        margin: 'auto',
    },
    navbarColor:{
        background: theme.palette.primary.navbar,
    },
    navbarLetter:{
        color:  theme.palette.text.primary
    }
}));

export const NavBar = () => {
    const [ isMenuOpen, setMenuOpen ] = useState(null);
    const { userConfig, setUserConfig } = useUserConfigState();
    const { setUiState } = useUiState();
    const { authState } = useAuthState();
    const { setAuthState } = useAuthState();
    const [formSearchValues, handleInputChange, reset] = useForm({
        username: 'Alejandro Esteban',
    });

    const {username} = formSearchValues;
    
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

    const handleInputFormChange = (e) => {
        handleInputChange(e);
    };

    const handleSearchUsers = async (e) => {
        e.preventDefault();
        const name = username
        let res = await searchOtherUsers({name});
        console.log(res);
    };

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar className = {classes.navbarColor} position="static" >
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
                                    <form onSubmit = {handleSearchUsers} noValidate>
                                        <TextField
                                            id="outlined-start-adornment"
                                            variant="outlined"
                                            name="username"
                                            value={username}
                                            type="username"
                                            onChange={handleInputFormChange}
                                            InputProps={{
                                                endAdornment:
                                                    <IconButton>                                             
                                                    </IconButton>
                                            }}
                                        />
                                    </form>
                                </div>
                                <div >
                                    <Typography className={classes.navbarLetter}>
                                        {authState.user.name}
                                    </Typography>
                                </div>
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