import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, makeStyles, Avatar, Tabs, Tab, Typography } from '@material-ui/core';
import { useSocketState } from 'contexts/SocketContext';
import { useAuthState } from 'contexts/AuthContext';
import { formatName, getUserInitials } from 'utils/textFormatters';
import { DesignWorkspace } from 'pages/DesignPage/Workspace/DesignWorkspace';
import { DesignMetadata } from 'pages/DesignPage/Metadata/DesignMetadata';
import { TabPanel } from 'components/TabPanel';
import { useDesignState } from 'contexts/design/DesignContext';
import { types } from 'types/types';

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
    menu: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    menuLetters: {
        marginLeft: theme.spacing(2),
        marginBottom: theme.spacing(1),
    },
    menuLettersSelected: {
        marginLeft: theme.spacing(2),
        borderBottom: `2px solid ${theme.palette.divider}`
    },
    tabBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    usersConnecteds: {
        display: 'flex',
    }
}));

const a11yProps = (index) => {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

export const DesignPage = () => {
    const classes = useStyles();
    const { id } = useParams();
    const isMounted = useRef(true);
    const { authState } = useAuthState();
    const { socket, online } = useSocketState();
    const [users, setUsersList] = useState([]);
    const [value, setValue] = useState(0);
    const { designState, dispatch } = useDesignState();
    const { design } = designState;

    

    useEffect(()=>{
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if(online){
            socket.emit('join-to-design', { user: authState.user, designId: id }, (res) => {
                if (res.ok){
                    if(isMounted.current) {
                        dispatch({
                            type: types.design.updateDesign,
                            payload: res.data.design
                        });
                    }
                } 
                else console.log(res);
            });
        }
    }, [socket, authState.user, id, online, dispatch]);

    useEffect(() => {
        socket.on('update-design', (design) => {
            if(isMounted.current) {
                dispatch({
                    type: types.design.updateDesign,
                    payload: design
                });
            }
        });
        socket.on('users', (users) => {
            if(isMounted.current) setUsersList(users);
        });
        return () => {
            socket.emit('leave-from-design', { user: authState.user, designId: id });
            socket.off('updateDesign');
            socket.off('users');
        };
    }, [socket, authState.user, id, dispatch]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    if (!design) {
        return (<Typography>Cargando...</Typography>);
    }

    return (
        <>
            <Grid container className={classes.menu} key={design._id}>
                <Grid item xs={12} md={3} lg={2} />
                <Grid item xs={12} md={6} lg={8} className={classes.tabBar}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="full width tabs example"
                    >
                        <Tab label="METADATA" {...a11yProps(0)} />
                        <Tab label="DISEÑO" {...a11yProps(1)} />
                    </Tabs>
                    <div className={classes.usersConnecteds}>
                        {
                            users.map((user, index) =>
                                <Avatar
                                    key={user.uid + index}
                                    alt={formatName(user.name, user.lastname)}
                                    src={user.img ?? ''}
                                >
                                    {getUserInitials(user.name, user.lastname)}
                                </Avatar>
                            )
                        }
                    </div>
                </Grid>
                <Grid item xs={12} md={3} lg={2}></Grid>
            </Grid>
            <TabPanel value={value} index={0}>
                <DesignMetadata />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <DesignWorkspace/>
            </TabPanel>
        </>
    )
}