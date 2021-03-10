import React, { useEffect } from 'react'
import { Grid, IconButton, makeStyles, Typography, Tooltip, Paper, TextField, MenuItem, FormControl, Select } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { useSocketState } from '../../contexts/SocketContext';
import { useForm } from '../../hooks/useForm';
import TimeFormatter from '../../utils/timeFormatters';
const useStyles = makeStyles((theme) => ({
    activitySpacing: {
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(1)
    },
    trashIcon: {
        display: 'flex',
    },
    activitiesSpacing: {
        marginTop: theme.spacing(1),
        background: theme.palette.background.workSpace
    },
    activitySpacingDescription: {
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(2),
    },
    activitySpacingDescriptionBD: {
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

export const DesignActivity = ({ design, tlaIndex, index, activity }) => {
    const classes = useStyles();
    const { socket } = useSocketState();

    const [form, handleInputChange, , setValues] = useForm({
        description: activity.description,
        learningType: activity.learningType ? activity.learningType : 'Seleccionar',
        modality: activity.modality ? activity.modality :'Seleccionar',
        format: activity.format ? activity.format :'Seleccionar',
        timeHours: TimeFormatter.toHoursAndMinutes(activity.duration)[0],
        timeMinutes: TimeFormatter.toHoursAndMinutes(activity.duration)[1],
    });

    useEffect(() => {
        setValues({
            description: activity.description,
            learningType: activity.learningType ? activity.learningType : 'Seleccionar',
            modality: activity.modality ? activity.modality :'Seleccionar',
            format: activity.format ? activity.format :'Seleccionar',
            timeHours: TimeFormatter.toHoursAndMinutes(activity.duration)[0],
            timeMinutes: TimeFormatter.toHoursAndMinutes(activity.duration)[1],
        });
    }, [design, setValues, activity]);

    const { description, learningType, modality, format, timeHours, timeMinutes,  } = form;

    const editActivity = ({ target }) => {
        if (target.name === 'timeHours' || target.name === 'timeMinutes') {
            socket.emit('edit-activity-field', { designId: design._id, tlaIndex, index, field: 'duration', value: TimeFormatter.toMinutes(timeHours, timeMinutes) });
        } else {
            socket.emit('edit-activity-field', { designId: design._id, tlaIndex, index, field: target.name, value: form[target.name] });
        }
    };

    const handleDeleteActivity = () => {
        socket.emit('delete-activity', { designId: design._id, tlaIndex, index });
    };

    const handleChangeDropdown = (e) => {
        handleInputChange(e);
        socket.emit('edit-activity-field', { designId: design._id, tlaIndex, index, field: e.target.name, value: e.target.value });
    };

    const listActivitiesArray = () => {
        return (
            <Grid key={index}>
                <Paper square className={classes.activitiesSpacing}>
                    <Grid container >
                        <Grid item xs={1}>
                            {(() => {
                                if (activity.learningType === 'Investigación') {
                                    return (
                                        <div className={classes.colorLearningType} style={{ backgroundColor: '#57A8E7' }}></div>
                                    )
                                } else if (activity.learningType === 'Adquisición') {
                                    return (
                                        <div className={classes.colorLearningType} style={{ backgroundColor: '#E95D5D' }}></div>
                                    )
                                }else if (activity.learningType === 'Producción') {
                                    return (
                                        <div className={classes.colorLearningType} style={{ backgroundColor: '#C8951F' }}></div>
                                    )
                                }else if (activity.learningType === 'Discusión') {
                                    return (
                                        <div className={classes.colorLearningType} style={{ backgroundColor: '#087A4C' }}></div>
                                    )
                                }else if (activity.learningType === 'Colaboración') {
                                    return (
                                        <div className={classes.colorLearningType} style={{ backgroundColor: '#DFDF3F' }}></div>
                                    )
                                }else if (activity.learningType === 'Práctica') {
                                    return (
                                        <div className={classes.colorLearningType} style={{ backgroundColor: '#A75BCD' }}></div>
                                    )
                                }
                            })()}
                        </Grid>
                        <Grid item xs={11}>
                            <Grid container className={classes.activitySpacing}>
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
                                            <MenuItem value={'Presencial-Asincrono'}> Presencial-Asincrono</MenuItem>
                                            <MenuItem value={'Presencial-Sincrono'}> Presencial-Sincrono</MenuItem>
                                            <MenuItem value={'Online-Asincrono'}> Online-Asincrono</MenuItem>
                                            <MenuItem value={'Online-Sincrono'}> Online-Sincrono</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Tooltip title="Delete">
                                        <IconButton onClick={() => handleDeleteActivity(index)}>
                                            <DeleteForeverIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            <Grid container className={classes.activitySpacing}>
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
                                                onBlur={editActivity}
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
                                                onBlur={editActivity}
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
                            <Grid container className={classes.activitySpacingDescription}>
                                <Grid item sm={11}>
                                    <Typography variant="body2" color="textSecondary" > Descripción </Typography>
                                    <Grid className={classes.activitySpacingDescriptionBD}>
                                        <TextField
                                            multiline
                                            margin='dense'
                                            variant="outlined"
                                            name="description"
                                            value={description}
                                            onChange={handleInputChange}
                                            type="text"
                                            onBlur={editActivity}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        )
    }
    return (
        <>
            {
                listActivitiesArray()
            }


        </>
    )
}
