import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup, Divider, Grid, makeStyles, Typography, Avatar, } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useSocketState } from '../../contexts/SocketContext';
import { useAuthState } from '../../contexts/AuthContext';
import { formatName, getUserInitials } from '../../utils/textFormatters';

const useStyles = makeStyles((theme) => ({
    leftPanel: {
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    workspace: {
        paddingLeft: 30,
        paddingRight: 30,
        background: theme.palette.background.workSpace,
        minHeight: 'calc(100vh - 64px)'
    },
    rightPanel: {
        display: 'flex',
        flexDirection: 'column',
        borderLeft: `1px solid ${theme.palette.divider}`,
    },
    menu:{
        marginTop: theme.spacing(1),
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    menuLetters:{
        marginLeft: theme.spacing(2),
        marginBottom: theme.spacing(1),
    },
    menuLettersSelected:{
        marginLeft: theme.spacing(2),
        borderBottom: `2px solid ${theme.palette.divider}`
    },
    buttonGroupWorkSpace:{
        marginTop: theme.spacing(1)
    },
    textLefPanel:{
        marginTop: theme.spacing(1)
    },
    spaceData:{
        marginBottom: theme.spacing(2),
        borderBottom: `2px solid ${theme.palette.divider}`
    },  
    }));

export const DesignUser = () => {
    const classes = useStyles();
    const { id } = useParams();
    const { authState } = useAuthState();
    const { socket, online } = useSocketState();
    const [ users, setUsersList] = useState([]);
    const [selectedMetadatos, setSelectedMetadatos] = useState(false);

    useEffect(() => {
        socket.emit('join-to-design', { user: authState.user, design: id });
        socket.on('joined', ( users ) => setUsersList(users));
        return () => socket.off('joined');
    }, [socket, authState.user, id]);

    console.log(users);
    console.log(online);

    return (
        <>  
            <Grid container className={classes.menu}>
                <Grid item xs={12} md={2} />
                <Grid item xs={12} md={8} >
                    {selectedMetadatos ?
                        <Grid container> 
                            <Grid item className={classes.menuLettersSelected}>
                                <Button>METADATOS</Button>
                            </Grid>
                            <Grid item className={classes.menuLetters}>
                                <Button onClick={()=>{setSelectedMetadatos(false)}}>DISEÑO</Button>
                            </Grid>
                        </Grid>
                        : 
                        <Grid container> 
                            <Grid item className={classes.menuLetters}>
                                <Button onClick={()=>{setSelectedMetadatos(true)}}>METADATOS</Button>
                            </Grid>
                            <Grid item className={classes.menuLettersSelected}>
                                <Button >DISEÑO</Button>
                            </Grid>
                        </Grid>    
                    }
                </Grid>
                <Grid item xs={12} md ={2}>
                    {
                        users.map((user) => 
                            <Avatar
                                key={user.uid}
                                alt={formatName(user.name, user.lastname)}
                                src={user.img ?? ''}
                            >
                                {getUserInitials(user.name, user.lastname)}
                            </Avatar>
                            )
                        }
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12} md={3} lg={2} className={classes.leftPanel}>
                    <Grid container alignItems='center' justify='center'>
                        <Typography className={classes.textLefPanel}> INFORMACIÓN DISEÑO </Typography>
                    </Grid>
                    <Divider className={classes.spaceData}/>
                </Grid>
                <Grid item xs={12} md={6} lg={8} className={classes.workspace}>
                    <ButtonGroup size="small" aria-label="outlined primary button group" className={classes.buttonGroupWorkSpace}>
                        <Button>Nuevo</Button>
                        <Button>Compartir</Button>
                        <Button>Guardar</Button>
                    </ButtonGroup>
                </Grid>
                <Grid item xs={12} md={3} lg={2} className={classes.rightPanel}></Grid>
            </Grid>
        </>
    )
}
