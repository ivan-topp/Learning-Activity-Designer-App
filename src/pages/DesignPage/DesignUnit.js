import { Button, Checkbox, Divider, FormControlLabel, Grid, IconButton, makeStyles, Paper, TextField, Tooltip, Typography } from '@material-ui/core'
import React, { useEffect } from 'react'
import { DesignActivity } from './DesignActivity';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { useSocketState } from '../../contexts/SocketContext';
import { StackedBar } from '../../components/StackedBar';
import { useForm } from '../../hooks/useForm';

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

export const DesignUnit = ({ design, index, tla }) => {
    const classes = useStyles();
    const { socket } = useSocketState();

    const [form, handleInputChange, , setValues] = useForm({
        title: tla.title,
        description: tla.description,
    });

    useEffect(() => {
        setValues({
            title: tla.title,
            description: tla.description,
        });
    }, [design, setValues, tla]);

    const { title, description } = form;

    const editUnit = ({target}) => {
        socket.emit('edit-unit-field', { designId: design._id, index, field: target.name, value: form[target.name] });
    };

    const handleDeleteUnit = () => {
        socket.emit('delete-tla', { designId: design._id, index });
    };

    const handleAddActivity = () => {
        socket.emit('new-activity', { designId: design._id, index });
    };

    const handleToggleLearningResult = (e, isSelected, result) => {
        if(isSelected){
            let indexLearningResults = 0;
            tla.learningResults.forEach((r, _indexLearningResults) => {
                if (r.verb === result.verb && r.description === result.description) indexLearningResults = _indexLearningResults;
            });

            socket.emit('delete-learning-result-from-tla', {
                designId: design._id,
                index,
                indexLearningResults
            });
        }else{
            socket.emit('add-learning-result-to-tla', {
                designId: design._id,
                index,
                result
            });
        }
    };

    const listTlaArray = () => {
        return (
            <Grid key={index}>
                <Paper className={classes.unitSpacing}>
                    <Grid container>
                        <Grid item xs={12} sm={5} className={classes.titleUnitSpacing}>
                            <TextField
                                margin='dense'
                                variant="outlined"
                                name="title"
                                value={title}
                                onChange={handleInputChange}
                                type="text"
                                onBlur={editUnit}
                                inputProps={{ maxLength: 30 }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={7} className={classes.graphicUnitSpacing}>
                            <StackedBar />
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
                            <Grid className={classes.gridActivity}>
                                { 
                                    design.data.tlas[index] && design.data.tlas[index].activities && design.data.tlas[index].activities.map((activity, i)=> <DesignActivity key={`activity-${i}-tla-${index}`} design={design} index={i} activity={activity} tlaIndex={index}/> ) 
                                }
                            </Grid>
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
                                    value={description}
                                    onChange={handleInputChange}
                                    type="text"
                                    onBlur={editUnit}
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
    }

    return (
        <>
            {
                listTlaArray()
            }
        </>
    )
}
