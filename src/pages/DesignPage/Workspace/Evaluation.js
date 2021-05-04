import { Box, Divider, FormControl, Grid, IconButton, InputLabel, makeStyles, MenuItem, Select, TextField, Tooltip } from '@material-ui/core'
import React from 'react'
import { Delete } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    spaceResource:{
        marginTop: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    tooltip: {
        maxHeight: "25px",
        minHeight: "25px",
        minWidth: "25px",
        maxWidth: "25px",
    },
    icon:{
        maxHeight: "25px",
        minHeight: "25px",
        minWidth: "25px",
        maxWidth: "25px",
    },
    resourceEvaluationGrid:{
        display: 'grid',
        gridTemplateColumns: '95% 5%',
    },
}));

export const Evaluation = ({index, evaluation, newEvaluation, setNewEvaluation, learningActivityIndex}) => {
    const classes = useStyles();

    const changeType = (event) => {
        const newType = event.target.value;
        setNewEvaluation( newEvaluation => newEvaluation.map((evaluation, i) => {
            if ( i === index ) {
                evaluation.type = newType;
            }
            return evaluation;
        }));
    };

    const changeDescription = (event) => {
        const newDescription = event.target.value;
        setNewEvaluation( newEvaluation => newEvaluation.map((evaluation, i) => {
            if ( i === index ) {
                evaluation.description = newDescription;
            }
            return evaluation;
        }));
    };
    
    const handleDeleteResourceEvaluation = (index) =>{
        if (index === newEvaluation.length - 1) {
            setNewEvaluation([
                ...newEvaluation.slice(0, index),
            ])
        } else {
            setNewEvaluation([
                ...newEvaluation.slice(0, index),
                ...newEvaluation.slice(index + 1, newEvaluation.length)
            ])
        };
    };

    const evaluationActivity= () =>{
        return (
            <div key={index} className={classes.spaceResource}>
                <Grid >
                    <div className={classes.resourceEvaluationGrid}>
                        <div>
                            <FormControl fullWidth variant='outlined'>
                                <InputLabel id={`evaluation-${index}-learningActivity-${learningActivityIndex}`}> Tipo de evaluación </InputLabel>
                                <Select
                                    labelId={`evaluationtype-${index}-learningActivity-${learningActivityIndex}`}
                                    label='Tipo de evaluación'
                                    name='type'
                                    value={ evaluation.type }
                                    onChange ={ (e) => changeType(e) }
                                >
                                    <MenuItem value = {'Seleccionar'}> Seleccionar </MenuItem>
                                    <MenuItem value = {'Diagnostico'}> Diagnostico</MenuItem>
                                    <MenuItem value = {'Formativa'}> Formativa</MenuItem>
                                    <MenuItem value = {'Sumativa'}> Sumativa</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                variant='outlined'
                                margin='dense' 
                                name='description' 
                                value={ evaluation.description } 
                                onChange={ (e) => changeDescription(e) } 
                                label='Descripción' 
                                type = 'text'
                                fullWidth
                                multiline 
                                rows = {4}
                            />
                        </div>
                        <div>
                        <Box display="flex" flexDirection="row-reverse">
                                    <Box>
                                        <Tooltip title="Eliminar evaluación" className= {classes.tooltip}>
                                            <IconButton onClick={() => handleDeleteResourceEvaluation(index)}>
                                                <Delete className={classes.icon} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>
                        </div>
                    </div>
                <Divider style={{marginTop: 10}}/>
                </Grid>
            </div>
        )
    }
    return (
        <>
            {
                evaluationActivity()
            }
        </>
    )
}
