import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Grid, IconButton, makeStyles, Typography, Tooltip, Paper, MenuItem, FormControl, Select } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { useSocketState } from 'contexts/SocketContext';
import { useForm } from 'hooks/useForm';
import { useDesignState } from 'contexts/design/DesignContext';
import { SharedTextFieldTipTapEditor } from 'components/SharedTextFieldTipTapEditor';
import { ConfirmationModal } from 'components/ConfirmationModal';
import { useUiState } from 'contexts/ui/UiContext';
import types from 'types';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
    taskSpacing: {
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(1)
    },
    trashIcon: {
        display: 'flex',
    },
    tasksSpacing: {
        marginTop: theme.spacing(1),
        background: theme.palette.background.workSpace
    },
    taskSpacingDescription: {
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(2),
    },
    taskSpacingDescriptionBD: {
        marginBottom: theme.spacing(1),
    },
    colorLearningType: {
        width: '100%',
        height: '100%',
    },
    timeField: {
        marginRight: 10,
        display: 'flex',
        alignItems: 'center',
    },
    grid: {
        display: 'flex',
        alignItems: 'center',
    },
}));

export const Task = forwardRef(({ learningActivityIndex, index, task }, ref) => {
    const classes = useStyles();
    const { socket } = useSocketState();
    const isMounted = useRef(true);
    const hoursRef = useRef();
    const minutesRef = useRef();
    const descriptionRef = useRef();
    const { designState } = useDesignState();
    const { design } = designState;
    const { uiState, dispatch } = useUiState();
    const { enqueueSnackbar } = useSnackbar();

    const [form, handleInputChange, , setValues] = useForm({
        description: task.description,
        learningType: task.learningType && task.learningType.trim() !== '' ? task.learningType : 'Seleccionar',
        modality: task.modality && task.modality.trim() !== '' ? task.modality :'Seleccionar',
        format: task.format && task.format.trim() !== '' ? task.format :'Seleccionar',
        timeHours: task.duration.hours ?? 0,
        timeMinutes: task.duration.minutes ?? 0,
    });

    useImperativeHandle(
        ref,
        () => ({
            clearTexts: () => {
                hoursRef?.current.clearText();
                minutesRef?.current.clearText();
                descriptionRef?.current.clearText();
            }
        }),
    );

    useEffect(()=>{
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if(isMounted.current){
            if(form.description !== task.description){
                setValues((prevState) => ({
                    ...prevState,
                    description: task.description,
                }));
            }
        }
    }, [form.description, task.description, setValues]);

    useEffect(() => {
        if(isMounted.current){
            if(form.learningType !== task.learningType){
                setValues((prevState) => ({
                    ...prevState,
                    learningType: task.learningType && task.learningType.trim() !== '' ? task.learningType : 'Seleccionar',
                }));
            }
        }
    }, [form.learningType, task.learningType, setValues]);

    useEffect(() => {
        if(isMounted.current){
            if(form.modality !== task.modality){
                setValues((prevState) => ({
                    ...prevState,
                    modality: task.modality && task.modality.trim() !== '' ? task.modality : 'Seleccionar',
                }));
            }
        }
    }, [form.modality, task.modality, setValues]);

    useEffect(() => {
        if(isMounted.current){
            if(form.format !== task.format){
                setValues((prevState) => ({
                    ...prevState,
                    format: task.format && task.format.trim() !== '' ? task.format : 'Seleccionar',
                }));
            }
        }
    }, [form.format, task.format, setValues]);

    useEffect(() => {
        if(isMounted.current){
            if(form.timeHours !== task.duration.hours){
                setValues((prevState) => ({
                    ...prevState,
                    timeHours: task.duration.hours ?? 0,
                }));
            }
        }
    }, [form.timeHours, task.duration.hours, setValues]);

    useEffect(() => {
        if(isMounted.current){
            if(form.timeMinutes !== task.duration.minutes){
                setValues((prevState) => ({
                    ...prevState,
                    timeMinutes: task.duration.minutes ?? 0,
                }));
            }
        }
    }, [form.timeMinutes, task.duration.minutes, setValues]);
    
    const { description, learningType, modality, format, timeHours, timeMinutes,  } = form;
    
    const handleEditTaskField = ({ target }) => {
        let { name: field, value } = target;
        let subfield = null;
        if(field.includes('description')) field = 'description';
        else if (field.includes('timeHours')){
            field = 'duration';
            subfield = 'hours';
            value = isNaN(value) ? 0 : value;
        }else if (field.includes('timeMinutes')){
            field = 'duration';
            subfield = 'minutes';
            value = isNaN(value) ? 0 : value;
        }
        handleInputChange({ target });
        socket.emit('edit-task-field', { designId: design._id, learningActivityIndex, index, field, value, subfield });
    };
    
    const handleDeleteTask = () => {
        if (description === "" && learningType === 'Seleccionar' && modality === 'Seleccionar' && format === 'Seleccionar' && timeHours === 0 && timeMinutes === 0 ){
            hoursRef?.current.clearText();
            minutesRef?.current.clearText();
            descriptionRef?.current.clearText();
            socket.emit('delete-task', { designId: design._id, learningActivityIndex, index });
            enqueueSnackbar('Su tarea se ha eliminado',  {variant: 'success', autoHideDuration: 2000});
        } else {
            dispatch({
                type: types.ui.toggleModal,
                payload: 'OtherConfirmation',
            });
        }
    };

    const handleChangeDropdown = (e) => {
        handleInputChange(e);
        socket.emit('edit-task-field', { designId: design._id, learningActivityIndex, index, field: e.target.name, value: e.target.value, subfield: null });
    };

    const listtasksArray = () => {
        return (
            <Grid key={index}>
                <Paper square className={classes.tasksSpacing}>
                    <Grid container >
                        <Grid item xs={1}>
                            {(() => {
                                if (task.learningType === 'Investigación') {
                                    return (
                                        <div className={classes.colorLearningType} style={{ backgroundColor: '#57A8E7' }}></div>
                                    )
                                } else if (task.learningType === 'Adquisición') {
                                    return (
                                        <div className={classes.colorLearningType} style={{ backgroundColor: '#E95D5D' }}></div>
                                    )
                                }else if (task.learningType === 'Producción') {
                                    return (
                                        <div className={classes.colorLearningType} style={{ backgroundColor: '#C8951F' }}></div>
                                    )
                                }else if (task.learningType === 'Discusión') {
                                    return (
                                        <div className={classes.colorLearningType} style={{ backgroundColor: '#087A4C' }}></div>
                                    )
                                }else if (task.learningType === 'Colaboración') {
                                    return (
                                        <div className={classes.colorLearningType} style={{ backgroundColor: '#DFDF3F' }}></div>
                                    )
                                }else if (task.learningType === 'Práctica') {
                                    return (
                                        <div className={classes.colorLearningType} style={{ backgroundColor: '#A75BCD' }}></div>
                                    )
                                }
                            })()}
                        </Grid>
                        <Grid item xs={11}>
                            <Grid container className={classes.taskSpacing}>
                                <Grid item xs={12} sm={5}>
                                    <FormControl variant='outlined' style={{width: '90%'}}>
                                    <Typography variant="body2" color="textSecondary" > Aprendizaje </Typography>
                                        <Select
                                            name='learningType'
                                            value={learningType}
                                            onChange={handleChangeDropdown}
                                        >
                                            <MenuItem value={'Seleccionar'}> Seleccionar </MenuItem>
                                            <MenuItem value={'Investigación'}> Investigación </MenuItem>
                                            <MenuItem value={'Adquisición'}> Adquisición </MenuItem>
                                            <MenuItem value={'Producción'}> Producción </MenuItem>
                                            <MenuItem value={'Discusión'}> Discusión </MenuItem>
                                            <MenuItem value={'Colaboración'}> Colaboración </MenuItem>
                                            <MenuItem value={'Práctica'}> Práctica </MenuItem>
                                            
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} className={classes.grid} style={{justifyContent: 'space-between'}}>
                                    <FormControl variant='outlined' style={{width: '90%'}}>
                                    <Typography variant="body2" color="textSecondary" > Modalidad </Typography>
                                        <Select
                                            name='modality'
                                            value={modality}
                                            onChange={handleChangeDropdown}
                                        >
                                            <MenuItem value={'Seleccionar'}> Seleccionar </MenuItem>
                                            <MenuItem value={'Presencial-Asíncrono'}> Presencial-Asíncrono</MenuItem>
                                            <MenuItem value={'Presencial-Síncrono'}> Presencial-Síncrono</MenuItem>
                                            <MenuItem value={'Online-Asíncrono'}> Online-Asíncrono</MenuItem>
                                            <MenuItem value={'Online-Síncrono'}> Online-Síncrono</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Tooltip title="Delete">
                                        <IconButton onClick={() => handleDeleteTask(index)}>
                                            <DeleteForeverIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            <Grid container className={classes.taskSpacing}>
                                <Grid item xs={12} sm={6} className={classes.grid}>
                                    <div style={{ width: '100%' }}>
                                        <Typography variant="body2" color="textSecondary"> Tiempo de trabajo </Typography>
                                        <div className={classes.timeField}>
                                            <SharedTextFieldTipTapEditor 
                                                ref={hoursRef} 
                                                name={`timeHours-task-${index}-learning-activity-${learningActivityIndex}`} // TODO: Cambiar y utilizar id generada en mongo como nombre de dato compartido.
                                                placeholder='Horas'
                                                initialvalue={timeHours}
                                                onChange={handleEditTaskField}
                                                type='number'
                                                min={0}
                                                //deleteOnRemove
                                            />
                                            <Typography style={{ marginLeft: 10, marginRight: 10 }}> : </Typography>
                                            <SharedTextFieldTipTapEditor 
                                                ref={minutesRef}
                                                name={`timeMinutes-task-${index}-learning-activity-${learningActivityIndex}`} // TODO: Cambiar y utilizar id generada en mongo como nombre de dato compartido.
                                                placeholder='Minutos'
                                                initialvalue={timeMinutes}
                                                onChange={handleEditTaskField}
                                                type='number'
                                                min={0}
                                                max={59}
                                                //deleteOnRemove
                                            />
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={6} className={classes.grid}>
                                        <FormControl variant='outlined' style={{width: '90%', marginRight: 5}}>
                                        <Typography variant="body2" color="textSecondary" style={{marginBottom: 4, marginRight: 5}}> Formato </Typography>
                                            <Select
                                                name='format'
                                                value={format}
                                                onChange={handleChangeDropdown}
                                            >
                                                <MenuItem value={'Seleccionar'}> Seleccionar </MenuItem>
                                                <MenuItem value={'Grupal'}> Grupal</MenuItem>
                                                <MenuItem value={'Individual'}> Individual</MenuItem>
                                                <MenuItem value={'Toda la clase'}> Toda la clase</MenuItem>
                                            </Select>    
                                        </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container className={classes.taskSpacingDescription}>
                                <Grid item sm={11}>
                                    <Typography variant="body2" color="textSecondary" > Descripción </Typography>
                                    <Grid className={classes.taskSpacingDescriptionBD}>
                                        <SharedTextFieldTipTapEditor 
                                            ref={descriptionRef}
                                            name={`description-task-${index}-learning-activity-${learningActivityIndex}`} // TODO: Cambiar y utilizar id generada en mongo como nombre de dato compartido.
                                            placeholder='Descripción'
                                            initialvalue={description}
                                            onChange={handleEditTaskField}
                                            multiline
                                            //deleteOnRemove
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
                {
                    (uiState.isOtherConfirmationModalOpen) && <ConfirmationModal type = {'tarea'} args = {{ designId: design._id, learningActivityIndex, index }} />
                }
            </Grid>
        )
    }
    return (
        <>
            {
                listtasksArray()
            }
        </>
    )
})
