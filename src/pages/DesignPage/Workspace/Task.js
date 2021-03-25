import React, { useEffect } from 'react';
import { Grid, IconButton, makeStyles, Typography, Tooltip, Paper, TextField, MenuItem, FormControl, Select } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { useSocketState } from 'contexts/SocketContext';
import { useForm } from 'hooks/useForm';
import TimeFormatter from 'utils/timeFormatters';
import { useDesignState } from 'contexts/design/DesignContext';
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

export const Task = ({ learningActivityIndex, index, task }) => {
    const classes = useStyles();
    const { socket } = useSocketState();
    const { designState } = useDesignState();
    const { design } = designState;
    const { uiState, dispatch } = useUiState();
    const { enqueueSnackbar } = useSnackbar();

    const [form, handleInputChange, , setValues] = useForm({
        description: task.description,
        learningType: task.learningType ? task.learningType : 'Seleccionar',
        modality: task.modality ? task.modality :'Seleccionar',
        format: task.format ? task.format :'Seleccionar',
        timeHours: TimeFormatter.toHoursAndMinutes(task.duration)[0],
        timeMinutes: TimeFormatter.toHoursAndMinutes(task.duration)[1],
    });

    useEffect(() => {
        setValues({
            description: task.description,
            learningType: task.learningType ? task.learningType : 'Seleccionar',
            modality: task.modality ? task.modality :'Seleccionar',
            format: task.format ? task.format :'Seleccionar',
            timeHours: TimeFormatter.toHoursAndMinutes(task.duration)[0],
            timeMinutes: TimeFormatter.toHoursAndMinutes(task.duration)[1],
        });
    }, [design, setValues, task]);

    const { description, learningType, modality, format, timeHours, timeMinutes,  } = form;
    
    const editTask = ({ target }) => {
        if (target.name === 'timeHours' || target.name === 'timeMinutes') {
            socket.emit('edit-task-field', { designId: design._id, learningActivityIndex, index, field: 'duration', value: TimeFormatter.toMinutes(timeHours, timeMinutes) });
        } else {
            socket.emit('edit-task-field', { designId: design._id, learningActivityIndex, index, field: target.name, value: form[target.name] });
        }
    };
    
    const handleDeleteTask = () => {
        if (description === "" && learningType === 'Seleccionar' && modality === 'Seleccionar' && format === 'Seleccionar' && timeHours === 0 && timeMinutes === 0 ){
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
        socket.emit('edit-task-field', { designId: design._id, learningActivityIndex, index, field: e.target.name, value: e.target.value });
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
                                    <FormControl variant='outlined' size='small' style={{width: '90%'}}>
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
                                    <FormControl variant='outlined' size='small' style={{width: '90%'}}>
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
                                            <TextField
                                                margin="dense"
                                                variant="outlined"
                                                name="timeHours"
                                                value={timeHours}
                                                onChange={handleInputChange}
                                                label="Horas"
                                                type="number"
                                                onBlur={editTask}
                                                inputProps={{
                                                    min: 0,
                                                    max: 59
                                                }}
                                                fullWidth
                                            />
                                            <Typography style={{ marginLeft: 10, marginRight: 10 }}> : </Typography>
                                            <TextField
                                                margin="dense"
                                                variant="outlined"
                                                name="timeMinutes"
                                                value={timeMinutes}
                                                onChange={handleInputChange}
                                                label="Minutos"
                                                type="number"
                                                onBlur={editTask}
                                                inputProps={{
                                                    min: 0,
                                                    max: 59
                                                }}
                                                fullWidth
                                            />
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={6} className={classes.grid}>
                                        <FormControl variant='outlined' size='small' style={{width: '90%', marginRight: 5}}>
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
                                        <TextField
                                            multiline
                                            margin='dense'
                                            variant="outlined"
                                            name="description"
                                            placeholder="Descripción"
                                            value={description}
                                            onChange={handleInputChange}
                                            type="text"
                                            onBlur={editTask}
                                            fullWidth
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
}
