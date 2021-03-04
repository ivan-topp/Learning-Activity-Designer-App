import { Box, Button, Checkbox, Divider, FormControlLabel, Grid, IconButton, makeStyles, Paper, TextField, Tooltip, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { DesignActivity } from './DesignActivity';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { useSocketState } from '../../contexts/SocketContext';
import { StackedBar } from '../../components/StackedBar';

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
    spacingDescriptionTLA: {
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
    gridActivity: {
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

export const DesignUnit = ({ design }) => {
    const classes = useStyles();
    const { socket } = useSocketState();
    const [tlaArray, setTlaArray] = useState(design.data.tlas);

    useEffect(() => {
        setTlaArray(design.data.tlas);
    }, [design]);

    const changeDescription = (event, index) => {
        const newDescription = event.target.value;
        setTlaArray(tlaArray => tlaArray.map((tla, indexTla) => {
            if (indexTla === index) {
                tla.description = newDescription;
            }
            return tla;
        }));

    };

    const changeTitle = (event, index) => {
        const newTitle = event.target.value;
        setTlaArray(tlaArray => tlaArray.map((tla, indexTla) => {
            if (indexTla === index) {
                tla.title = newTitle;
            }
            return tla;
        }));
    };

    const editUnit = (index, target) => {
        socket.emit('edit-unit-field', { designId: design._id, index, field: target.name, value: target.value });
    };

    const handleDeleteUnit = (index) => {
        socket.emit('delete-tla', { designId: design._id, index });
    };

    const handleAddActivity = () => {
        console.log("Agregar nueva Actividad");
    };
    
    const handleToggleLearningResult = (e, tlaIndex, isSelected, result) => {
        if(isSelected){
            let index = 0;
            tlaArray[tlaIndex].learningResults.forEach((r, _index) => {
                if (r.verb === result.verb && r.description === result.description) index = _index;
            });
            socket.emit('delete-learning-result-from-tla', {
                designId: design._id,
                tlaIndex,
                index
            });
        }else{
            socket.emit('add-learning-result-to-tla', {
                designId: design._id,
                tlaIndex,
                result
            });
        }
    };

    const listTlaArray = () => {
        return (
            tlaArray.map((tla, index) => (
                <Grid className={classes.unitSpacing} key={index}>
                    <Paper>
                        <Grid container>
                            <Grid item xs={12} sm={5} className={classes.titleUnitSpacing}>
                                <TextField
                                    margin='dense'
                                    variant="outlined"
                                    name="title"
                                    value={tla.title}
                                    onChange={(event) => changeTitle(event, index)}
                                    type="text"
                                    onBlur={(event) => editUnit(index, event.target)}
                                    inputProps={{ maxLength: 30 }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={7} className={classes.graphicUnitSpacing}>
                                <StackedBar />
                                <Tooltip title="Delete">
                                    <IconButton onClick={() => handleDeleteUnit(index)}>
                                        <DeleteForeverIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Grid container spacing={2} >
                            <Grid item xs={12} sm={8}>
                                <Box boxShadow={1} className={classes.gridActivity}>
                                    <DesignActivity />
                                </Box>
                                <Grid container>
                                    <Grid item />
                                    <Grid item className={classes.buttonPos}>
                                        <Button size="small" variant="outlined" onClick={handleAddActivity}> Agregar Tarea </Button>
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
                                        value={tla.description}
                                        onChange={(event) => changeDescription(event, index)}
                                        type="text"
                                        onBlur={(event) => editUnit(index, event.target)}
                                        fullWidth
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
                                                        checked={!!tla.learningResults.find(lr=> lr.verb === result.verb)} 
                                                        onChange={(e)=>handleToggleLearningResult(e, 
                                                            index, 
                                                            !!tla.learningResults.find(lr=> lr.verb === result.verb),
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
                </Grid>
            )
            )
        )
    }

    return (
        <>
            {  listTlaArray()}
        </>
    )
}
