import React, { useEffect, useRef, useState } from 'react';
import { Backdrop, Box, Button, Grid, makeStyles, Tab, Tabs, Typography } from '@material-ui/core';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import { getDesignByLink } from 'services/DesignService';
import { DesignReader } from 'pages/DesignPageReader/DesignReader/DesignReader';
import { useDesignState } from 'contexts/design/DesignContext';
import { TabPanel } from 'components/TabPanel';
import types from 'types';
import { Alert } from '@material-ui/lab';
import { Description, Star } from '@material-ui/icons';
import { useAuthState } from 'contexts/AuthContext';
import { AssessmentModal } from 'components/AssessmentModal';
import { useSocketState } from 'contexts/SocketContext';
import { useUiState } from 'contexts/ui/UiContext';
import { DesignComments } from 'components/DesignComments';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: 'calc(100vh - 128px)',
    },
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
    content: {
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

export const SharedLinkPage = () => {
    const classes = useStyles();
    const urlparams = useParams();
    const isMounted = useRef(true);
    const { socket, online, emitWithTimeout } = useSocketState();
    const { authState } = useAuthState();
    const { designState, dispatch } = useDesignState();
    const { dispatch: uiDispatch } = useUiState();
    const [ tabIndex, setTabIndex ] = useState(0);
    const { design } = designState;
    const [errorSocket, setErrorSocket] = useState(null);
    const [id, setId] = useState(null);

    useEffect(() => {
        if(authState.user){
            if(online && id){
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
                        else setErrorSocket(res.message);
                    },
                    () => {
                        setErrorSocket('Error al intentar ingresar al diseño. Por favor revise su conexión. Tiempo de espera excedido.');
                    },
                ));
            }
        }
    }, [socket, authState.user, online, dispatch, id, emitWithTimeout]);

    useEffect(() => {
        return () => {
            if(authState.user){
                socket?.emit('leave-from-design', { user: authState.user, designId: id });
            }
        }
    }, [socket, authState.user, id]);
    
    useEffect(() => {
        if(authState.user){
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
        }
        return () => {
            if(authState.user) {
                socket?.off('update-design-rate');

            }
            socket?.off('comment-design');
            socket?.off('delete-comment');
        };
    }, [socket, dispatch, authState.user]);

    const { isLoading, isError, error, data } = useQuery(['shared-design-by-link', urlparams.link], async () => {
        const resp = await getDesignByLink({ link: urlparams.link });
        if(authState.user) {
            setId(resp.design._id);
            return resp;
        }
        dispatch({
            type: types.design.updateDesign,
            payload: resp.design,
        });
        return resp;
    }, { refetchOnWindowFocus: false });

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const renderError = () => {
        return <div className={classes.error}>
            <Alert severity='error'>
                {error.message}
            </Alert>
        </div>;
    };

    const handleOpenAssessmentModal = () => {
        uiDispatch({
            type: types.ui.toggleModal,
            payload: 'Assessment',
        });
    };

    const renderContent = () => {
        return <>
            <Grid container className={classes.content} key={data.design._id}>
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
                            <Star style={{ marginRight: 10, marginTop: -3 }} /> Valorar Diseño</Button>
                    }
                </Grid>
                <Grid item xs={12} md={3} lg={2}></Grid>
            </Grid>
            <TabPanel value={tabIndex} index={0} >
                <DesignReader type='shared-link' />
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
            { authState.user && <AssessmentModal /> }
        </>;
    };

    const renderLoading = () => {
        return (
            <Backdrop className={classes.backdrop} open={true}>
                <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box width={300} height={300} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Description className={classes.loadingFile} />
                    </Box>

                    <Typography>Cargando Diseño de Aprendizaje...</Typography>
                </Box>
            </Backdrop>
        );
    };

    const renderNotFoundMessage = () => {
        return <div className={classes.error}>
            <Alert severity='error'>
                No se ha encontrado diseño.
            </Alert>
        </div>;
    };

    return (
        <div className={classes.root}>
            {
                isError || errorSocket
                    ? renderError()
                    : isLoading || !design
                        ? renderLoading()
                        : data.design === {}
                                ? renderNotFoundMessage()
                                : renderContent()
            }
        </div>
    )
}
