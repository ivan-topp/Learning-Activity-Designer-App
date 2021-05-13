import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Box, Checkbox, Divider, Fab, FormControlLabel, Grid, IconButton, makeStyles, Menu, MenuItem, Paper, TextField, Tooltip, Typography, useMediaQuery, useTheme } from '@material-ui/core'
import { Task } from 'pages/DesignPage/Workspace/Task';
import { useSocketState } from 'contexts/SocketContext';
import { StackedBar } from 'components/StackedBar';
import { useForm } from 'hooks/useForm';
import { useDesignState } from 'contexts/design/DesignContext';
import { SharedTextFieldTipTapEditor } from 'components/SharedTextFieldTipTapEditor';
import { useUiState } from 'contexts/ui/UiContext';
import types from 'types';
import { useSnackbar } from 'notistack';
import { itemsLearningType } from 'assets/resource/items'
import { Add, Delete, ListAlt, MoreVert } from '@material-ui/icons';
import ObjectID from 'bson-objectid';

const useStyles = makeStyles((theme) => ({
    unitSpacing: {
        marginBottom: theme.spacing(3),
    },
    titleUnitSpacing: {
        display: 'flex',
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: theme.spacing(1),
    },
    graphicUnitSpacing: {
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing(1),
    },
    trashIcon: {
        marginLeft: "auto",
    },
    spacingDescriptionlearningActivity: {
        marginTop: theme.spacing(1),
    },
    spacingDescription: {
        marginTop: theme.spacing(2),
        marginRight: theme.spacing(2)
    },
    spacingLinkedResults: {
        marginTop: theme.spacing(2),
    },
    buttonPos: {
        marginTop: theme.spacing(1),
        marginLeft: "auto",
    },
    gridTask: {
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(1),
    },
    descriptionContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(1),
    },
    learningResultList: {
        display: 'flex',
        flexWrap: 'nowrap',
        flexDirection: 'column',
        paddingLeft: 15,
        maxHeight: 200,
        overflow: 'auto',
        overflowX: true,
    },
    delete: {
        alignSelf: 'center',
        justifySelf: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing(-5),
        right: theme.spacing(2),
    },
    taskContainer: {
        position: 'relative', 
        marginBottom: theme.spacing(6),
    },
    ellipsis: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
}));

