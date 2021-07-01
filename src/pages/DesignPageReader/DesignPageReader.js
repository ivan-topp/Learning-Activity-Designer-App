import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, makeStyles, Tabs, Tab, Typography, Backdrop, Box, Button } from '@material-ui/core';
import { useSocketState } from 'contexts/SocketContext';
import { useAuthState } from 'contexts/AuthContext';
import { TabPanel } from 'components/TabPanel';
import { useDesignState } from 'contexts/design/DesignContext';
import types from 'types';
import { Alert } from '@material-ui/lab';
import { DesignReader } from './DesignReader/DesignReader';
import { Description, Star } from '@material-ui/icons';
import { AssessmentModal } from 'components/AssessmentModal';
import { useUiState } from 'contexts/ui/UiContext';
import { DesignComments } from 'components/DesignComments';

const useStyles = makeStyles((theme) => ({
    leftPanel: {
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    comments: {
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        background: theme.palette.background.workSpace,
        minHeight: 'calc(100vh - 177px)',
    },
    rightPanel: {
        display: 'flex',
        flexDirection: 'column',
        borderLeft: `1px solid ${theme.palette.divider}`,
    },
    menu: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    tabBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
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

export const DesignPageReader = () => {
    const classes = useStyles();
    const { id } = useParams();
    const isMounted = useRef(true);
    const { socket, online, emitWithTimeout } = useSocketState();
    const { authState } = useAuthState();
    const { designState, dispatch } = useDesignState();
    const { dispatch: uiDispatch } = useUiState();
    const [ tabIndex, setTabIndex ] = useState(0);
    const { design } = designState;
    const [error, setError] = useState(null);

    useEffect(() => {
        if (online) {
            socket?.emit('join-to-design', { user: authState.user, designId: id, public: true }, emitWithTimeout(
                (res) => {
                    if (res.ok){
                        if(isMounted.current) {
                            dispatch({
                                type: types.design.updateDesign,
                                payload: res.data.design
                            });
                        }
                    } 
                    else setError(res.message);
                },
                () => {
                    setError('Error al intentar ingresar al diseño. Por favor revise su conexión. Tiempo de espera excedido.');
                },
            ));
        }
    }, [socket, authState.user, online, id, dispatch, emitWithTimeout]);

    useEffect(() => {
        socket?.on('update-design-rate', ({assessments, mean}) => {
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
            socket?.off('update-design-rate');
            socket?.off('comment-design');
            socket?.off('delete-comment');
        };
    }, [socket, dispatch]);

    useEffect(() => {
        return () => {
            socket?.emit('leave-from-design', { user: authState.user, designId: id });
        }
    }, [socket, authState.user, id]);

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };
    
    if(error){
        return (
            <div className={classes.error}>
                <Alert severity='error' variant='outlined'>
                    { error }
                </Alert>
            </div>
        );
    }

    if (!design) {
        return (
            <Backdrop className={classes.backdrop} open={true}>
                <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box width={300} height={300} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Description className={classes.loadingFile} />
                    </Box>
                    <Typography>Cargando Diseño de Aprendizaje...</Typography>
                </Box>
            </Backdrop>
        );
    }

    const handleOpenAssessmentModal = () => {
        uiDispatch({
            type: types.ui.openModal,
            payload: 'Assessment',
        });
    };

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
                        <Tab label="DISEÑO" {...a11yProps(0)} />
                        <Tab label="COMENTARIOS" {...a11yProps(1)} />
                    </Tabs>
                    { 
                        authState.user && authState.user.uid !== design.owner && <Button variant='outlined' color='default' onClick={handleOpenAssessmentModal}>
                            <Star style={{marginRight: 10, marginTop: -3}}/> Valorar Diseño
                        </Button>
                    }
                </Grid>
                <Grid item xs={12} md={3} lg={2} ></Grid>
            </Grid>
            <TabPanel value={tabIndex} index={0} >
                <DesignReader />
            </TabPanel>
            <TabPanel value={tabIndex} index={1} >
                <Grid container>
                    <Grid item xs={12} md={3} lg={2} className={classes.leftPanel}></Grid>
                    <Grid item xs={12} md={6} lg={8} className={classes.comments}>
                        <DesignComments />
                    </Grid>
                    <Grid item xs={12} md={3} lg={2} className={classes.rightPanel}></Grid>
                </Grid>
            </TabPanel>
            <AssessmentModal />
        </>
    )
}