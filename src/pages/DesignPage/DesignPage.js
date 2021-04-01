import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, makeStyles, Avatar, Tabs, Tab, Typography } from '@material-ui/core';
import { useSocketState } from 'contexts/SocketContext';
import { useAuthState } from 'contexts/AuthContext';
import { formatName, getUserInitials } from 'utils/textFormatters';
import { DesignWorkspace } from 'pages/DesignPage/Workspace/DesignWorkspace';
import { DesignMetadata } from 'pages/DesignPage/Metadata/DesignMetadata';
import { TabPanel } from 'components/TabPanel';
import { useDesignState } from 'contexts/design/DesignContext';
import { getBloomCategories, getBloomVerbs } from 'services/BloomService';
import types from 'types';
import { Alert } from '@material-ui/lab';
import { useSnackbar } from 'notistack';

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
        flexDirection: 'column',
    },
    error: {
        display: 'flex',
        justifyContent: 'center',
        padding: 20,
        alignItems: 'start',
        minHeight: 'calc(100vh - 128px)',
    },
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
    const [tabIndex, setTabIndex] = useState(0);
    const { designState, dispatch } = useDesignState();
    const { design } = designState;
    const [error, setError] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    
    const prefetchBloomCategories = useCallback(async () => {
        const data = await getBloomCategories();
        dispatch({
            type: types.design.setBloomCategories,
            payload: data.bloomCategories,
        });
    }, [dispatch]);

    const prefetchBloomVerbs = useCallback(async () => {
        const data = await getBloomVerbs('');
        dispatch({
            type: types.design.setBloomVerbs,
            payload: data.bloomVerbs,
        });
    }, [dispatch]);

    useEffect(()=>{
        prefetchBloomCategories();
        prefetchBloomVerbs();
    }, [prefetchBloomCategories, prefetchBloomVerbs]);

    useEffect(()=>{
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if(online){
            socket?.emit('join-to-design', { user: authState.user, designId: id }, (res) => {
                if (res.ok){
                    if(isMounted.current) {
                        dispatch({
                            type: types.design.updateDesign,
                            payload: res.data.design
                        });
                    }
                } 
                else setError(res.message);
            });
        }
    }, [socket, authState.user, id, online, dispatch]);

    useEffect(() => {
        socket?.on('update-design', (design) => {
            if(isMounted.current) {
                enqueueSnackbar('Su diseño se ha guardado correctamente',  {variant: 'success', autoHideDuration: 2000});
                dispatch({
                    type: types.design.updateDesign,
                    payload: design
                });
            }
        });
        socket?.on('users', (users) => {
            if(isMounted.current) setUsersList(users);
        });
        socket?.on('change-design-privileges', (privileges) => {
            enqueueSnackbar('Se ha compartido su diseño correctamente',  {variant: 'success', autoHideDuration: 2000});
            dispatch({
                type: types.design.setDesignPrivileges,
                payload: privileges
            });
        });
        return () => {
            socket?.emit('leave-from-design', { user: authState.user, designId: id });
            socket?.off('updateDesign');
            socket?.off('users');
        };
    }, [socket, authState.user, id, dispatch, enqueueSnackbar]);

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };
    
    if(error){
        return (
            <div className={classes.error}>
                <Alert severity='error'>
                    { error }
                </Alert>
            </div>
        );
    }

    if (!design) {
        return (<Typography>Cargando...</Typography>);
    }

    return (
        <>
            <Grid container className={classes.menu} key={design._id}>
                <Grid item xs={12} md={3} lg={2} />
                <Grid item xs={12} md={6} lg={8} className={classes.tabBar}>
                    <Tabs
                        value={tabIndex}
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
            <TabPanel value={tabIndex} index={0}>
                <DesignMetadata />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <DesignWorkspace/>
            </TabPanel>
        </>
    )
}