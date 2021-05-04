import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { IconButton, makeStyles, Typography, Tooltip, Paper, MenuItem, FormControl, Select, TextField, Box, InputLabel, useTheme, useMediaQuery, Button } from '@material-ui/core';
import { useSocketState } from 'contexts/SocketContext';
import { useForm } from 'hooks/useForm';
import { useDesignState } from 'contexts/design/DesignContext';
import { SharedTextFieldTipTapEditor } from 'components/SharedTextFieldTipTapEditor';
import { useUiState } from 'contexts/ui/UiContext';
import types from 'types';
import { useSnackbar } from 'notistack';
import { Delete } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    trashIcon: {
        display: 'flex',
    },
    tasksSpacing: {
        position: 'relative',
        width: '100%',
        height: '100%',
        marginTop: theme.spacing(1),
        background: theme.palette.background.workSpace
    },
    taskBody: {
        padding: 10,
        position: 'relative',
        left: '5%',
        width: '95%',
        height: '100%',
    },
    taskSpacingDescription: {
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(2),
    },
    taskSpacingDescriptionBD: {
        marginBottom: theme.spacing(1),
    },
    colorLearningType: {
        position: 'absolute',
        width: '5%',
        height: '100%',
    },
    timeField: {
        display: 'flex',
        alignItems: 'center',
        marginRight: 10,
        [theme.breakpoints.down('md')]: {
            marginRight: 0,
        },
    },
    grid: {
        display: 'flex',
        alignItems: 'center',
    },
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: '50% 50%',
        gridTemplateRows: 'auto',
        gridTemplateAreas: `
            'learningType modality'
            'workingTime format'
            'description description'`,
        [theme.breakpoints.down('md')]: {
            gridTemplateAreas: `
                'learningType learningType'
                'modality modality'
                'format format'
                'workingTime workingTime'
                'description description'`,
        },
    },
    firstRow: {
        display: 'grid',
        gridTemplateColumns: 'auto auto 10%',
        gridTemplateRows: 'auto',
        gridTemplateAreas: `'learningType modality'`,
    },
    learningTypeContainer:{
        gridArea: 'learningType',
        width: '100%',
        display: 'flex',
    },
    learningType:{
        marginRight: 10,
        [theme.breakpoints.down('md')]: {
            marginRight: 0,
            marginTop: 10,
        },
    },
    modality: {
        gridArea: 'modality',
        width: '100%',
        display: 'flex',
        [theme.breakpoints.down('md')]: {
            marginTop: 10,
        },
    },
    format: {
        gridArea: 'format',
        display: 'flex',
        justifyContent: 'space-between',
        alignSelf: 'flex-end',
        [theme.breakpoints.down('md')]: {
            marginTop: 10,
        },
    },
    delete: {
        alignSelf: 'flex-start',
        justifySelf: 'center',
    },
    resourceLinkGrid:{
        display: 'grid',
        gridTemplateColumns: '25% 75%',
    },
    fab: {
        maxHeight: "20px",
        minHeight: "20px",
        minWidth: "20px",
        maxWidth: "20px",
    },
    icon:{
        maxHeight: "15px",
        minHeight: "15px",
        minWidth: "15px",
        maxWidth: "15px",
    }
}));

