import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { makeStyles } from '@material-ui/core/styles';
import { Search } from '@material-ui/icons';
import Logo from 'assets/img/Logo.png';
import { Avatar, Typography, Toolbar, AppBar, Button, ButtonGroup, IconButton, Menu, MenuItem, Switch, FormControlLabel, OutlinedInput, Box } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import { useUiState } from 'contexts/ui/UiContext';
import { useAuthState } from 'contexts/AuthContext';
import { useUserConfigState } from 'contexts/UserConfigContext';
import types from 'types';

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
    brand: {
        display: "flex",
        alignItems: 'center',
        textDecoration: 'none',
    },
    navbarColor: {
        background: theme.palette.background.navbar,
    },
    navbarLetter: {
        textDecoration: 'none',
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
    const { dispatch } = useUiState();
    const { authState, logout } = useAuthState();
    const [filter, setFilter] = useState('');

    const handleLogout = () => {
        queryClient.clear();
        setMenuOpen(null);
        logout();
    };

    const handleOpenLoginModal = () => {
        dispatch({
            type: types.ui.toggleModal,
            payload: 'Login',
        });
    };

    const handleOpenRegisterModal = () => {
        dispatch({
            type: types.ui.toggleModal,
            payload: 'Register',
        });
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
                    <Box className={classes.brand} component={Link} to='/'>
                        <Avatar className={classes.logo} src={Logo} alt="Logo" />
                        <Typography variant="h6" className={classes.title}>
                            LAD
                        </Typography>
                    </Box>
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
                                    <Typography className={classes.navbarLetter}  component={Link} to={`/profile/${authState.user.uid}`} >
                                        { authState.user.name }
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