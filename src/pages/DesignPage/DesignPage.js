import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, makeStyles, Avatar, Tabs, Tab, Typography, Backdrop, Box, useTheme, useMediaQuery, Divider } from '@material-ui/core';
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
import { Description, Group } from '@material-ui/icons';
import { useUiState } from 'contexts/ui/UiContext';
import { CheckSaveDesignModal } from './Workspace/CheckSaveDesignModal';
import { DesignComments } from 'components/DesignComments';
import { CustomMenu } from 'components/CustomMenu';

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
        minHeight: 'calc(100vh - 128px)',
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
    tabBarGrid: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        [theme.breakpoints.down('xs')]: {
            justifyContent: 'center'
        }
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
        zIndex: 1000,
        color: '#fff',
    },
    loadingFile: {
        '-webkit-backface-visibility': 'hidden',
        animation: `$spinAndScale 3000ms ${theme.transitions.easing.easeInOut}`,
        animationIterationCount: 'infinite',
        animationDirection: 'alternate',
    },
    comments: {
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        background: theme.palette.background.workSpace,
        minHeight: 'calc(100vh - 177px)',
    },
    user: {
        display: 'flex',
        alignItems: 'center',
        marginTop: 10,
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
    const { id } = useParams();
    const theme = useTheme();
    const isSmDevice = useMediaQuery(theme.breakpoints.down('sm'));
    const isXsDevice = useMediaQuery(theme.breakpoints.down('xs'));
    const { doc, provider, connectToDesign, clearDoc, connected, user } = useSharedDocContext();
    const { authState } = useAuthState();
    const { socket, online, emitWithTimeout } = useSocketState();
    const { designState, dispatch } = useDesignState();
    const { uiState } = useUiState();
    const [users, setUsersList] = useState([]);
    const [tabIndex, setTabIndex] = useState(0);
    const [error, setError] = useState(null);
    const { design } = designState;
    const isMounted = useRef(true);
    const metadataRef = useRef();
    const evaluationPatternRef = useRef();
    const tabsRef = useRef();
    const gridWorkspaceRef = useRef();

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
            dispatch({
                type: types.design.updateDesign,
                payload: null,
            });
        };
    }, [clearDoc, dispatch]);
    
    useEffect(() => {
        if (online) {
            socket?.emit('join-to-design', { user: authState.user, designId: id, public: false }, emitWithTimeout(
                (res) => {
                    if (res.ok) {
                        const userInPrivileges = res.data.design.privileges.find(privilege => privilege.user._id === authState.user.uid);
                        if (userInPrivileges && userInPrivileges.type === 0) {
                            if (isMounted.current) {
                                dispatch({
                                    type: types.design.updateDesign,
                                    payload: res.data.design,
                                });
                                connectToDesign(id);
                            }
                        } else {
                            setError('Ha ocurrido un error, el diseño no existe o usted no tiene privilegios para editar este diseño.');
                        };
    
                    } else {
                        setError(res.message);
                    };
                },
                () => {
                    setError('Error al intentar ingresar al diseño. Por favor revise su conexión. Tiempo de espera excedido.');
                },
            ));
        }
    }, [socket, authState.user, online, id, dispatch, connectToDesign, emitWithTimeout]);

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
        socket?.on('reorder-activities', (newOrder) => {
            if (isMounted.current) {
                dispatch({
                    type: types.design.reorderActivities,
                    payload: newOrder,
                });
            }
        });
        socket?.on('reorder-tasks', ({learningActivityId, newOrder}) => {
            if (isMounted.current) {
                dispatch({
                    type: types.design.reorderTasks,
                    payload: { learningActivityId, newOrder },
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
            if (isMounted.current) {
                setUsersList(users);
                dispatch({
                    type: types.design.setConnectedUsers,
                    payload: users,
                });
            }
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
        socket?.on('update-design-rate', ({ assessments, mean }) => {
            if (isMounted.current) {
                dispatch({
                    type: types.design.setAssessments,
                    payload: assessments,
                });
                dispatch({
                    type: types.design.setScoreMean,
                    payload: mean,
                });
            }
        });
        socket?.on('comment-design', (commentary) => {
            if (isMounted.current) {
                dispatch({
                    type: types.design.commentDesign,
                    payload: commentary,
                });
            }
        });

        socket?.on('delete-comment', (commentaryId) => {
            if (isMounted.current) {
                dispatch({
                    type: types.design.deleteComment,
                    payload: commentaryId,
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
            socket?.off('update-design-rate');
            socket?.off('comment-design');
            socket?.off('reorder-tasks');
            socket?.off('reorder-activities');
            socket?.off('delete-comment');
        };
    }, [socket, authState.user, id, dispatch]);

    const handleChange = (event, newValue) => {
        if (evaluationPatternRef.current && evaluationPatternRef?.current.editing) evaluationPatternRef.current.handleSave();
        setTabIndex(newValue);
    };

    useEffect(() => {
        if (!uiState.userSaveDesign) {
            window.onbeforeunload = function (e) {
                return '¿Seguro que quieres salir?'
            };
        }
        return () => window.onbeforeunload = null;
    }, [uiState]);

    if (error) {
        return (
            <div className={classes.error}>
                <Alert severity='error' variant='outlined'>
                    {error}
                </Alert>
            </div>
        );
    }

    if (!design || !doc || !provider || !user) {
        return (<Box className={classes.workspace}>
            <Backdrop className={classes.backdrop} open={true}>
                <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box width={300} height={300} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Description className={classes.loadingFile} />
                    </Box>

                    <Typography>Cargando Diseño de Aprendizaje...</Typography>
                </Box>
            </Backdrop>
        </Box>);
    }

    const renderConnectedUsersButtonMenu = () => {
        return <div className={classes.usersConnecteds}>
            <CustomMenu Icon={<Group />} text={users.length}>
                <Typography style={{ paddingLeft: 10, paddingTop: 5 }} gutterBottom>Usuarios conectados</Typography>
                <Divider />
                <Box style={{ padding: 10 }}>
                    {renderConnectedUserList()}
                </Box>
            </CustomMenu>
        </div>;
    };

    const renderConnectedUserList = () => {
        return users.map((user, index) => {
            return <Box key={user.uid + index} className={classes.user}>
                <Avatar
                    style={{ border: `3px solid ${user.color}`, backgroundColor: user.color, marginRight: 10 }}
                    alt={formatName(user.name, user.lastname)}
                    src={user.img && user.img.length > 0 ? `${process.env.REACT_APP_URL}uploads/users/${user.img}` : ''}
                >
                    {getUserInitials(user.name, user.lastname)}
                </Avatar>
                <Box>
                    <Typography color='textPrimary'>{user.name + ' ' + user.lastname}</Typography>
                    <Typography color="textSecondary">{user.privilege}</Typography>
                </Box>
            </Box>;
        });
    };

    return (
        <>
            <Grid container className={classes.menu} key={design._id}>
                <Grid item xs={12} >
                    <Box width='100%' height='100%' display='flex' justifyContent='flex-end' alignItems='center'>
                        {
                            isXsDevice && renderConnectedUsersButtonMenu()
                        }
                    </Box>
                </Grid>
                <Grid item xs={12} md={3} lg={2} />
                <Grid ref={gridWorkspaceRef} item xs={12} md={6} lg={8} className={classes.tabBarGrid}>
                    <Tabs
                        ref={tabsRef}
                        value={tabIndex}
                        onChange={handleChange}
                        aria-label="full width tabs example"
                    >
                        <Tab label="METADATOS" {...a11yProps(0)} />
                        <Tab label="DISEÑO" {...a11yProps(1)} />
                        <Tab label="COMENTARIOS" {...a11yProps(2)} />
                    </Tabs>
                    {
                        !isXsDevice && isSmDevice && renderConnectedUsersButtonMenu()
                    }
                </Grid>
                <Grid item xs={12} md={3} lg={2}>
                    <Box width='100%' height='100%' display='flex' justifyContent='flex-end' alignItems='center'>
                        {
                            !isXsDevice && !isSmDevice && renderConnectedUsersButtonMenu()
                        }
                    </Box>
                </Grid>
            </Grid>
            <TabPanel value={tabIndex} index={0}>
                <DesignMetadata ref={metadataRef} evaluationPatternRef={evaluationPatternRef} />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <DesignWorkspace />
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
                <Grid container>
                    <Grid item xs={12} md={3} lg={2} className={classes.leftPanel}></Grid>
                    <Grid item xs={12} md={6} lg={8} className={classes.comments}>
                        <DesignComments />
                    </Grid>
                    <Grid item xs={12} md={3} lg={2} className={classes.rightPanel}></Grid>
                </Grid>
            </TabPanel>
            {
                (uiState.isCheckSaveDesignModalOpen) && <CheckSaveDesignModal />
            }
            <Backdrop className={classes.backdrop} open={!online || !connected}>
                <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box width={300} height={300} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Description className={classes.loadingFile} />
                    </Box>

                    <Typography align='center'>Se ha perdido la conexión con el servidor. Intentando reconectar...</Typography>
                </Box>
            </Backdrop>
        </>
    )
}