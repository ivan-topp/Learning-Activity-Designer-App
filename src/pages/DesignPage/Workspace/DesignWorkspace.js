import React from 'react';
import { Box, Button, ButtonGroup, Divider, Fab, Grid, makeStyles, Tooltip, Typography, useMediaQuery } from '@material-ui/core';
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
import { Add } from '@material-ui/icons';
import ObjectID from 'bson-objectid';
//import { scrollToBottomAnimated } from 'utils/scrollToBottom';

const useStyles = makeStyles((theme) => ({
    leftPanel: {
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    workspace: {
        paddingLeft: 15,
        paddingRight: 15,
        position: 'relative',
        background: theme.palette.background.workSpace,
        height: 'auto',
        paddingBottom: theme.spacing(6),
        [theme.breakpoints.up('md')]: {
            height: 'calc(100vh - 177px)',
            overflow: 'auto'
        },
    },
    rightPanel: {
        display: 'flex',
        flexDirection: 'column',
        borderLeft: `1px solid ${theme.palette.divider}`,
    },
    buttonGroupWorkSpace: {
        height: 'auto',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    textLefPanel: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    spaceData: {
        marginBottom: theme.spacing(1),
        borderBottom: `2px solid ${theme.palette.divider}`
    },
    LeftPanelMetadata: {
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2)
    },
    textLefPanelMetadata: {
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
        marginBottom: 15,
        [theme.breakpoints.down('md')]: {
            flexWrap: 'wrap',
        },
    },
    fab: {
        position: 'absolute',
        bottom: 5,
        right: theme.spacing(2),
    }
}));

export const DesignWorkspace = () => {
    const classes = useStyles();
    const { designState } = useDesignState();
    const { design } = designState;
    const { metadata } = design;
    const { socket } = useSocketState();
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const isMediumDevice = useMediaQuery(theme.breakpoints.down('md'));

    const { dispatch } = useUiState();
    let showGraphicLearningType = false;
    let showGraphicFormat = false;
    let showGraphicModality = false;

    const handleSaveDesign = (e) => {
        socket.emit('save-design', { designId: design._id });
        enqueueSnackbar('Su diseño se ha guardado correctamente', { variant: 'success', autoHideDuration: 2000 });
    };
    
    const handleNewUA = () => {
        const id = ObjectID().toString();
        socket.emit('new-learningActivity', { designId: design._id, id });
        //scrollToBottomAnimated('learningActivities');
    };

    const handleOpenModal = () => {
        dispatch({
            type: types.ui.toggleModal,
            payload: 'Share'
        })
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
            <Grid container>
                <Grid item xs={12} md={3} lg={2} className={classes.leftPanel}>
                    <Grid container alignItems='center' justify='center'>
                        <Typography className={classes.textLefPanel}> INFORMACIÓN DISEÑO </Typography>
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
                                    <Typography variant='body2' color='textSecondary' className={classes.textLefPanelMetadata}>Tema</Typography>
                                    <Typography variant='body2'> {metadata.category.name} </Typography>
                                    <Divider />
                                </>
                            )
                            }
                        </Grid>
                        <Grid>
                            {metadata && metadata.workingTime && (
                                <>
                                    <Typography variant="body2" color='textSecondary' className={classes.textLefPanelMetadata}> Tiempo de trabajo </Typography>
                                    <Typography variant="body2"> {metadata.workingTime.hours} : {metadata.workingTime.minutes}</Typography>
                                    <Divider />
                                </>
                            )
                            }
                        </Grid>
                        <Grid>
                            {metadata && metadata.workingTimeDesign && (
                                <>
                                    <Typography variant="body2" color='textSecondary' className={classes.textLefPanelMetadata}>Tiempo de trabajo Diseño</Typography>
                                    <Typography variant="body2"> {metadata.workingTimeDesign}</Typography>
                                    <Divider />
                                </>
                            )
                            }
                        </Grid>
                        <Grid>
                            {metadata && metadata.name && (
                                <>
                                    <Typography variant='body2' color='textSecondary' className={classes.textLefPanelMetadata}> Modo de entrega </Typography>
                                    <Typography variant='body2' > {metadata.name} </Typography>
                                    <Divider />
                                </>
                            )
                            }
                        </Grid>
                        {metadata && metadata.classSize && (
                            <>
                                <Typography variant='body2' color='textSecondary' className={classes.textLefPanelMetadata}> Tamaño de la clase </Typography>
                                <Typography variant='body2'> {metadata.classSize} </Typography>
                                <Divider />
                            </>
                        )
                        }
                        <Grid>
                            {metadata && metadata.priorKnowledge && (
                                <>
                                    <Typography variant='body2' color='textSecondary' className={classes.textLefPanelMetadata}> Conocimiento Previo </Typography>
                                    <Typography variant='body2' > {metadata.priorKnowledge} </Typography>
                                    <Divider />
                                </>
                            )
                            }
                        </Grid>
                        <Grid>
                            {metadata && metadata.description && (
                                <>
                                    <Typography variant='body2' color='textSecondary' className={classes.textLefPanelMetadata}> Descripción </Typography>
                                    <Typography variant='body2'> {metadata.description} </Typography>
                                    <Divider />
                                </>
                            )
                            }
                        </Grid>
                        <Grid>
                            {metadata && metadata.objective && (
                                <>
                                    <Typography color='textSecondary' className={classes.textLefPanelMetadata}> Objetivos </Typography>
                                    <Typography> {metadata.objective} </Typography>
                                    <Divider />
                                </>
                            )
                            }
                        </Grid>
                        <Grid>
                            { /*metadata && metadata.results &&(
                                    <>
                                        <Typography color='textSecondary' className={classes.textLefPanelMetadata}> Resultados </Typography>
                                        <Typography>{ metadata.results }</Typography>
                                        <Divider/>
                                    </>
                                )*/
                            }
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6} lg={8} className={classes.workspace}>
                    <div className={classes.buttonZone}>
                        <ButtonGroup size='small' fullWidth={isMediumDevice} className={classes.buttonGroupWorkSpace}>
                            <Button>Nuevo</Button>
                            <Button onClick={handleOpenModal}>Compartir</Button>
                            <Button onClick={handleSaveDesign}>Guardar</Button>
                        </ButtonGroup>
                    </div>
                    <Box id='learningActivities' className={classes.workSpaceUnits}>
                        <Box>
                            {
                                design.data.learningActivities && design.data.learningActivities.map((learningActivity, index) => <LearningActivity key={`learningActivity-${index}`} index={index} learningActivity={learningActivity} />)
                            }
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
                    <Grid className={classes.graphicsSpacing}>
                        {
                            design.data.learningActivities && design.data.learningActivities.map((learningActivity) =>
                                learningActivity.tasks && learningActivity.tasks.forEach((task) => {
                                    itemsLearningType.forEach((item) => {
                                        if (item.title === task.learningType) {
                                            item.value = item.value + 1;
                                        }
                                    });
                                    itemsLearningTypePie.forEach((item) => {
                                        if (item.title === task.learningType) {
                                            item.value = item.value + 1;
                                        }
                                    });
                                    itemsFormat.forEach((item) => {
                                        if (item.title === task.format) {
                                            item.value = item.value + 1;
                                        }
                                    });
                                    itemsModality.forEach((item) => {
                                        if (item.title === task.modality) {
                                            item.value = item.value + 1;
                                        }
                                    });
                                }))
                        }
                        {showGraphicLearningType &&
                            <div className={classes.betweenGraphics}>
                                <PieGraphic items={itemsLearningTypePie}></PieGraphic>
                            </div>
                        }
                        {showGraphicFormat &&
                            <div className={classes.betweenGraphics}>
                                <Typography>Formato</Typography>
                                <StackedBar items={itemsFormat} type={'Format'} legends={true}></StackedBar>
                            </div>
                        }
                        {showGraphicModality &&
                            <div className={classes.betweenGraphics}>
                                <Typography>Modalidad</Typography>
                                <StackedBar items={itemsModality} type={'Modality'} legends={true}></StackedBar>
                            </div>
                        }
                    </Grid>
                </Grid>
                <ShareModal />
            </Grid>
        </>
    )
}
