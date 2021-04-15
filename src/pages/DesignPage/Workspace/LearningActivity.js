import React, { useEffect, useRef } from 'react';
import { Box, Checkbox, Divider, Fab, FormControlLabel, Grid, IconButton, makeStyles, Paper, TextField, Tooltip, Typography, useMediaQuery, useTheme } from '@material-ui/core'
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
import { Add, Delete } from '@material-ui/icons';
import ObjectID from 'bson-objectid';
//import { scrollToBottomAnimated } from 'utils/scrollToBottom';

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
}));

export const LearningActivity = ({ index, learningActivity }) => {
    const classes = useStyles();
    const { designState } = useDesignState();
    const { design } = designState;
    const { socket } = useSocketState();
    const { dispatch } = useUiState();
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const isXSDevice = useMediaQuery(theme.breakpoints.down('xs'));

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
            socket.emit('delete-learningActivity', { designId: design._id, index });
            enqueueSnackbar('Su actividad se ha eliminado', { variant: 'success', autoHideDuration: 2000 });
        } else {
            dispatch({
                type: types.ui.setConfirmData,
                payload: {
                    type: 'actividad',
                    args: { designId: design._id, index },
                    actionMutation: null,
                }
            });
            dispatch({
                type: types.ui.toggleModal,
                payload: 'Confirmation',
            });
        }
    };

    const resetItems = () => {
        itemsLearningType.forEach((item) => {
            item.value = 0;
        });
    };

    const handleAddTask = () => {
        const id = ObjectID().toString();
        socket.emit('new-task', { designId: design._id, index, id });
        //scrollToBottomAnimated('tasks');
    };

    const handleToggleLearningResult = (e, isSelected, result) => {
        if (isSelected) {
            let indexLearningResults = 0;
            learningActivity.learningResults.forEach((r, _indexLearningResults) => {
                if (r.verb === result.verb && r.description === result.description) indexLearningResults = _indexLearningResults;
            });
            socket.emit('delete-learning-result-from-learningActivity', {
                designId: design._id,
                index,
                indexLearningResults
            });
        } else {
            socket.emit('add-learning-result-to-learningActivity', {
                designId: design._id,
                index,
                result
            });
        }
    };

    const handleEditLearningActivityField = ({ target }) => {
        let field = target.name;
        if (target.name.includes('title')) field = 'title';
        else if (target.name.includes('description')) field = 'description';
        socket.emit('edit-unit-field', { designId: design._id, index, field, value: target.value });
        handleInputChange({ target: { ...target, name: field } });
    };

    const linkedLearningResult = () => {
        const learningResults = design.metadata.results.map(result => (
            <FormControlLabel
                style={{ width: '50%' }}
                key={`learning-result-${result.verb}`}
                control={
                    <Checkbox
                        checked={!!learningActivity.learningResults.find(lr => lr.verb === result.verb)}
                        onChange={(e) => handleToggleLearningResult(e,
                            !!learningActivity.learningResults.find(lr => lr.verb === result.verb),
                            result
                        )}
                    />
                }
                label={result.verb}
            />
        ));
        if (learningResults.length === 0) return <Box style={{marginLeft: -15, paddingRight: 10}} fontSize='caption.fontSize' fontStyle='italic' textAlign='justify'>
            No hay resultados de aprendizaje en este diseño. Para agregar resultados de aprendeizaje, por favor ve a la pestaña de metadatos.
        </Box>;
        return learningResults;
    };

    const listlearningActivityArray = () => {
        return (
            <Grid key={index}>
                <Paper className={classes.unitSpacing}>
                    <Grid container>
                        <Grid item xs={12} sm={5} className={classes.titleUnitSpacing}>
                            <TextField
                                label='Título'
                                fullWidth
                                margin='none'
                                variant='outlined'
                                color='primary'
                                InputProps={{
                                    inputComponent: SharedTextFieldTipTapEditor,
                                    inputProps: {
                                        ref: titleRef,
                                        name: `title-learning-activity-${index}`,
                                        placeholder: 'Título',
                                        initialvalue: title,
                                        onChange: handleEditLearningActivityField,
                                    }
                                }}
                            />
                            {isXSDevice && <Tooltip title="Delete" className={classes.delete}>
                                <IconButton onClick={handleDeleteUnit}>
                                    <Delete fontSize="small" />
                                </IconButton>
                            </Tooltip>}
                        </Grid>
                        {resetItems()}
                        <Grid item xs={12} sm={7} className={classes.graphicUnitSpacing}>
                            {
                                design.data.learningActivities[index] && design.data.learningActivities[index].tasks && design.data.learningActivities[index].tasks.forEach((task) => {
                                    itemsLearningType.forEach((item) => {
                                        if (item.title === task.learningType) {
                                            item.value = item.value + 1;
                                        }
                                    });
                                }
                                )
                            }
                            <StackedBar items={itemsLearningType} type={'Activity'} />
                            {!isXSDevice && <Tooltip title="Delete">
                                <IconButton onClick={handleDeleteUnit}>
                                    <Delete fontSize="small" />
                                </IconButton>
                            </Tooltip>}
                        </Grid>
                    </Grid>
                    <Divider />
                    <Grid container spacing={2} >
                        <Grid item xs={12} sm={8} className={classes.taskContainer}>
                            <Grid id='tasks' className={classes.gridTask}>
                                {
                                    design.data.learningActivities[index] && design.data.learningActivities[index].tasks && design.data.learningActivities[index].tasks.map((task, i) => <Task ref={(ref) => taskRefs.current.push(ref)} key={`task-${i}-learningActivity-${index}`} index={i} task={task} learningActivityIndex={index} />)
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
                                        fullWidth
                                        margin='none'
                                        variant='outlined'
                                        color='primary'
                                        InputProps={{
                                            inputComponent: SharedTextFieldTipTapEditor,
                                            inputProps: {
                                                ref: descriptionRef,
                                                name: `description-learning-activity-${index}`,
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
}
