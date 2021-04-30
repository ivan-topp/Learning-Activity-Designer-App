import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Search } from '@material-ui/icons';
import Logo from 'assets/img/Logo.png';
import { Avatar, Typography, Toolbar, AppBar, Button, ButtonGroup, IconButton, Menu, MenuItem, Switch, FormControlLabel, OutlinedInput, Grid, useMediaQuery } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import { useUiState } from 'contexts/ui/UiContext';
import { useAuthState } from 'contexts/AuthContext';
import { useUserConfigState } from 'contexts/UserConfigContext';
import types from 'types';
import { LoginModal } from 'pages/Auth/LoginModal';
import { RegisterModal } from 'pages/Auth/RegisterModal';
import { formatName, getUserInitials } from 'utils/textFormatters';

const useStyles = makeStyles((theme) => ({
    root: {
    },
    title: {
        color: theme.palette.text.primary
    },
    logo: {
        width: theme.spacing(5),
        height: theme.spacing(5),
        //margin: 'auto',
    },
    brand: {
        marginLeft: 10,
        [theme.breakpoints.down('xs')]: {
            marginLeft: 0,
        },
    },
    search: {
        display: 'flex',
        justifyContent: 'center',
    },
    searchForm: {
        display: 'flex',
        alignItems: 'center',
    },
    userAndOptions: {
        display: 'flex',
        justifyContent: 'flex-end',
        [theme.breakpoints.down('xs')]: {
            justifyContent: 'center',
        },
    },
    navbarColor: {
        background: theme.palette.background.navbar,
    },
    navbarLetter: {
        textDecoration: 'none',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color: theme.palette.text.primary,
        cursor: 'pointer'
    },
    menuOptions: {
        marginRight: 10,
        [theme.breakpoints.down('xs')]: {
            marginRight: 0,
        },
    },
}));

export const NavBar = () => {
    const queryClient = useQueryClient();
    const history = useHistory();
    const [isMenuOpen, setMenuOpen] = useState(null);
    const theme = useTheme();
    const isXSDevice = useMediaQuery(theme.breakpoints.down('xs'));
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
        if (filter.trim().length > 0) {
            history.push(`/users/search?q=${filter.trim()}`);
            setFilter('');
        }
    };

    const handleMenu = (e) => {
        setMenuOpen(e.currentTarget);
    };


    const classes = useStyles();

    const renderUserOptions = () => {
        return (<Grid item xs={!isXSDevice ? 12 : 6} sm={4} lg={2} className={classes.userAndOptions}>
            <Button size='small' component={Link} to={`/profile/${authState.user.uid}`} style={{ display: 'flex', alignItems: 'center', textTransform: 'none' }}>
                <Avatar
                    style={{ marginRight: 10, width: 30, height: 30 }}
                    alt={formatName(authState.user.name, authState.user.lastname)}
                    src={authState.user.img && authState.user.img.length > 0 ? `${process.env.REACT_APP_URL}uploads/users/${authState.user.img}` : ''}
                >
                    {getUserInitials(authState.user.name, authState.user.lastname)}
                </Avatar>
                <Typography className={classes.navbarLetter}>
                    {formatName(authState.user.name, authState.user.lastname)}
                </Typography>
            </Button>
            <IconButton onClick={handleMenu} className={classes.menuOptions}>
                <SettingsIcon />
            </IconButton>
            <Menu
                anchorEl={isMenuOpen}
                open={Boolean(isMenuOpen)}
                keepMounted
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
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
        </Grid>);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.navbarColor} elevation={0}>
                <Toolbar style={{ padding: 0 }}>
                    <Grid container>
                        <Grid item xs={!isXSDevice ? 12 : 6} sm={3} lg={2}>
                            <Button size='small' component={Link} to='/' className={classes.brand}>
                                <Avatar className={classes.logo} src={Logo} alt="Logo" />
                                <Typography variant="h6" className={classes.title}>
                                    LAD
                                </Typography>
                            </Button>
                        </Grid>
                        { isXSDevice && authState.token && renderUserOptions() }
                        {
                            (!authState.token)
                                ? <Grid item xs={12} sm={9} lg={10} className={classes.userAndOptions}>
                                    <ButtonGroup variant="text" aria-label="text primary button group">
                                        <Button onClick={handleOpenLoginModal} >
                                            Ingresar
                                            </Button>
                                        <Button onClick={handleOpenRegisterModal}>
                                            Registrarme
                                            </Button>
                                    </ButtonGroup>
                                </Grid>
                                : <>
                                    <Grid item xs={12} sm={5} lg={8}>
                                        <div className={classes.search}>
                                            <form className={classes.searchForm} onSubmit={handleSearchUsers} noValidate>
                                                <OutlinedInput
                                                    margin='dense'
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
                                    </Grid>
                                    { !isXSDevice && renderUserOptions() }
                                </>
                        }
                    </Grid>
                </Toolbar>
            </AppBar>
            <LoginModal />
            <RegisterModal />
        </div>
    );
}