import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, makeStyles, Avatar, Tabs, Tab, Typography, Backdrop, Box } from '@material-ui/core';
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
import { useSharedDocContext } from 'contexts/SharedDocContext';
import { Description } from '@material-ui/icons';

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
        minHeight: 'calc(100vh - 128px)'
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
    },
    error: {
        display: 'flex',
        justifyContent: 'center',
        padding: 20,
        alignItems: 'start',
        minHeight: 'calc(100vh - 128px)',
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    loadingFile: {
        '-webkit-backface-visibility': 'hidden',
        animation: `$spinAndScale 3000ms ${theme.transitions.easing.easeInOut}`,
        animationIterationCount: 'infinite',
        animationDirection: 'alternate',
    },
    "@keyframes spinAndScale": {
        from: {
            height: 300,
            width: 300,
            transform: 'rotate(0deg)',
        },
        to: {
            height: 150,
            width: 150,
            transform: 'rotate(360deg)',
        }
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
    const isMounted = useRef(true);
    const metadataRef = useRef();
    const { id } = useParams();
    const { doc, provider, connectToDesign, clearDoc } = useSharedDocContext();
    const { authState } = useAuthState();
    const { socket, online } = useSocketState();
    const [users, setUsersList] = useState([]);
    const [tabIndex, setTabIndex] = useState(0);
    const { designState, dispatch } = useDesignState();
    const { design } = designState;
    const [error, setError] = useState(null);

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

    useEffect(() => {
        prefetchBloomCategories();
        prefetchBloomVerbs();
    }, [prefetchBloomCategories, prefetchBloomVerbs]);

    useEffect(() => {
        let metadataComponent = metadataRef.current;
        return () => {
            metadataComponent?.clearEditors();
            clearDoc();
            isMounted.current = false;
        };
    }, [clearDoc]);

    useEffect(() => {
        if (online) {
            socket?.emit('join-to-design', { user: authState.user, designId: id, public: false }, (res) => {
                if (res.data) {
                    const userInPrivileges = res.data.design.privileges.find(privilege => privilege.user._id === authState.user.uid);
                    if (res.ok && userInPrivileges && userInPrivileges.type === 0) {
                        if (isMounted.current) {
                            dispatch({
                                type: types.design.updateDesign,
                                payload: res.data.design
                            });
                            connectToDesign(id);
                        }
                    } else {
                        setError(res.message)
                    };

                } else {
                    setError(res.message)
                };
            });
        }
    }, [socket, authState.user, authState._id, online, id, dispatch, connectToDesign]);

    useEffect(() => {
        socket?.on('update-design', (newDesign) => {
            if (isMounted.current) {
                dispatch({
                    type: types.design.updateDesign,
                    payload: newDesign
                });
            }
        });
        socket?.on('add-design-keyword', (keyword) => {
            if (isMounted.current) {
                dispatch({
                    type: types.design.addDesignKeyword,
                    payload: keyword,
                });
            }
        });
        socket?.on('remove-design-keyword', (keyword) => {
            if (isMounted.current) {
                dispatch({
                    type: types.design.removeDesignKeyword,
                    payload: keyword,
                });
            }
        });
        socket?.on('edit-metadata-field', ({ field, value, subfield }) => {
            if (isMounted.current) {
                dispatch({
                    type: types.design.changeMetadataField,
                    payload: { field, value, subfield },
                });
            }
        });
        socket?.on('edit-task-field', ({ learningActivityID, taskID, field, value, subfield }) => {
            if (isMounted.current) {
                dispatch({
                    type: types.design.changeTaskField,
                    payload: { learningActivityID, taskID, field, value, subfield },
                });
            }
        });
        socket?.on('users', (users) => {
            if (isMounted.current) setUsersList(users);
        });
        socket?.on('change-design-privileges', (privileges) => {
            dispatch({
                type: types.design.setDesignPrivileges,
                payload: privileges
            });
        });
        socket?.on('change-read-only-link', (newLink) => {
            if (isMounted.current) {
                dispatch({
                    type: types.design.updateReadOnlyLink,
                    payload: newLink
                });
            }
        });
        return () => {
            socket?.emit('leave-from-design', { user: authState.user, designId: id });
            socket?.off('updateDesign');
            socket?.off('edit-metadata-field');
            socket?.off('add-design-keyword');
            socket?.off('remove-design-keyword');
            socket?.off('change-read-only-link');
            socket?.off('edit-task-field');
            socket?.off('users');
        };
    }, [socket, authState.user, id, dispatch]);

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    if (error) {
        return (
            <div className={classes.error}>
                <Alert severity='error'>
                    {error}
                </Alert>
            </div>
        );
    }

    if (!design || !doc || !provider) {
        return (<Box className={classes.workspace}>
            <Backdrop className={classes.backdrop} open={true}>
                <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box width={300} height={300} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Description className={classes.loadingFile} />
                    </Box>
                    
                    <Typography>Cargando Diseño de Aprendizaje...</Typography>
                </Box>
            </Backdrop>
        </Box>);
    }

    return (
        <>
            <Grid container className={classes.menu} key={design._id}>
                <Grid item xs={12} md={1} lg={2} />
                <Grid item xs={12} md={6} lg={8} className={classes.tabBar}>
                    <Tabs
                        value={tabIndex}
                        onChange={handleChange}
                        aria-label="full width tabs example"
                    >
                        <Tab label="METADATOS" {...a11yProps(0)} />
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
                <DesignMetadata ref={metadataRef} />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <DesignWorkspace />
            </TabPanel>
        </>
    )
}