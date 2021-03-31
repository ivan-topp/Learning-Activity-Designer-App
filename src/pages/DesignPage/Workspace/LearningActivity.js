import React, { useEffect, useRef } from 'react';
import { Button, Checkbox, Divider, FormControlLabel, Grid, IconButton, makeStyles, Paper, Tooltip, Typography } from '@material-ui/core'
import { Task } from 'pages/DesignPage/Workspace/Task';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { useSocketState } from 'contexts/SocketContext';
import { StackedBar } from 'components/StackedBar';
import { useForm } from 'hooks/useForm';
import { useDesignState } from 'contexts/design/DesignContext';
import { SharedTextFieldTipTapEditor } from 'components/SharedTextFieldTipTapEditor';
import { ConfirmationModal } from 'components/ConfirmationModal';
import { useUiState } from 'contexts/ui/UiContext';
import types from 'types';
import { useSnackbar } from 'notistack';
import { itemsLearningType } from 'assets/resource/items'

const useStyles = makeStyles((theme) => ({
    unitSpacing: {
        marginTop: theme.spacing(3),
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
    learningResultList: {
        display: 'flex',
        flexWrap: 'nowrap',
        flexDirection: 'column',
        paddingLeft: 15,
        maxHeight: 200,
        overflow: 'auto',
        overflowX: true,
    }
}));

export const LearningActivity = ({ index, learningActivity }) => {
    const classes = useStyles();
    const { designState } = useDesignState();
    const { design } = designState;
    const { socket } = useSocketState();
    const { uiState, dispatch } = useUiState();
    const { enqueueSnackbar } = useSnackbar();

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
        if(title === "" && description === "" && learningActivity.learningResults.length === 0 && (learningActivity.tasks === undefined || learningActivity.tasks.length === 0)){
            taskRefs?.current.forEach(task => task?.clearTexts());
            titleRef?.current.clearText();
            descriptionRef?.current.clearText();
            socket.emit('delete-learningActivity', { designId: design._id, index });
            enqueueSnackbar('Su actividad se ha eliminado',  {variant: 'success', autoHideDuration: 2000});
        }else {
            dispatch({
                type: types.ui.toggleModal,
                payload: 'Confirmation',
            });
        }
    };
    
    const resetItems = () =>{
        itemsLearningType.forEach((item) =>{
            item.value = 0;
        });
    };

    const handleAddTask = () => {
        socket.emit('new-task', { designId: design._id, index });
    };

    const handleToggleLearningResult = (e, isSelected, result) => {
        if(isSelected){
            let indexLearningResults = 0;
            learningActivity.learningResults.forEach((r, _indexLearningResults) => {
                if (r.verb === result.verb && r.description === result.description) indexLearningResults = _indexLearningResults;
            });
            socket.emit('delete-learning-result-from-learningActivity', {
                designId: design._id,
                index,
                indexLearningResults
            });
        }else{
            socket.emit('add-learning-result-to-learningActivity', {
                designId: design._id,
                index,
                result
            });
        }
    };

    const handleEditLearningActivityField = ({ target }) => {
        let field = target.name;
        if(target.name.includes('title')) field = 'title';
        else if (target.name.includes('description')) field = 'description';
        socket.emit('edit-unit-field', { designId: design._id, index, field, value: target.value });
        handleInputChange({ target: {...target, name: field} });
    };

    const listlearningActivityArray = () => {
        return (
            <Grid key={index}>
                <Paper className={classes.unitSpacing}>
                    <Grid container>
                        <Grid item xs={12} sm={5} className={classes.titleUnitSpacing}>
                            <SharedTextFieldTipTapEditor 
                                ref={titleRef}
                                name={`title-learning-activity-${index}`} // TODO: Cambiar y utilizar id generada en mongo como nombre de dato compartido.
                                placeholder='Título'
                                initialvalue={title}
                                onChange={handleEditLearningActivityField}
                            />
                        </Grid>
                        {resetItems()}
                        <Grid item xs={12} sm={7} className={classes.graphicUnitSpacing}>
                            {   
                                design.data.learningActivities[index] && design.data.learningActivities[index].tasks && design.data.learningActivities[index].tasks.forEach((task)=>
                                {   
                                    itemsLearningType.forEach((item) =>{ 
                                        if( item.title === task.learningType ){
                                            item.value = item.value + 1;
                                        }
                                    });
                                } 
                                )
                            }
                            <StackedBar items = {itemsLearningType} type = {'Activity'}/>
                            <Tooltip title="Delete">
                                <IconButton onClick={handleDeleteUnit}>
                                    <DeleteForeverIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                    <Divider />
                    <Grid container spacing={2} >
                        <Grid item xs={12} sm={8}>
                            <Grid className={classes.gridTask}>
                                { 
                                    design.data.learningActivities[index] && design.data.learningActivities[index].tasks && design.data.learningActivities[index].tasks.map((task, i)=> <Task ref={(ref) => taskRefs.current.push(ref)} key={`task-${i}-learningActivity-${index}`} index={i} task={task} learningActivityIndex={index}/> ) 
                                }
                            </Grid>
                            <Grid container>
                                <Grid item />
                                <Grid item className={classes.buttonPos}>
                                    <Button size="small" variant="outlined" onClick={handleAddTask}> Agregar Tarea </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={4} >
                            <Typography variant="body2" className={classes.spacingDescriptionlearningActivity} color="textSecondary"> Descripción Unidad de aprendizaje </Typography>
                            <Grid className={classes.spacingDescription}>
                                <SharedTextFieldTipTapEditor 
                                    ref={descriptionRef}
                                    name={`description-learning-activity-${index}`} // TODO: Cambiar y utilizar id generada en mongo como nombre de dato compartido.
                                    placeholder='Título'
                                    initialvalue={description}
                                    onChange={(e)=>handleEditLearningActivityField}
                                    rowMax={3}
                                    multiline
                                    //deleteOnRemove
                                />
                            </Grid>
                            <Typography variant="body2" className={classes.spacingLinkedResults} color="textSecondary"> Resultados Vinculados </Typography>
                            <div className={classes.learningResultList}>
                                {
                                    design.metadata.results.map(result => (
                                        <FormControlLabel
                                            style={{width: '50%'}}
                                            key={`learning-result-${result.verb}`}
                                            control={
                                                <Checkbox 
                                                    checked={!!learningActivity.learningResults.find(lr=> lr.verb === result.verb)} 
                                                    onChange={(e)=>handleToggleLearningResult(e, 
                                                        !!learningActivity.learningResults.find(lr=> lr.verb === result.verb),
                                                        result
                                                    )} 
                                                />
                                            }
                                            label={result.verb}
                                        />
                                    ))
                                }
                            </div>
                        </Grid>
                    </Grid>
                </Paper>
                {
                    (uiState.isConfirmationModalOpen) && <ConfirmationModal type = {'actividad'} args = {{designId: design._id, index}} />
                }
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
