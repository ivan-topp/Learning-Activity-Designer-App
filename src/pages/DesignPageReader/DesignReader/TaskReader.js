import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { makeStyles, Typography, Paper, Box, } from '@material-ui/core';

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
        //display: 'flex',
        [theme.breakpoints.down('md')]: {
            marginTop: 10,
        },
    },
    format: {
        gridArea: 'format',
        alignSelf: 'flex-end',
        [theme.breakpoints.down('md')]: {
            marginTop: 10,
        },
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
            <Box key={index} style={{ height: '100%' }}>
                <Paper square className={classes.tasksSpacing}>
                    <Box>
                        <Box style={{ display: 'flex', position: 'relative', height: '100%', width: '100%' }}>
                            {(() => {
                                if (task.learningType === 'Investigación') {
                                    return (
                                        <div className={classes.colorLearningType} style={{ backgroundColor: '#57A8E7' }}></div>
                                    )
                                } else if (task.learningType === 'Adquisición') {
                                    return (
                                        <div className={classes.colorLearningType} style={{ backgroundColor: '#E95D5D' }}></div>
                                    )
                                } else if (task.learningType === 'Producción') {
                                    return (
                                        <div className={classes.colorLearningType} style={{ backgroundColor: '#C8951F' }}></div>
                                    )
                                } else if (task.learningType === 'Discusión') {
                                    return (
                                        <div className={classes.colorLearningType} style={{ backgroundColor: '#087A4C' }}></div>
                                    )
                                } else if (task.learningType === 'Colaboración') {
                                    return (
                                        <div className={classes.colorLearningType} style={{ backgroundColor: '#DFDF3F' }}></div>
                                    )
                                } else if (task.learningType === 'Práctica') {
                                    return (
                                        <div className={classes.colorLearningType} style={{ backgroundColor: '#A75BCD' }}></div>
                                    )
                                }
                            })()}

                            <div className={classes.taskBody}>
                                <div className={classes.gridContainer}>
                                    <div className={classes.learningTypeContainer}>
                                        <Box className={classes.learningType}>
                                            <Typography variant="body2" color="textSecondary" > Aprendizaje </Typography>
                                            <Typography>{task.learningType}</Typography>
                                        </Box>
                                    </div>
                                    <div className={classes.modality}>
                                        <Typography variant="body2" color="textSecondary" > Modalidad </Typography>
                                        <Typography>{task.modality}</Typography>
                                    </div>
                                    <div style={{ width: '100%', gridArea: 'workingTime', marginTop: 3 }}>
                                        <Typography variant="body2" color="textSecondary" gutterBottom> Tiempo de trabajo </Typography>
                                        <div className={classes.timeField}>
                                            <Typography>{task.duration.hours}</Typography>
                                            <Typography style={{ marginLeft: 10, marginRight: 10 }}> : </Typography>
                                            <Typography>{task.duration.minutes} (hrs:mins)</Typography>
                                        </div>
                                    </div>
                                    <Box className={classes.format}>
                                        <Typography variant="body2" color="textSecondary" style={{ marginBottom: 4, marginRight: 5 }}> Formato </Typography>
                                        <Typography>{task.format}</Typography>
                                    </Box>
                                    <Box style={{ gridArea: 'description', marginTop: 10, wordBreak: 'break-word'}}>
                                        <Typography variant="body2" color="textSecondary" > Descripción </Typography>
                                        <Box className={classes.taskSpacingDescriptionBD}>
                                            <Typography>{task.description}</Typography>
                                        </Box>
                                    </Box>
                                </div>
                            </div>
                        </Box>
                    </Box>
                </Paper>
            </Box>
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
