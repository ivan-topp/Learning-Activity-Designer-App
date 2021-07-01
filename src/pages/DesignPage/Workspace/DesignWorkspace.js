import React, { createRef, useRef, useState } from 'react';
import { Avatar, Box, Button, ButtonGroup, Card, CardActionArea, Divider, Fab, Grid, makeStyles, Menu, MenuItem, Tooltip, Typography, useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { LearningActivity } from 'pages/DesignPage/Workspace/LearningActivity';
import { useSocketState } from 'contexts/SocketContext';
import { useDesignState } from 'contexts/design/DesignContext';
import { StackedBar } from 'components/StackedBar';
import { PieGraphic } from 'components/PieGraphic';
import { itemsLearningType, itemsFormat, itemsModality, itemsLearningTypePie } from 'assets/resource/items'
import { useUiState } from 'contexts/ui/UiContext';
import { ShareModal } from './ShareModal';
import types from 'types';
import { useSnackbar } from 'notistack';
import { Add, Description, Reorder } from '@material-ui/icons';
import ObjectID from 'bson-objectid';
import { ViewAndDownloadPDFModal } from 'pages/DesignPage/PDF/ViewAndDownloadPDFModal';
import { useUserConfigState } from 'contexts/UserConfigContext';
import { ResourceLinksModal } from './ResourceLinksModal';
import { EvaluationModal } from './EvaluationModal';
import { exportJsonToFile } from 'utils/files';
import { formatName, getUserInitials } from 'utils/textFormatters';
import { Link, useHistory } from 'react-router-dom';
import { useAuthState } from 'contexts/AuthContext';
import { ReorderActivitiesModal } from './ReorderActivitiesModal';
import { useMemo } from 'react';
import { ReorderTasksModal } from './ReorderTaskModal';

const useStyles = makeStyles((theme) => ({
    root: {
        background: theme.palette.background.workSpace,
        minHeight: 'calc(100vh - 412px)',
    },
    leftPanel: {
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${theme.palette.divider}`,
        background: theme.palette.background.paper,
    },
    workspace: {
        paddingLeft: 15,
        paddingRight: 15,
        position: 'relative',
        background: theme.palette.background.workSpace,
        height: 'auto',
        paddingBottom: theme.spacing(6),
        [theme.breakpoints.up('md')]: {
            height: 'calc(100vh - 212px)',
            paddingBottom: theme.spacing(4),
        },
    },
    rightPanel: {
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        borderLeft: `1px solid ${theme.palette.divider}`,
        background: theme.palette.background.paper
    },
    buttonGroupWorkSpace: {
        height: 'auto',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    textLeftPanel: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    spaceData: {
        marginBottom: theme.spacing(1),
        borderBottom: `2px solid ${theme.palette.divider}`
    },
    LeftPanelMetadata: {
        marginTop: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        height: 'auto',
        paddingBottom: theme.spacing(1),
        [theme.breakpoints.up('xs')]: {
            height: 'calc(100vh - 235px)',
            overflow: 'auto'
        },
    },
    textLeftPanelMetadata: {
        marginTop: theme.spacing(3)
    },
    graphicsSpacing: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
    },
    betweenGraphics: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    workSpaceUnits: {
        width: '100%',
        height: 'auto',
        [theme.breakpoints.up('md')]: {
            height: '85%',
            overflow: 'auto',
            overflowX: 'hidden',
        },
    },
    buttonZone: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        [theme.breakpoints.down('md')]: {
            flexWrap: 'wrap',
        },
    },
    fab: {
        position: 'absolute',
        bottom: 5,
        right: theme.spacing(2),
    },
    origin: {
        marginTop: 10,
        marginBottom: 10,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 4,
        cursor: 'pointer',
        userSelect: 'none',
        backgroundColor: theme.palette.background.design,
        '&:hover': {
            boxShadow: '0px 0px 10px 0 #bcc3d6',
            background: theme.palette.background.designHover,
        },
    }
}));

export const DesignWorkspace = () => {
    const classes = useStyles();
    const { designState } = useDesignState();
    const { authState } = useAuthState();
    const history = useHistory();
    const { design } = designState;
    const { metadata } = design;
    const { socket, emitWithTimeout } = useSocketState();
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const isMediumDevice = useMediaQuery(theme.breakpoints.down('md'));
    const { uiState, dispatch } = useUiState();
    const [openMenuPDF, setOpenMenuPDF] = useState(null);
    const imgGraphic = useRef();
    const { userConfig } = useUserConfigState();
    const [pdfView, setPdfView] = useState(false);
    let showGraphicLearningType = false;
    let showGraphicFormat = false;
    let showGraphicModality = false;
    let sumHours = 0;
    let sumMinutes = 0;

    const refs = useMemo(() => {
        return design.data.learningActivities.reduce((activity, value) => {
            activity[value.id] = createRef();
            return activity;
        }, {});
    }, [design.data.learningActivities]);

    const handleSaveDesign = (e) => {
        socket?.emit('save-design', { designId: design._id }, emitWithTimeout(
            (resp) => {
                if (resp.ok && !uiState.userSaveDesign) {
                    dispatch({
                        type: types.ui.setUserSaveDesign,
                        payload: true,
                    })
                }
                enqueueSnackbar(resp.message, { variant: 'success', autoHideDuration: 2000 });
            },
            () => enqueueSnackbar('Error al intentar guardar el diseño. Por favor revise su conexión. Tiempo de espera excedido.', { variant: 'error', autoHideDuration: 2000 }),
        ));
    };

    const handleNewUA = () => {
        const id = ObjectID().toString();
        socket?.emit('new-learningActivity', { designId: design._id, id }, emitWithTimeout(
            (resp) => {
                if (!resp.ok) return enqueueSnackbar(resp.message, { variant: 'error', autoHideDuration: 2000 });
                if (uiState.userSaveDesign) {
                    dispatch({
                        type: types.ui.setUserSaveDesign,
                        payload: false,
                    });
                }

            },
            () => enqueueSnackbar('Error al agregar la nueva actividad de aprendizaje. Por favor revise su conexión. Tiempo de espera excedido.', { variant: 'error', autoHideDuration: 2000 }),
        ));
        dispatch({
            type: types.ui.setScrollToNewActivity,
            payload: true
        });
    };

    const handleOpenModal = () => {
        dispatch({
            type: types.ui.openModal,
            payload: 'Share'
        })
    };

    const handleOpenReorderActivitiesModal = () => {
        dispatch({
            type: types.ui.openModal,
            payload: 'ReorderActivities'
        })
    };

    const handleOpenModalPDF = (type) => {
        setPdfView(true);
        handleCloseMenu();
        dispatch({
            type: types.ui.setPDF,
            payload: type,
        });
        dispatch({
            type: types.ui.openModal,
            payload: 'PDF'
        });
    };

    const resetItems = () => {
        itemsLearningType.forEach((item) => {
            item.value = 0;
        });
        itemsLearningTypePie.forEach((item) => {
            item.value = 0;
        });

        itemsFormat.forEach((item) => {
            item.value = 0;
        });
        itemsModality.forEach((item) => {
            item.value = 0;
        });
    };

    const handleOpenMenu = (event) => {
        setOpenMenuPDF(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpenMenuPDF(null);
    };

    const handleExportToFile = (e) => {
        const designToExport = JSON.parse(JSON.stringify(design));
        designToExport.comments = [];
        designToExport.assessments = [];
        designToExport.folder = '';
        designToExport.origin = designToExport._id;
        designToExport.privileges = [];
        designToExport.owner = '';
        designToExport.metadata.scoreMean = 0;
        for (const learningActivity of designToExport.data.learningActivities) {
            learningActivity.id = ObjectID().toString();
            for (const task of learningActivity.tasks) {
                task.id = ObjectID().toString();
            }
        }
        delete designToExport._id;
        delete designToExport.createdAt;
        delete designToExport.updatedAt;
        delete designToExport.readOnlyLink;
        exportJsonToFile(designToExport, `${design.metadata.name.trim().length === 0 ? 'Diseño sin nombre' : design.metadata.name.trim()}.json`);
        handleCloseMenu();
    };

    const handleOpenDesign = (design) => {
        const inDesign = design.privileges.find(privilege => authState.user.uid === privilege.user._id);
        if (inDesign) {
            const typePrivilegeEditor = design.privileges.find(privilege => authState.user.uid === privilege.user && privilege.type === 0);
            if (typePrivilegeEditor) {
                history.push(`/designs/${design._id}`);
            } else {
                history.push(`/designs/reader/${design._id}`);
            }
        } else if (design.metadata.isPublic) {
            history.push(`/designs/reader/${design._id}`);
        } else {
            enqueueSnackbar('Usted no tiene acceso a este diseño.', { variant: 'error', autoHideDuration: 2000 });
        }
    };

    design.data.learningActivities.forEach((activities) => {
        if (activities.tasks !== undefined) {
            activities.tasks.forEach(task => {
                if (task.learningType !== '' && task.learningType !== 'Seleccionar') {
                    showGraphicLearningType = true;
                }
                if (task.format !== '' && task.format !== 'Seleccionar') {
                    showGraphicFormat = true;
                }
                if (task.modality !== '' && task.modality !== 'Seleccionar') {
                    showGraphicModality = true;
                }
            })
        }
    });

    return (
        <>
            <Grid container className={classes.root}>
                <Grid item xs={12} md={3} lg={2} className={classes.leftPanel}>
                    <Grid container alignItems='center' justify='center'>
                        <Typography className={classes.textLeftPanel}> INFORMACIÓN DISEÑO </Typography>
                    </Grid>
                    <Divider className={classes.spaceData} />
                    <Grid className={classes.LeftPanelMetadata}>
                        <Grid>
                            {metadata && metadata.name && (
                                <>
                                    <Typography variant='body2' color='textSecondary'> Nombre </Typography>
                                    <Typography variant='body2'>{metadata.name}</Typography>
                                    <Divider />
                                </>
                            )
                            }
                        </Grid>
                        <Grid>
                            {metadata && metadata.category && (
                                <>
                                    <Typography variant='body2' color='textSecondary' className={classes.textLeftPanelMetadata}>Tema</Typography>
                                    <Typography variant='body2'> {metadata.category.name} </Typography>
                                    <Divider />
                                </>
                            )
                            }
                        </Grid>
                        <Grid>
                            {metadata && metadata.workingTime && (
                                <>
                                    <Typography variant="body2" color='textSecondary' className={classes.textLeftPanelMetadata}> Tiempo de trabajo </Typography>
                                    <Typography variant="body2"> {metadata.workingTime.hours} (hrs) : {metadata.workingTime.minutes} (min)</Typography>
                                    <Divider />
                                </>
                            )
                            }
                        </Grid>
                        <Grid>
                            {metadata && metadata.workingTimeDesign && (
                                <>
                                    <Typography variant="body2" color='textSecondary' className={classes.textLeftPanelMetadata}>Tiempo de trabajo Diseño</Typography>
                                    <Typography variant="body2"> {metadata.workingTimeDesign.hours} (hrs) : {metadata.workingTimeDesign.minutes} (min)</Typography>
                                    <Divider />
                                </>
                            )
                            }
                        </Grid>
                        <Grid>
                            {metadata && metadata.classSize !== null && (
                                <>
                                    <Typography variant='body2' color='textSecondary' className={classes.textLeftPanelMetadata}> Tamaño de la clase </Typography>
                                    <Typography variant='body2'> {metadata.classSize} </Typography>
                                    <Divider />
                                </>
                            )
                            }
                        </Grid>
                        <Grid>
                            {metadata && metadata.priorKnowledge && (
                                <>
                                    <Typography variant='body2' color='textSecondary' className={classes.textLeftPanelMetadata}> Conocimiento Previo </Typography>
                                    <Typography variant='body2' component={Box}> <pre style={{ fontFamily: 'inherit', margin: 0, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                                        {metadata.priorKnowledge}
                                    </pre></Typography>
                                    <Divider />
                                </>
                            )
                            }
                        </Grid>
                        <Grid>
                            {metadata && metadata.description && (
                                <>
                                    <Typography variant='body2' color='textSecondary' className={classes.textLeftPanelMetadata}> Descripción </Typography>
                                    <Typography variant='body2' component={Box}> <pre style={{ fontFamily: 'inherit', margin: 0, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                                        {metadata.description}
                                    </pre> </Typography>
                                    <Divider />
                                </>
                            )
                            }
                        </Grid>
                        <Grid>
                            {metadata && metadata.evaluation && (
                                <>
                                    <Typography variant='body2' color='textSecondary' className={classes.textLeftPanelMetadata}> Evaluación </Typography>
                                    <Typography variant='body2' component={Box}> <pre style={{ fontFamily: 'inherit', margin: 0, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                                        {metadata.evaluation}
                                    </pre> </Typography>
                                    <Divider />
                                </>
                            )
                            }
                        </Grid>
                        {/*<Grid>
                            {metadata && metadata.objective && (
                                <>
                                    <Typography variant='body2' color='textSecondary' className={classes.textLeftPanelMetadata}> Objetivos </Typography>
                                    <Typography variant='body2' component={Box}> <pre style={{ fontFamily: 'inherit', margin: 0, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                                        {metadata.objective}
                                    </pre> </Typography>
                                    <Divider />
                                </>
                            )
                            }
                        </Grid>
                        */}
                        <Grid>
                            {metadata && metadata.scoreMean !== null && (
                                <>
                                    <Typography variant='body2' color='textSecondary' className={classes.textLeftPanelMetadata}> Valoración media (0 - 5) </Typography>
                                    <Box display='flex' justifyContent='flex-start' alignItems='center'>
                                        {metadata.scoreMean}
                                    </Box>
                                    <Divider />
                                </>
                            )
                            }
                        </Grid>
                        <Grid>
                            {metadata && metadata.results && (
                                <div className={classes.textLeftPanelMetadata}>
                                    {metadata.results.map((result, i) =>
                                        <div key={`learning-result-${i}`} >
                                            <Typography variant='body2' color={'textSecondary'}>Aprendizaje esperado {i + 1}</Typography>
                                            <Typography variant='body2' gutterBottom >{result.verb + ' ' + result.description}</Typography>
                                        </div>
                                    )}
                                    <Divider />
                                </div>
                            )
                            }
                        </Grid>
                        <Grid>
                            {design.origin && (
                                <>
                                    <Typography variant='body2' color='textSecondary' className={classes.textLeftPanelMetadata}> Derivado del diseño: </Typography>
                                    <Card className={classes.origin} elevation={0}>
                                        <CardActionArea onClick={() => handleOpenDesign(design.origin)}>
                                            <Box style={{ display: 'flex', alignItems: 'center', padding: 5 }}>
                                                <Description style={{ marginBottom: 5 }} />
                                                <Typography style={{ marginLeft: 10 }} variant='body2'>{design.origin.metadata.name}</Typography>
                                            </Box>
                                        </CardActionArea>
                                        <Divider />
                                        <CardActionArea component={Link} to={`/profile/${design.origin.owner._id}`}>
                                            <Box style={{ display: 'flex', alignItems: 'center', padding: 5 }}>
                                                <Avatar
                                                    style={{ width: 25, height: 25, fontSize: 15 }}
                                                    alt={formatName(design.origin.owner.name, design.origin.owner.lastname)}
                                                    src={design.origin.owner.img && design.origin.owner.img.length > 0 ? `${process.env.REACT_APP_URL}uploads/users/${design.origin.owner.img}` : ''}
                                                >
                                                    {getUserInitials(design.origin.owner.name, design.origin.owner.lastname)}
                                                </Avatar>
                                                <Typography style={{ marginLeft: 10 }} variant='body2'>{formatName(design.origin.owner.name, design.origin.owner.lastname)}</Typography>
                                            </Box>
                                        </CardActionArea>

                                    </Card>
                                </>
                            )
                            }
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6} lg={8} className={classes.workspace}>
                    <div className={classes.buttonZone}>
                        <Menu
                            variant={'selectedMenu'}
                            anchorEl={openMenuPDF}
                            keepMounted
                            open={Boolean(openMenuPDF)}
                            onClose={handleCloseMenu}
                        >
                            <MenuItem onClick={() => handleOpenModalPDF('teacher')}>PDF Docente</MenuItem>
                            <MenuItem onClick={() => handleOpenModalPDF('student')}>PDF Estudiante</MenuItem>
                            <MenuItem onClick={handleExportToFile}>Respaldar Diseño</MenuItem>
                        </Menu>
                        <ButtonGroup fullWidth={isMediumDevice} className={classes.buttonGroupWorkSpace}>
                            <Button onClick={handleOpenMenu}>Exportar</Button>
                            <Button onClick={handleOpenModal}>Compartir</Button>
                            <Button onClick={handleSaveDesign}>Guardar</Button>
                        </ButtonGroup>
                        {
                            designState.users.length > 1
                                ? <Tooltip title='Esta función no esta disponible de manera colaborativa, debe haber 1 solo usuario conectado.' arrow>
                                    <Box>
                                        <Button
                                            size='small'
                                            fullWidth={isMediumDevice}
                                            style={{ height: 36 }}
                                            variant='outlined'
                                            disabled={designState.users.length > 1}
                                            onClick={handleOpenReorderActivitiesModal}
                                            >
                                            <Reorder style={{ marginRight: 10 }} /> Ordenar Actividades
                                        </Button>
                                    </Box>
                                </Tooltip>
                                : <Button
                                    size='small'
                                    fullWidth={isMediumDevice}
                                    style={{ height: 36 }}
                                    variant='outlined'
                                    disabled={designState.users.length > 1}
                                    onClick={handleOpenReorderActivitiesModal}
                                >
                                    <Reorder style={{ marginRight: 10 }} /> Ordenar Actividades
                                </Button>
                        }
                    </div>
                    <Box id='learningActivities' className={classes.workSpaceUnits}>
                        <Box>
                            <Grid className={classes.workSpaceUnits}>
                                <Grid >
                                    {
                                        design.data.learningActivities && design.data.learningActivities.map((learningActivity, index) =>
                                            <LearningActivity key={`learningActivity-${learningActivity.id}-${index}`} refActivity={refs[learningActivity.id]} index={index} learningActivity={learningActivity} sumHours={sumHours} sumMinutes={sumMinutes} />
                                        )}
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <Tooltip title='Agregar actividad de aprendizaje' arrow>
                        <Fab color="primary" className={classes.fab} onClick={handleNewUA}>
                            <Add />
                        </Fab>
                    </Tooltip>
                </Grid>
                <Grid item xs={12} md={3} lg={2} className={classes.rightPanel}>
                    {resetItems()}
                    <div style={{ position: 'absolute', zIndex: 1, width: '100%' }}>
                        <Grid className={classes.graphicsSpacing} >
                            {
                                design.data.learningActivities && design.data.learningActivities.map((learningActivity) =>
                                    learningActivity.tasks && learningActivity.tasks.forEach((task) => {
                                        itemsLearningType.forEach((item) => {
                                            if (item.title === task.learningType) {
                                                item.minutes = (task.duration.hours * 60) + task.duration.minutes;
                                                item.value = item.value + item.minutes;
                                            }
                                        });
                                        itemsLearningTypePie.forEach((item) => {
                                            if (item.title === task.learningType) {
                                                item.minutes = (task.duration.hours * 60) + task.duration.minutes;
                                                item.value = item.value + item.minutes;
                                            }
                                        });
                                        itemsFormat.forEach((item) => {
                                            if (item.title === task.format) {
                                                item.minutes = (task.duration.hours * 60) + task.duration.minutes;
                                                item.value = item.value + item.minutes;
                                            }
                                        });
                                        itemsModality.forEach((item) => {
                                            if (item.title === task.modality) {
                                                item.minutes = (task.duration.hours * 60) + task.duration.minutes;
                                                item.value = item.value + item.minutes;
                                            }
                                        });
                                    }))
                            }
                            {showGraphicLearningType &&
                                <div className={classes.betweenGraphics} >
                                    <PieGraphic items={itemsLearningTypePie} colorGraphicToPdf={true}></PieGraphic>
                                </div>
                            }
                            {showGraphicFormat &&
                                <div className={classes.betweenGraphics}>
                                    <Typography>Formato</Typography>
                                    <StackedBar items={itemsFormat} type={'Format'} legends={true} colorGraphicToPdf={true} ></StackedBar>
                                </div>
                            }
                            {showGraphicModality &&
                                <div className={classes.betweenGraphics}>
                                    <Typography>Modalidad</Typography>
                                    <StackedBar items={itemsModality} type={'Modality'} legends={true} colorGraphicToPdf={true}></StackedBar>
                                </div>
                            }
                        </Grid>
                    </div>
                    <div style={{ zIndex: 0, width: '100%' }}>
                        <Grid className={classes.graphicsSpacing} ref={imgGraphic}>
                            {
                                design.data.learningActivities && design.data.learningActivities.map((learningActivity) =>
                                    learningActivity.tasks && learningActivity.tasks.forEach((task) => {
                                        itemsLearningType.forEach((item) => {
                                            if (item.title === task.learningType) {
                                                item.minutes = (task.duration.hours * 60) + task.duration.minutes;
                                                item.value = item.value + item.minutes;
                                            }
                                        });
                                        itemsLearningTypePie.forEach((item) => {
                                            if (item.title === task.learningType) {
                                                item.minutes = (task.duration.hours * 60) + task.duration.minutes;
                                                item.value = item.value + item.minutes;
                                            }
                                        });
                                        itemsFormat.forEach((item) => {
                                            if (item.title === task.format) {
                                                item.minutes = (task.duration.hours * 60) + task.duration.minutes;
                                                item.value = item.value + item.minutes;
                                            }
                                        });
                                        itemsModality.forEach((item) => {
                                            if (item.title === task.modality) {
                                                item.minutes = (task.duration.hours * 60) + task.duration.minutes;
                                                item.value = item.value + item.minutes;
                                            }
                                        });
                                    }))
                            }
                            {showGraphicLearningType &&
                                <div className={classes.betweenGraphics}>
                                    <PieGraphic items={itemsLearningTypePie} colorGraphicToPdf={false}></PieGraphic>
                                </div>
                            }
                            {showGraphicFormat &&
                                <div className={classes.betweenGraphics}>
                                    {
                                        userConfig.darkTheme ? <Typography style={{ color: '#000000' }}>Formato</Typography> : <Typography >Formato</Typography>
                                    }

                                    <StackedBar items={itemsFormat} type={'Format'} legends={true} colorGraphicToPdf={false}></StackedBar>
                                </div>
                            }
                            {showGraphicModality &&
                                <div className={classes.betweenGraphics}>
                                    {
                                        userConfig.darkTheme ? <Typography style={{ color: '#000000' }}>Modalidad</Typography> : <Typography >Modalidad</Typography>
                                    }
                                    <StackedBar items={itemsModality} type={'Modality'} legends={true} colorGraphicToPdf={false} ></StackedBar>
                                </div>
                            }
                        </Grid>
                    </div>
                </Grid>
                <ShareModal />
                <ReorderActivitiesModal />
                <ReorderTasksModal />
                {
                    (pdfView) &&
                    <ViewAndDownloadPDFModal imgGraphic={imgGraphic} setPdfView={setPdfView} />
                }
                {
                    (uiState.isResourceModalOpen) &&
                    <ResourceLinksModal />
                }
                {
                    (uiState.isEvaluationModalOpen) &&
                    <EvaluationModal />
                }
            </Grid>
        </>
    )
}
