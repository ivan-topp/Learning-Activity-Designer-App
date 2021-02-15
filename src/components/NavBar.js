import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Logo from '../assets/img/Logo.png';
import { Avatar, Typography, Toolbar, AppBar, Button, ButtonGroup, IconButton, Menu, MenuItem, Switch, FormControlLabel, OutlinedInput } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import { useUiState } from '../contexts/UiContext';
import { useAuthState } from '../contexts/AuthContext';
import { logout } from '../services/AuthService';
import { useQueryClient } from 'react-query';
import { useUserConfigState } from '../contexts/UserConfigContext';
import { useHistory } from 'react-router-dom';
import { Search } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
        color: theme.palette.text.primary
    },
    logo: {
        width: theme.spacing(5),
        height: theme.spacing(5),
        margin: 'auto',
    },
    navbarColor: {
        background: theme.palette.background.navbar,
    },
    navbarLetter: {
        color: theme.palette.text.primary,
        cursor: 'pointer'
    },
    menuColor: {
        background: theme.palette.background.menu
    }
}));

export const NavBar = () => {
    const queryClient = useQueryClient();
    const history = useHistory();
    const [isMenuOpen, setMenuOpen] = useState(null);
    const { userConfig, setUserConfig } = useUserConfigState();
    const { setUiState } = useUiState();
    const { authState } = useAuthState();

    const { setAuthState } = useAuthState();
    const [filter, setFilter] = useState('');

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

    const handleClose = () => {
        setMenuOpen(null);
    };

    const handleChangeUserConfig = (event) => {
        setUserConfig({ ...userConfig, [event.target.name]: event.target.checked });
    };

    const handleInputFormChange = ({ target }) => {
        setFilter(target.value);
    };

    const handleSearchUsers = async (e) => {
        e.preventDefault();
        if(filter.trim().length > 0) {
            history.push(`/users/search?q=${filter.trim()}`);
            setFilter('');
        }
    };

    const handleMenu = ( e ) => {
        setMenuOpen(e.currentTarget);
    };

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.navbarColor} elevation={0}>
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ display: "flex", alignItems: 'center', cursor: 'pointer' }} onClick={(e) => history.push('/')}>
                        <Avatar className={classes.logo} src={Logo} alt="Logo" />
                        <Typography variant="h6" className={classes.title}>
                            LAD
                        </Typography>
                    </div>
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
                                    <form onSubmit={handleSearchUsers} noValidate>
                                        <OutlinedInput
                                            variant="outlined"
                                            name="filter"
                                            value={filter}
                                            type="text"
                                            placeholder='Buscar usuario'
                                            onChange={handleInputFormChange}
                                        />
                                        <IconButton type="submit" className={classes.iconButton} aria-label="search">
                                            <Search />
                                        </IconButton>
                                    </form>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography className={classes.navbarLetter} onClick={(e) => history.push(`/profile/${authState.user.uid}`)}>
                                        {authState.user.name}
                                    </Typography>
                                    <IconButton onClick={ handleMenu }>
                                        <SettingsIcon />
                                    </IconButton>
                                </div>
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