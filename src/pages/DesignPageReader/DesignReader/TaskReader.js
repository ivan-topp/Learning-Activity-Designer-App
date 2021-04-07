import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Grid, makeStyles, Typography, Paper,} from '@material-ui/core';

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

export const TaskReader = forwardRef(({ index, task }, ref) => {
    const classes = useStyles();
    const hoursRef = useRef();
    const minutesRef = useRef();
    const descriptionRef = useRef();

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

    const listTasksArray = () => {
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
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="textSecondary" > Aprendizaje </Typography>
                                    <Typography>{task.learningType}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} >
                                        <Typography variant="body2" color="textSecondary" > Modalidad </Typography>
                                        <Typography>{task.modality}</Typography>
                                </Grid>
                            </Grid>
                            <Grid container className={classes.taskSpacing}>
                                <Grid item xs={12} sm={6} className={classes.grid}>
                                    <div style={{ width: '100%' }}>
                                        <Typography variant="body2" color="textSecondary"> Tiempo de trabajo </Typography>
                                        <div className={classes.timeField}>
                                            <Typography>{task.duration.hours}</Typography>
                                            <Typography style={{ marginLeft: 10, marginRight: 10 }}> : </Typography>
                                            <Typography>{task.duration.minutes}</Typography>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={6} >
                                        <Typography variant="body2" color="textSecondary" style={{marginBottom: 4, marginRight: 5}}> Formato </Typography>
                                        <Typography>{task.format}</Typography>
                                </Grid>
                            </Grid>
                            <Grid container className={classes.taskSpacingDescription}>
                                <Grid item sm={11}>
                                    <Typography variant="body2" color="textSecondary" > Descripción </Typography>
                                    <Grid className={classes.taskSpacingDescriptionBD}>
                                        <Typography>{task.description}</Typography>
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
                listTasksArray()
            }
        </>
    )
})
