import React, { useEffect, useState } from 'react'
import { Grid, IconButton, makeStyles, Typography, Tooltip, Box, Paper, TextField} from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { useSocketState } from '../../contexts/SocketContext';
import { Alert } from '@material-ui/lab';
const useStyles = makeStyles((theme) => ({
    activitySpacing:{
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(1)
    },
    trashIcon:{
        display: 'flex',
    },
    activitiesSpacing:{
        marginTop: theme.spacing(1),
        background: theme.palette.background.workSpace
    },
    activitySpacingDescription:{
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(2),
    },
    activitySpacingDescriptionBD:{
        marginBottom: theme.spacing(1),
    },
    colorLearningType: {
        width: '100%',
        height: '100%',
    }
}));

export const DesignActivity = ({ design, index }) => {
    const classes = useStyles();
    const { socket } = useSocketState();
    const [ activitiesArray, setActivitiesArray ] =  useState(design.data.tlas[index].activities);
    
    useEffect(() => {
        setActivitiesArray(design.data.tlas[index].activities)
    }, [design, index]);

    const changeDescription = (event, index)=>{
        const newDescription = event.target.value;
        setActivitiesArray( activitiesArray => activitiesArray.map( (activity, indexActivity) => {
            if ( indexActivity === index ) {
                activity.description = newDescription;
            }
            return activity;
        }));
    };

    const editActivity = ( indexActivity, target ) => {
        socket.emit('edit-activity-field', { designId: design._id, index, indexActivity, field: target.name, value: target.value });
    };

    const handleDeleteActivity = (indexActivity)=> {
        socket.emit('delete-activity', { designId: design._id, index, indexActivity });
    };
    
    const listActivitiesArray = () =>{
        return (
            activitiesArray.map(( activity, index ) =>(
                <Grid key={index}>
                    <Paper square className={classes.activitiesSpacing}>
                        <Grid container >
                            <Grid item xs={1}>
                                {(() => {
                                    if (activity.learningType === 'Investigación' ) {
                                        return (
                                        <div className={classes.colorLearningType} style={{backgroundColor:'#57A8E7'}}></div>
                                        )
                                    } else if (activity.learningType === 'Práctica') {
                                    return (
                                        <div className={classes.colorLearningType} style={{backgroundColor:'#A75BCD'}}></div>
                                    )
                                    } 
                                })()}
                            </Grid>
                            <Grid item xs={11}>
                                <Grid container className={classes.activitySpacing}>
                                    <Grid item xs={6} sm={3}>
                                        <Typography variant="body2" color="textSecondary" > Aprendizaje </Typography>
                                        <Typography variant="body2"  > {activity.learningType}</Typography>
                                        
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Typography variant="body2" color="textSecondary" > Tiempo </Typography>
                                        <Typography variant="body2" > {activity.duration} (min) </Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Typography variant="body2" color="textSecondary" > Modalidad </Typography>
                                        <Typography variant="body2" > {activity.modality} </Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={2}>
                                        <Typography variant="body2" color="textSecondary" > Formato </Typography>
                                        <Typography variant="body2" > {activity.format}</Typography>
                                    </Grid>
                                    
                                    <Grid item xs={6} sm={1} className={classes.trashIcon}>
                                        <Tooltip title="Delete"> 
                                            <IconButton onClick={()=>handleDeleteActivity(index)}>
                                                <DeleteForeverIcon fontSize="small"/>
                                            </IconButton>
                                        </Tooltip>
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
                                                value={activity.description}
                                                onChange={(event) => changeDescription(event, index)}
                                                type = "text"
                                                onBlur={(event)=>editActivity(index, event.target)}
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
            )
        )
    }
    return (
        <>  
            {
                /*listActivitiesArray()*/
                activitiesArray ? listActivitiesArray() : <Alert severity="info">Usted aún no tiene actividades en su unidad</Alert> 
            }
            

        </>
    )
}
