import { Button, Divider, Grid, IconButton, makeStyles, Paper, TextField, Tooltip, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { DesignActivity } from './DesignActivity';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { useSocketState } from '../../contexts/SocketContext';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
    unitSpacing:{
        marginTop: theme.spacing(3),
    },
    titleUnitSpacing:{
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(1)
    },
    graphicUnitSpacing:{
        marginTop: theme.spacing(3),
        marginLeft: "auto",
    },
    trashIcon:{
        marginLeft: "auto",
    },
    spacingDescriptionTLA:{
        marginTop: theme.spacing(1),
    },
    spacingDescription:{
        marginRight: theme.spacing(2)
    },
    spacingLinkedResults:{
        marginTop: theme.spacing(2),
    },
    buttonPos:{
        marginTop: theme.spacing(1),
        marginLeft: "auto",
    },
    gridActivity:{
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(1),
    },
}));

export const DesignUnit = ({ design }) => {
    const classes = useStyles();
    const { socket } = useSocketState();
    const [ tlaArray, setTlaArray ] =  useState(design.data.tlas);
    useEffect(() => {
        setTlaArray(design.data.tlas)
    }, [design]);
    
    const changeDescription = (event, index)=>{
        const newDescription = event.target.value;
        setTlaArray( tlaArray => tlaArray.map( (tla, indexTla) => {
            if ( indexTla === index ) {
                tla.description = newDescription;
            }
            return tla;
        }));

    };

    const changeTitle = (event, index)=>{
        const newTitle = event.target.value;
        setTlaArray( tlaArray => tlaArray.map( (tla, indexTla) => {
            if ( indexTla === index ) {
                tla.title = newTitle;
            }
            return tla;
        }));
    };
    
    const editUnit = ( index, target ) => {
        socket.emit('edit-unit-field', { designId: design._id, index, field: target.name, value: target.value });
    };

    const handleDeleteUnit = ( index )=> {
        socket.emit('delete-tla', { designId: design._id, index });
    };

    const handleAddActivity = (index) => {
        socket.emit('new-activity', { designId: design._id, index });
    };

    const listTlaArray = () =>{
        return (
            tlaArray.map(( tla, index ) =>(
                    <Grid key={index}>
                        <Paper className={classes.unitSpacing}>
                            <Grid container>
                                <Grid item xs={11} sm={5} className={classes.titleUnitSpacing}>
                                    <Typography component={'span'} >
                                    <TextField
                                        margin='dense'
                                        variant="outlined"
                                        name="title"
                                        value={ tla.title }
                                        onChange={(event) => changeTitle(event, index)}
                                        type = "text"
                                        onBlur={(event)=>editUnit(index, event.target)}
                                        inputProps={{ maxLength: 30 }}
                                        fullWidth
                                    />
                                    </Typography>
                                </Grid>
                                <Grid item xs={11} sm={6} className={classes.graphicUnitSpacing}>
                                    <Typography> Barra de aprendizaje Unidad</Typography>
                                </Grid>
                                <Grid item className={classes.trashIcon}>
                                    <Tooltip title="Delete"> 
                                        <IconButton onClick={()=>handleDeleteUnit(index)}>
                                            <DeleteForeverIcon fontSize="small"/>
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            <Divider/>
                            <Grid container spacing={2} >
                                <Grid item xs={12} sm={8}>
                                    <Grid className={classes.gridActivity}>
                                        <DesignActivity design={design} index={index}/>
                                    </Grid>
                                    <Grid container>
                                        <Grid item />
                                        <Grid item  className={classes.buttonPos}>
                                            <Button size="small" variant="outlined" onClick={()=>handleAddActivity(index)}> Agregar Tarea </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={4} >
                                    <Typography variant="body2" className={classes.spacingDescriptionTLA} color="textSecondary"> Descripción Unidad de aprendizaje </Typography>
                                    <Grid className={classes.spacingDescription}>
                                        <TextField
                                            multiline
                                            margin='dense'
                                            variant="outlined"
                                            name="description"
                                            value={ tla.description }
                                            onChange={(event) => changeDescription(event, index)}
                                            type = "text"
                                            onBlur={(event)=>editUnit(index, event.target)}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Typography variant="body2" className={classes.spacingLinkedResults} color="textSecondary"> Resultados Vinculados </Typography>
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
            /*listTlaArray() */ 
            (tlaArray === undefined) ? <Alert severity="info">Usted aún no tiene unidades en su diseño</Alert> : listTlaArray()
        }
        </>
    )
}
