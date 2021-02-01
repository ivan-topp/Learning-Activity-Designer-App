import React, {useState} from 'react';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Logo from '../assets/img/Logo.png';
import {Avatar, Typography, Toolbar, AppBar, Button, ButtonGroup, IconButton, Menu, MenuItem} from '@material-ui/core';
import { LoginModal } from '../pages/LandingPage/LoginModal';
import SettingsIcon from '@material-ui/icons/Settings';

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
    
    const [darkmode, setDarkMode] = useState(false);
    const [isloged, setIsLoged] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openlogin, setOpenLogin] = useState(false);
    
    const open = Boolean(anchorEl);
    
    const handleClickOpenLogin = () => {
        setOpenLogin(true);
    };
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
      };
    //DarkMode
    const theme = createMuiTheme({
        palette: {
          type: 'dark',
        },
    });
    const DarkModeOn = ()=>{
        setDarkMode(true);
        handleClose();
    }
    const DarkModeOff = ()=>{
        setDarkMode(false);
        handleClose();
    }
    const classes = useStyles();
    
    if(!isloged){
        return(
            <div className={classes.root}>
            {(darkmode) ?
            <ThemeProvider theme={theme}>
                <AppBar position="static" color="default">
                    <Toolbar>
                    <Avatar className={classes.logo} src ={Logo} alt="Logo"/>
                    <Typography variant="h6" className={classes.title}>
                        LAD
                    </Typography>
                    
                    <IconButton onClick={handleMenu}>
                        <SettingsIcon/> 
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        open={open}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Logout</MenuItem>
                        <MenuItem onClick={DarkModeOff} >Dark Mode</MenuItem>
                    </Menu>
                    
                    {
                        (setOpenLogin)&&<LoginModal setOpenLogin={setOpenLogin} openlogin={openlogin}></LoginModal>    
                    }
                    </Toolbar>
                </AppBar>
            </ThemeProvider>
            :
            <AppBar position="static" color="default">
                <Toolbar>
                    <Avatar className={classes.logo} src ={Logo} alt="Logo"/>
                    <Typography variant="h6" className={classes.title}>
                        LAD
                    </Typography>
                    
                    <IconButton onClick={handleMenu}>
                        <SettingsIcon/> 
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                        }}
                        open={open}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Logout</MenuItem>
                        <MenuItem onClick={DarkModeOn} >Dark Mode</MenuItem>
                    </Menu>
                    
                    {
                        (setOpenLogin)&&<LoginModal setOpenLogin={setOpenLogin} openlogin={openlogin}></LoginModal>    
                    }
                </Toolbar>
            </AppBar>
            }
            </div>
        )
    }else{
        return  (
            <div className={classes.root}>
                {(!darkmode) ?
                    <AppBar position="static" color="default">
                        <Toolbar>
                            <Avatar className={classes.logo} src ={Logo} alt="Logo"/>
                            <Typography variant="h6" className={classes.title}>
                                LAD
                            </Typography>
                            <ButtonGroup variant="text"  aria-label="text primary button group">
                                <Button  onClick={handleClickOpenLogin} >
                                    Ingresar
                                </Button>
                                <Button  >
                                    Registrarme
                                </Button>
                            </ButtonGroup>
                            <IconButton onClick={handleMenu}>
                                <SettingsIcon/> 
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                                }}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={DarkModeOn }>Dark Mode</MenuItem>
                            </Menu>
                            {
                                (setOpenLogin)&&<LoginModal setOpenLogin={setOpenLogin} openlogin={openlogin}></LoginModal>    
                            }
                        </Toolbar>
                        
                    </AppBar>
                    :
                    <ThemeProvider theme={theme}>
                        <AppBar position="static" color="default">
                            <Toolbar>
                            <Avatar className={classes.logo} src ={Logo} alt="Logo"/>
                            <Typography variant="h6" className={classes.title}>
                                LAD
                            </Typography>
                            <ButtonGroup variant="text"  aria-label="text primary button group">
                                <Button  onClick={handleClickOpenLogin} >
                                    Ingresar
                                </Button>
                                <Button  >
                                    Registrarme
                                </Button>
                            </ButtonGroup>
                            <IconButton onClick={handleMenu}>
                                <SettingsIcon/> 
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                                }}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={DarkModeOff }>Dark Mode</MenuItem>
                            </Menu>
                            {
                                (setOpenLogin)&&<LoginModal setOpenLogin={setOpenLogin} openlogin={openlogin}></LoginModal>    
                            }
                            </Toolbar>
                            
                        </AppBar>
                    </ThemeProvider>
                }
            </div>
        )
    }
}


