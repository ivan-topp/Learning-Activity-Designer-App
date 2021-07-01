import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { ExitToApp, Search } from '@material-ui/icons';
import Logo from 'assets/img/Logo.png';
import { Avatar, Typography, Toolbar, AppBar, Button, IconButton, Menu, MenuItem, ListItemIcon, Switch, FormControlLabel, OutlinedInput, Grid, useMediaQuery } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import { useUiState } from 'contexts/ui/UiContext';
import { useAuthState } from 'contexts/AuthContext';
import { useUserConfigState } from 'contexts/UserConfigContext';
import types from 'types';
import { LoginModal } from 'pages/Auth/LoginModal';
import { RegisterModal } from 'pages/Auth/RegisterModal';
import { formatName, getUserInitials } from 'utils/textFormatters';
import { useDesignState } from 'contexts/design/DesignContext';

const useStyles = makeStyles((theme) => ({
    root: {
    },
    title: {
        color: theme.palette.text.primary
    },
    logo: {
        width: theme.spacing(4),
        height: theme.spacing(4),
        //margin: 'auto',
    },
    brand: {
        marginLeft: 10,
        [theme.breakpoints.down('xs')]: {
            marginLeft: 0,
        },
    },
    search: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchInput:{
        width: '100%',
        height: 40,
        '& fieldset': {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
        }
    },
    searchButton: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        height: 40,
    },
    searchForm: {
        width: '50%',
        display: 'flex',
        alignItems: 'center',
        [theme.breakpoints.down('xs')]: {
            width: '100%',
            padding: '0px 5px',
        },
    },
    btn: {
        margin: '0px 5px',
        height: 35,
    },
    userAndOptions: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
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
    const location = useLocation();
    const [isMenuOpen, setMenuOpen] = useState(null);
    const theme = useTheme();
    const isXSDevice = useMediaQuery(theme.breakpoints.down('xs'));
    const { userConfig, setUserConfig } = useUserConfigState();
    const { uiState, dispatch } = useUiState();
    const { authState, logout } = useAuthState();
    const [filter, setFilter] = useState('');
    const { designState } = useDesignState();
    const { design } = designState;

    const handleLogout = () => {
        queryClient.clear();
        setMenuOpen(null);
        logout();
    };

    const handleOpenLoginModal = () => {
        dispatch({
            type: types.ui.openModal,
            payload: 'Login',
        });
    };

    const handleOpenRegisterModal = () => {
        dispatch({
            type: types.ui.openModal,
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
            if (design !== null && !location.pathname.includes('reader') && !location.pathname.includes('shared-link') && !uiState.userSaveDesign) {
                dispatch({
                    type: types.ui.openModal,
                    payload: 'CheckSaveDesign'
                })
                dispatch({
                    type: types.ui.setHistoryInCheckSaveDesign,
                    payload: {
                        url: `/users/search?q=${filter.trim()}`,
                    }
                })
            } else {
                history.push(`/users/search?q=${filter.trim()}`);
            }
            setFilter('');
        }
    };

    const handleGoUserProfile = async (e) => {
        e.preventDefault();
        if (design !== null && !location.pathname.includes('reader') && !location.pathname.includes('shared-link') && !uiState.userSaveDesign) {
            dispatch({
                type: types.ui.openModal,
                payload: 'CheckSaveDesign'
            })
            dispatch({
                type: types.ui.setHistoryInCheckSaveDesign,
                payload: {
                    url: `/profile/${authState.user.uid}`,
                }
            })
        } else {
            history.push(`/profile/${authState.user.uid}`);
        }
    }

    const handleGoHomePage = async (e) => {
        e.preventDefault();
        if (design !== null && !location.pathname.includes('reader') && !location.pathname.includes('shared-link') && !uiState.userSaveDesign) {
            dispatch({
                type: types.ui.openModal,
                payload: 'CheckSaveDesign'
            })
            dispatch({
                type: types.ui.setHistoryInCheckSaveDesign,
                payload: {
                    url: `/`,
                }
            })
        } else {
            history.push(`/`);
        }
    }

    const handleMenu = (e) => {
        setMenuOpen(e.currentTarget);
    };

    const classes = useStyles();

    const renderUserOptions = () => {
        return (<Grid item xs={!isXSDevice ? 12 : 6} sm={4} lg={2} className={classes.userAndOptions}>
            <Button size='small' onClick={handleGoUserProfile} style={{ display: 'flex', alignItems: 'center', textTransform: 'none' }}>
                <Avatar
                    style={{ marginRight: 10,
                        width: 30,
                        height: 30,
                        border: `1px solid ${theme.palette.divider}`,
                        backgroundColor: authState.user.color, 
                        color: theme.palette.getContrastText(authState.user.color),
                    }}
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
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <ExitToApp />
                    </ListItemIcon>
                    Cerrar sesión
                </MenuItem>

            </Menu>
        </Grid>);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.navbarColor} elevation={0}>
                <Toolbar style={{ padding: 0 }}>
                    <Grid container>
                        <Grid item xs={!isXSDevice ? 12 : 6} sm={3} lg={2} style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                            <Button size='small' onClick={handleGoHomePage} className={classes.brand}>
                                <Avatar className={classes.logo} src={Logo} alt="Logo" />
                                <Typography variant="h6" className={classes.title}>
                                    LAD
                                </Typography>
                            </Button>
                        </Grid>
                        {isXSDevice && authState.token && renderUserOptions()}
                        {
                            (!authState.token)
                                ? <Grid item xs={12} sm={9} lg={10} className={classes.userAndOptions}>
                                    <Button className={classes.btn} variant='contained' color='primary' size='small' onClick={handleOpenLoginModal} >
                                        Ingresar
                                    </Button>
                                    <Button className={classes.btn} variant='outlined' color='primary' size='small' onClick={handleOpenRegisterModal}>
                                        Registrarme
                                    </Button>
                                </Grid>
                                : <>
                                    <Grid item xs={12} sm={5} lg={8} style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                        <div className={classes.search}>
                                            <form className={classes.searchForm} onSubmit={handleSearchUsers} noValidate>
                                                <OutlinedInput
                                                    className={classes.searchInput}
                                                    margin='dense'
                                                    variant="outlined"
                                                    name="filter"
                                                    value={filter}
                                                    type="text"
                                                    placeholder='Buscar usuario'
                                                    onChange={handleInputFormChange}
                                                />
                                                <Button variant='contained' disableElevation color='primary' type='submit' className={classes.searchButton} >
                                                    <Search />
                                                </Button>
                                                {/* <IconButton type="submit" className={classes.iconButton} aria-label="search">
                                                    <Search />
                                                </IconButton> */}
                                            </form>
                                        </div>
                                    </Grid>
                                    {!isXSDevice && renderUserOptions()}
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