export const Task = forwardRef(({ learningActivityIndex, index, task, learningActivityID, ...rest }, ref) => {
    const classes = useStyles();
    const { socket } = useSocketState();
    const isMounted = useRef(true);
    const hoursRef = useRef();
    const minutesRef = useRef();
    const descriptionRef = useRef();
    const { designState } = useDesignState();
    const { design } = designState;
    const { dispatch } = useUiState();
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const isMediumDevice = useMediaQuery(theme.breakpoints.down('md'));

    const [form, handleInputChange, , setValues] = useForm({
        description: task.description,
        learningType: task.learningType && task.learningType.trim() !== '' ? task.learningType : 'Seleccionar',
        modality: task.modality && task.modality.trim() !== '' ? task.modality : 'Seleccionar',
        format: task.format && task.format.trim() !== '' ? task.format : 'Seleccionar',
        timeHours: task.duration.hours ?? 0,
        timeMinutes: task.duration.minutes ?? 0,
        groupSize: task.groupSize && task.groupSize !== 2 ? task.groupSize : 2,
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

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (isMounted.current) {
            if (form.description !== task.description) {
                setValues((prevState) => ({
                    ...prevState,
                    description: task.description,
                }));
            }
        }
    }, [form.description, task.description, setValues]);

    useEffect(() => {
        if (isMounted.current) {
            if (form.learningType !== task.learningType) {
                setValues((prevState) => ({
                    ...prevState,
                    learningType: task.learningType && task.learningType.trim() !== '' ? task.learningType : 'Seleccionar',
                }));
            }
        }
    }, [form.learningType, task.learningType, setValues]);

    useEffect(() => {
        if (isMounted.current) {
            if (form.modality !== task.modality) {
                setValues((prevState) => ({
                    ...prevState,
                    modality: task.modality && task.modality.trim() !== '' ? task.modality : 'Seleccionar',
                }));
            }
        }
    }, [form.modality, task.modality, setValues]);

    useEffect(() => {
        if (isMounted.current) {
            if (form.format !== task.format) {
                setValues((prevState) => ({
                    ...prevState,
                    format: task.format && task.format.trim() !== '' ? task.format : 'Seleccionar',
                }));
            }
        }
    }, [form.format, task.format, setValues]);

    useEffect(() => {
        if (isMounted.current) {
            if (form.timeHours !== task.duration.hours) {
                setValues((prevState) => ({
                    ...prevState,
                    timeHours: task.duration.hours ?? 0,
                }));
            }
        }
    }, [form.timeHours, task.duration.hours, setValues]);

    useEffect(() => {
        if (isMounted.current) {
            if (form.timeMinutes !== task.duration.minutes) {
                setValues((prevState) => ({
                    ...prevState,
                    timeMinutes: task.duration.minutes ?? 0,
                }));
            }
        }
    }, [form.timeMinutes, task.duration.minutes, setValues]);

    const { description, learningType, modality, format, timeHours, timeMinutes, groupSize,  } = form;

    const handleEditTaskField = ({ target }) => {
        let { name: field, value } = target;
        let subfield = null;
        if (field.includes('description')) field = 'description';
        else if (field.includes('timeHours')) {
            field = 'duration';
            subfield = 'hours';
            value = isNaN(value) ? 0 : value;
        } else if (field.includes('timeMinutes')) {
            field = 'duration';
            subfield = 'minutes';
            value = isNaN(value) ? 0 : value;
        }
        handleInputChange({ target });
        socket.emit('edit-task-field', { designId: design._id, learningActivityID, taskID: task.id, field, value, subfield });
    };

    const handleOpenResourceModal = () => {
        dispatch({
            type: types.ui.setResourceLink,
            payload: {
                learningActivityIndex: learningActivityIndex,
                taskIndex: index,
            },
        });
        dispatch({
            type: types.ui.toggleModal,
            payload: 'Resource',
        });
    }

    const handleDeleteTask = (index) => {
        if (description === "" && learningType === 'Seleccionar' && modality === 'Seleccionar' && format === 'Seleccionar' && timeHours === 0 && timeMinutes === 0) {
            hoursRef?.current?.clearText();
            minutesRef?.current?.clearText();
            descriptionRef?.current?.clearText();
            socket.emit('delete-task', { designId: design._id, learningActivityID, taskID: task.id });
            enqueueSnackbar('Su tarea se ha eliminado', { variant: 'success', autoHideDuration: 2000 });
        } else {
            dispatch({
                type: types.ui.setConfirmData,
                payload: {
                    type: 'tarea',
                    args: { designId: design._id, learningActivityID, taskID: task.id },
                    actionMutation: null,
                }
            })
            dispatch({
                type: types.ui.toggleModal,
                payload: 'Confirmation',
            });
        }
    };

    const handleChangeDropdown = (e) => {
        handleInputChange(e);
        socket.emit('edit-task-field', { designId: design._id, learningActivityID, taskID: task.id, field: e.target.name, value: e.target.value, subfield: null });
    };

    const listTasksArray = () => {
        return (
            <Box key={index} style={{ height: '100%' }}>
                <Paper square className={classes.tasksSpacing}>
                    <Box style={{ display: 'flex', position: 'relative', height: '100%', width: '100%' }}>
                        {(() => {
                            if (task.learningType === 'Investigación') {
                                return (
                                    <Box className={classes.colorLearningType} style={{ backgroundColor: '#57A8E7' }}></Box>
                                )
                            } else if (task.learningType === 'Adquisición') {
                                return (
                                    <Box className={classes.colorLearningType} style={{ backgroundColor: '#E95D5D' }}></Box>
                                )
                            } else if (task.learningType === 'Producción') {
                                return (
                                    <Box className={classes.colorLearningType} style={{ backgroundColor: '#C8951F' }}></Box>
                                )
                            } else if (task.learningType === 'Discusión') {
                                return (
                                    <Box className={classes.colorLearningType} style={{ backgroundColor: '#087A4C' }}></Box>
                                )
                            } else if (task.learningType === 'Colaboración') {
                                return (
                                    <Box className={classes.colorLearningType} style={{ backgroundColor: '#DFDF3F' }}></Box>
                                )
                            } else if (task.learningType === 'Práctica') {
                                return (
                                    <Box className={classes.colorLearningType} style={{ backgroundColor: '#A75BCD' }}></Box>
                                )
                            }
                        })()}
                        <div className={classes.taskBody}>
                            <div className={classes.gridContainer}>
                                <div className={classes.learningTypeContainer}>
                                    <FormControl fullWidth variant='outlined' className={classes.learningType}>
                                        <InputLabel id={`learningType-task-${task.id}-learningActivity-${learningActivityID}`} shrink>Aprendizaje</InputLabel>
                                        <Select
                                            labelId={`learningType-task-${task.id}-learningActivity-${learningActivityID}`}
                                            label='Aprendizaje'
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
                                    {isMediumDevice && (<Tooltip title="Eliminar tarea" className={classes.delete}>
                                        <IconButton onClick={() => handleDeleteTask(index)}>
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Tooltip>)}
                                </div>
                                <div className={classes.modality}>
                                    <FormControl fullWidth variant='outlined'>
                                        <InputLabel id={`modality-task-${task.id}-learningActivity-${learningActivityID}`} shrink> Modalidad </InputLabel>
                                        <Select
                                            labelId={`modality-task-${task.id}-learningActivity-${learningActivityID}`}
                                            label='Aprendizaje'
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
                                    {!isMediumDevice && (<Tooltip title="Eliminar tarea" className={classes.delete}>
                                        <IconButton onClick={() => handleDeleteTask(index)}>
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Tooltip>)}
                                </div>
                                <div style={{ width: '100%', gridArea: 'workingTime', marginTop: 3 }}>
                                    <Typography variant="body2" color="textSecondary" gutterBottom> Tiempo de trabajo </Typography>
                                    <div className={classes.timeField}>
                                        <TextField
                                            label='Horas'
                                            InputLabelProps = {{shrink: true}}
                                            fullWidth
                                            margin='none'
                                            variant='outlined'
                                            color='primary'
                                            InputProps={{
                                                inputComponent: SharedTextFieldTipTapEditor,
                                                inputProps: {
                                                    ref: hoursRef,
                                                    name: `timeHours-task-${task.id}-learning-activity-${learningActivityID}`, // TODO: Cambiar y utilizar id generada en mongo como nombre de dato compartido.
                                                    placeholder: 'Horas',
                                                    initialvalue: timeHours,
                                                    onChange: handleEditTaskField,
                                                    type: 'number',
                                                    min: 0,
                                                }
                                            }}
                                        />
                                        <Typography style={{ marginLeft: 10, marginRight: 10 }}> : </Typography>
                                        <TextField
                                            label='Minutos'
                                            InputLabelProps = {{shrink: true}}
                                            fullWidth
                                            margin='none'
                                            variant='outlined'
                                            color='primary'
                                            InputProps={{
                                                inputComponent: SharedTextFieldTipTapEditor,
                                                inputProps: {
                                                    ref: minutesRef,
                                                    name: `timeMinutes-task-${task.id}-learning-activity-${learningActivityID}`, // TODO: Cambiar y utilizar id generada en mongo como nombre de dato compartido.
                                                    placeholder: 'Minutos',
                                                    initialvalue: timeMinutes,
                                                    onChange: handleEditTaskField,
                                                    type: 'number',
                                                    min: 0,
                                                    max: 59,
                                                }
                                            }}
                                        />
                                    </div>
                                    
                                </div>
                                <div style={{marginTop: 20}}>
                                    <Button variant={'outlined'} onClick={handleOpenResourceModal}> Administrar recursos</Button>
                                </div>
                                <div className={classes.format}>
                                    <FormControl fullWidth variant='outlined' >
                                        <InputLabel id={`format-task-${task.id}-learningActivity-${learningActivityID}`} shrink> Formato </InputLabel>
                                        <Select
                                            labelId={`format-task-${task.id}-learningActivity-${learningActivityID}`}
                                            label='Formato'
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
                                    { (format === 'Grupal') &&
                                        (design.metadata.classSize > 1) &&
                                            <FormControl fullWidth variant='outlined'>
                                                <InputLabel id={`group-task-${task.id}-learningActivity-${learningActivityID}`} shrink> Personas </InputLabel>
                                                <Select
                                                    labelId={`group-quantity-task-${task.id}-learningActivity-${learningActivityID}`}
                                                    label='Cantidad'
                                                    name='groupSize'
                                                    value={groupSize}
                                                    onChange={handleChangeDropdown}
                                                    type = 'number'
                                                >
                                                {/* 
                                                    Array.from({ length: (design.metadata.classSize-1)}, (_, i) => (
                                                            {i}
                                                    ))
                                                */}
                                                <MenuItem value={2}> {2} </MenuItem>
                                                <MenuItem value={3}> {3} </MenuItem>
                                                <MenuItem value={4}> {4} </MenuItem>
                                                <MenuItem value={5}> {5} </MenuItem>
                                                </Select>
                                            </FormControl>
                                    }
                                </div>
                                <TextField
                                    style={{ gridArea: 'description', marginTop: 10, }}
                                    InputLabelProps = {{shrink: true}}
                                    label='Descripción'
                                    fullWidth
                                    margin='none'
                                    variant='outlined'
                                    color='primary'
                                    InputProps={{
                                        inputComponent: SharedTextFieldTipTapEditor,
                                        inputProps: {
                                            ref: descriptionRef,
                                            name: `description-task-${task.id}-learning-activity-${learningActivityID}`, // TODO: Cambiar y utilizar id generada en mongo como nombre de dato compartido.
                                            placeholder: 'Descripción',
                                            initialvalue: description,
                                            onChange: handleEditTaskField,
                                            multiline: true,
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </Box>
                </Paper>
            </Box >
        )
    }
return (
    <>
        {
            listTasksArray()
        }
    </>
)
})