export const LearningActivity = forwardRef(({ index, learningActivity, sumHours, sumMinutes, toLastActivity}, ref) => {
    const classes = useStyles();
    const { designState } = useDesignState();
    const { design } = designState;
    const { socket, emitWithTimeout } = useSocketState();
    const { uiState, dispatch } = useUiState();
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const isXSDevice = useMediaQuery(theme.breakpoints.down('xs'));
    const [isMenuOpen, setMenuOpen] = useState(null);
    
    const titleRef = useRef();
    const descriptionRef = useRef();
    const taskRefs = useRef([]);
    
    const [form, handleInputChange, , setValues] = useForm({
        title: learningActivity.title,
        description: learningActivity.description,
    });

    useEffect(() => {
        setValues({
            title: learningActivity.title,
            description: learningActivity.description,
        });
    }, [design, setValues, learningActivity]);

    const { title, description } = form;
    
    const handleDeleteUnit = () => {
        if (title === "" && description === "" && learningActivity.learningResults.length === 0 && (learningActivity.tasks === undefined || learningActivity.tasks.length === 0)) {
            taskRefs?.current?.forEach(task => task?.clearTexts());
            titleRef?.current?.clearText();
            descriptionRef?.current?.clearText();
            socket?.emit('delete-learningActivity', { designId: design._id, learningActivityID: learningActivity.id }, emitWithTimeout(
                (resp) => {
                    if(resp.ok && uiState.userSaveDesign){
                        dispatch({
                            type: types.ui.setUserSaveDesign,
                            payload: false,
                        });
                    }
                    return enqueueSnackbar(resp.message, { variant: resp.ok ? 'success': 'error', autoHideDuration: 2000 });
                },
                () => enqueueSnackbar('Error al eliminar la actividad. Por favor revise su conexión. Tiempo de espera excedido.', { variant: 'error', autoHideDuration: 2000 }),
            ));
        } else {
            dispatch({
                type: types.ui.setConfirmData,
                payload: {
                    type: 'actividad',
                    args: { designId: design._id, learningActivityID: learningActivity.id },
                    actionMutation: null,
                }
            });
            dispatch({
                type: types.ui.toggleModal,
                payload: 'Confirmation',
            });
        }
        if(uiState.userSaveDesign){
            dispatch({
                type: types.ui.setUserSaveDesign,
                payload: false,
            })
        };
    };

    const resetItems = () => {
        itemsLearningType.forEach((item) => {
            item.value = 0;
        });
    };
    
    const handleAddTask = () => {
        const id = ObjectID().toString();
        socket?.emit('new-task', { designId: design._id, learningActivityID: learningActivity.id, id }, emitWithTimeout(
            (resp) => {
                if(!resp.ok) return enqueueSnackbar(resp.message, { variant: 'error', autoHideDuration: 2000 });
                if(uiState.userSaveDesign){
                    dispatch({
                        type: types.ui.setUserSaveDesign,
                        payload: false,
                    });
                }
            },
            () => enqueueSnackbar('Error al agregar la tarea. Por favor revise su conexión. Tiempo de espera excedido.', { variant: 'error', autoHideDuration: 2000 }),
        ));
    };

    const handleToggleLearningResult = (e, isSelected, result) => {
        if (isSelected) {
            let indexLearningResults = 0;
            learningActivity.learningResults.forEach((r, _indexLearningResults) => {
                if (r.verb === result.verb && r.description === result.description) indexLearningResults = _indexLearningResults;
            });
            socket?.emit('delete-learning-result-from-learningActivity', {
                designId: design._id,
                learningActivityID: learningActivity.id,
                indexLearningResults
            }, emitWithTimeout(
                (resp) => {
                    if(!resp.ok) return enqueueSnackbar(resp.message, { variant: 'error', autoHideDuration: 2000 });
                    if(uiState.userSaveDesign){
                        dispatch({
                            type: types.ui.setUserSaveDesign,
                            payload: false,
                        });
                    }
                },
                () => enqueueSnackbar('Error al desvincular el resultado de aprendizaje de la actividad. Por favor revise su conexión. Tiempo de espera excedido.', { variant: 'error', autoHideDuration: 2000 }),
            ));
        } else {
            socket?.emit('add-learning-result-to-learningActivity', {
                designId: design._id,
                learningActivityID: learningActivity.id,
                result
            }, emitWithTimeout(
                (resp) => {
                    if(!resp.ok) return enqueueSnackbar(resp.message, { variant: 'error', autoHideDuration: 2000 });
                    if(uiState.userSaveDesign){
                        dispatch({
                            type: types.ui.setUserSaveDesign,
                            payload: false,
                        });
                    }
                },
                () => enqueueSnackbar('Error al vincular el resultado de aprendizaje a la actividad. Por favor revise su conexión. Tiempo de espera excedido.', { variant: 'error', autoHideDuration: 2000 }),
            ));
        }
    };

    const handleEditLearningActivityField = ({ target }) => {
        let field = target.name;
        if (target.name.includes('title')) field = 'title';
        else if (target.name.includes('description')) field = 'description';
        socket?.emit('edit-unit-field', { designId: design._id, learningActivityID: learningActivity.id, field, value: target.value }, emitWithTimeout(
            (resp) => {
                if(!resp.ok) return enqueueSnackbar(resp.message, { variant: 'error', autoHideDuration: 2000 });
                if(uiState.userSaveDesign){
                    dispatch({
                        type: types.ui.setUserSaveDesign,
                        payload: false,
                    });
                }
            },
            () => enqueueSnackbar(`Error al editar el campo ${field} de la actividad. Por favor revise su conexión. Tiempo de espera excedido.`, { variant: 'error', autoHideDuration: 2000 }),
        ));
        handleInputChange({ target: { ...target, name: field } });
        
    };

    const linkedLearningResult = () => {
        const learningResults = design.metadata.results.map(result => (
            
                <FormControlLabel
                    key={`learning-result-${result.verb}`}
                    classes={{label: classes.ellipsis}}
                    label={<Tooltip title={result.verb + ' ' + result.description} arrow>
                        <Typography className={classes.ellipsis}>{result.verb + ' ' + result.description}</Typography>
                    </Tooltip>}
                    control={
                        <Checkbox
                            checked={!!learningActivity.learningResults.find(lr => lr.verb === result.verb)}
                            onChange={(e) => handleToggleLearningResult(e,
                                !!learningActivity.learningResults.find(lr => lr.verb === result.verb),
                                result
                            )}
                        />
                    }
                />
            
        ));
        if (learningResults.length === 0) return <Box style={{marginLeft: -15, paddingRight: 10}} fontSize='caption.fontSize' fontStyle='italic' textAlign='justify'>
            No hay resultados de aprendizaje en este diseño. Para agregar resultados de aprendeizaje, por favor ve a la pestaña de metadatos.
        </Box>;
        return learningResults;
    };

    const handleOpenMenu = (e) => {
        e.stopPropagation();
        setMenuOpen(e.currentTarget);
    };
    
    const handleOpenModalEvaluation = () =>{
        setMenuOpen(null);
        dispatch({
            type: types.ui.setEvaluation,
            payload: {
                learningActivityIndex: index,
            },
        });
        dispatch({
            type: types.ui.toggleModal,
            payload: 'Evaluation',
        });
    };

    const listlearningActivityArray = () => {
        return (
            <Grid key={index} /*ref = {ref}*/>
                <Paper className={classes.unitSpacing}>
                    <Grid container>
                        <Grid item xs={12} sm={5} className={classes.titleUnitSpacing}>
                            <TextField
                                label='Título'
                                InputLabelProps = {{shrink: true}}
                                fullWidth
                                margin='none'
                                variant='outlined'
                                color='primary'
                                InputProps={{
                                    inputComponent: SharedTextFieldTipTapEditor,
                                    inputProps: {
                                        ref: titleRef,
                                        name: `title-learning-activity-${learningActivity.id}`,
                                        placeholder: 'Título',
                                        initialvalue: title,
                                        onChange: handleEditLearningActivityField,
                                    }
                                }}
                            />
                            {isXSDevice && <>
                                    <IconButton onClick={handleOpenMenu}>
                                        <MoreVert />
                                    </IconButton>
                                    <Menu
                                        onBlur={()=>setMenuOpen(null)}
                                        anchorEl={isMenuOpen}
                                        open={Boolean(isMenuOpen)}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        onClose={()=>setMenuOpen(null)}
                                    >
                                        <MenuItem onClick={handleOpenModalEvaluation}>
                                            <ListAlt fontSize = 'small'/>
                                            <Typography>Definir Evaluación</Typography>
                                        </MenuItem>
                                        <MenuItem onClick={handleDeleteUnit}>
                                            <Delete fontSize="small" />
                                            <Typography>Eliminar</Typography>
                                        </MenuItem>
                                    </Menu>
                                </>}
                        </Grid>
                        {resetItems()}
                        <Grid item xs={12} sm={7} className={classes.graphicUnitSpacing}>
                            {
                                design.data.learningActivities[index] && design.data.learningActivities[index].tasks && design.data.learningActivities[index].tasks.forEach((task) => {
                                    itemsLearningType.forEach((item) => {
                                        if (item.title === task.learningType) {
                                            item.minutes = (task.duration.hours * 60) + task.duration.minutes;
                                            item.value = item.value + item.minutes;
                                        }
                                    });
                                }
                                )
                            }
                            <StackedBar items={itemsLearningType} type={'Activity'} />
                            {!isXSDevice &&
                                <>
                                    <IconButton onClick={handleOpenMenu}>
                                        <MoreVert />
                                    </IconButton>
                                    <Menu
                                        onBlur={()=>setMenuOpen(null)}
                                        anchorEl={isMenuOpen}
                                        open={Boolean(isMenuOpen)}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        onClose={()=>setMenuOpen(null)}
                                    >
                                        <MenuItem onClick={handleOpenModalEvaluation}>
                                            <ListAlt fontSize = 'small' style={{marginRight: 8}}/>
                                            <Typography>Definir Evaluación</Typography>
                                        </MenuItem>
                                        <MenuItem onClick={handleDeleteUnit}>
                                            <Delete fontSize="small" style={{marginRight: 8}}/>
                                            <Typography>Eliminar Actividad</Typography>
                                        </MenuItem>
                                    </Menu>
                                </>
                            }
                        </Grid>
                    </Grid>
                    <Divider />
                    <Grid container spacing={2} >
                        <Grid item xs={12} sm={8} className={classes.taskContainer}>
                            <Grid id='tasks' className={classes.gridTask}>
                                {
                                    design.data.learningActivities[index] && design.data.learningActivities[index].tasks && design.data.learningActivities[index].tasks.map((task, i) => <Task ref={(ref) => taskRefs.current.push(ref)} key={`task-${i}-learningActivity-${index}`} index={i} task={task} learningActivityIndex={index} learningActivityID={learningActivity.id} sumHours={sumHours} sumMinutes={sumMinutes}/>)
                                }
                            </Grid>
                            <Tooltip title='Agregar tarea' arrow>
                                <Fab aria-label='add-task' className={classes.fab} size='small' color='primary' onClick={handleAddTask}>
                                    <Add fontSize='small'/>
                                </Fab>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={12} sm={4} >
                            <div className={classes.descriptionContainer}>
                                <Grid className={classes.spacingDescription}>
                                    <TextField
                                        label='Descripción'
                                        InputLabelProps = {{shrink: true}}
                                        fullWidth
                                        margin='none'
                                        variant='outlined'
                                        color='primary'
                                        InputProps={{
                                            inputComponent: SharedTextFieldTipTapEditor,
                                            inputProps: {
                                                ref: descriptionRef,
                                                name: `description-learning-activity-${learningActivity.id}`,
                                                placeholder: 'Descripción',
                                                initialvalue: description,
                                                rowMax: 3,
                                                multiline: true,
                                                onChange: handleEditLearningActivityField,
                                            }
                                        }}
                                    />
                                </Grid>
                                <Typography variant="body2" className={classes.spacingLinkedResults} color="textSecondary"> Resultados Vinculados </Typography>
                                <div className={classes.learningResultList}>
                                    {
                                        linkedLearningResult()
                                    }
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        )
    }

    return (
        <>
            {
                listlearningActivityArray()
            }
        </>
    )
})
