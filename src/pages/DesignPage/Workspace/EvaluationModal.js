import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, makeStyles, Typography } from '@material-ui/core'
import { useUiState } from 'contexts/ui/UiContext';
import types from 'types';
import React, { useState } from 'react'
import CloseIcon from '@material-ui/icons/Close';
import { useDesignState } from 'contexts/design/DesignContext';
import { useSocketState } from 'contexts/SocketContext';
import { useSnackbar } from 'notistack';
import { Evaluation } from './Evaluation';

const useStyles = makeStyles((theme) => ({
    spaceInit:{
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },buttonZone: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        [theme.breakpoints.down('xs')]: {
            flexWrap: 'wrap',
        },
    },resourceZone: {
        height: 'auto',
        [theme.breakpoints.up('xs')]: {
            height: '100%',
            overflow: 'auto',
            overflowX: 'hidden',
        },
    },contentSpace:{
        height: 'auto',
        paddingBottom: theme.spacing(6),
        [theme.breakpoints.up('xs')]: {
            height: 'calc(100vh - 500px)',
            overflow: 'auto'
        },
    }
}));

export const EvaluationModal = () => {
    const classes = useStyles();
    const { uiState, dispatch } = useUiState();
    const { designState } = useDesignState();
    const { design } = designState;
    const { socket } = useSocketState();
    const { learningActivityIndex } = uiState.evaluationData;
    const [ newEvaluation, setNewEvaluation ] = useState([...design.data.learningActivities[learningActivityIndex].evaluation]);
    const { enqueueSnackbar } = useSnackbar();

    const handleClose = () => {
        setNewEvaluation(design.data.learningActivities[learningActivityIndex].evaluation);
        dispatch({
            type: types.ui.setEvaluation,
            payload: {
                learningActivityIndex: null,
            }
        });
        dispatch({
            type: types.ui.toggleModal,
            payload: 'Evaluation',
        });
    };

    const handleAddEvaluation = () =>{
        const newEvaluationInArray = {
            type: 'Seleccionar',
            description: '',
        }
        setNewEvaluation([...newEvaluation, newEvaluationInArray]);
        if(uiState.userSaveDesign){
            dispatch({
                type: types.ui.setUserSaveDesign,
                payload: false,
            })
        };
    };

    const handleAddEvaluationInDesign = () =>{
        socket.emit('add-evaluation-in-activity', { designId: design._id, learningActivityID: design.data.learningActivities[learningActivityIndex].id, evaluation: [...newEvaluation]});
        dispatch({
            type: types.ui.toggleModal,
            payload: 'Evaluation',
        });
        enqueueSnackbar('Se han modificado sus evaluaciones correctamente', { variant: 'success', autoHideDuration: 2000 });
    };

    return (
        <>
            <Dialog onClose={handleClose} open={uiState.isEvaluationModalOpen} fullWidth={true} maxWidth={'md'} >
                <DialogTitle >
                    Evaluación de la actividad.
                </DialogTitle>
                <IconButton aria-label='close' className={classes.closeButton} onClick={handleClose}>
                    <CloseIcon/>
                </IconButton>
                <DialogContent dividers >
                    <Typography color='textSecondary' style={{marginBottom: 10}}> En el siguiente apartado el docente deberá definir las evaluaciones que el estudiante deberá realizar en cada actividad, se tienen 3 tipos de evaluaciones. La primera evaluación es de tipo diagnostico. La segunda de tipo Formativa. La tercera será de tipo sumativa.</Typography>
                    <div className={classes.buttonZone}>
                        <Button variant={'outlined'} color = {'primary'} onClick = {handleAddEvaluation}>Agregar evaluación</Button>
                    </div>
                    <Grid className={classes.contentSpace}>
                        <Box className={classes.resourceZone}>
                            <Box >
                            {
                                newEvaluation.map((evaluation, i) => <Evaluation key={`evaluation-${i}-learningActivity-${learningActivityIndex}`} index={i} evaluation = {evaluation} newEvaluation={newEvaluation} setNewEvaluation={setNewEvaluation} learningActivityIndex = {learningActivityIndex}/>)
                            }
                            </Box>
                        </Box>
                    </Grid>
                </DialogContent>
                <DialogActions >
                    <Button onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant='contained' color='primary' onClick={handleAddEvaluationInDesign}>
                        Guardar evaluación.
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
