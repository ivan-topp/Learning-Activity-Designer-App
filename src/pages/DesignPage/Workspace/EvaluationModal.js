import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles, TextField, Typography } from '@material-ui/core'
import { useUiState } from 'contexts/ui/UiContext';
import types from 'types';
import React, { useState } from 'react'
import CloseIcon from '@material-ui/icons/Close';
import { useDesignState } from 'contexts/design/DesignContext';
import { useSocketState } from 'contexts/SocketContext';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}));

export const EvaluationModal = () => {
    const classes = useStyles();
    const { uiState, dispatch } = useUiState();
    const { designState } = useDesignState();
    const { design } = designState;
    const { socket } = useSocketState();
    const { enqueueSnackbar } = useSnackbar();
    const { learningActivityIndex } = uiState.evaluationData;
    const [ newEvaluation, setNewEvaluation ] = useState(design.data.learningActivities[learningActivityIndex].evaluation);

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

    const handleAddEvaluationInDesign = () =>{
        socket.emit('add-evaluation-in-activity', { designId: design._id, learningActivityID: design.data.learningActivities[learningActivityIndex].id, evaluation: newEvaluation});
        dispatch({
            type: types.ui.toggleModal,
            payload: 'Evaluation',
        });
        enqueueSnackbar('Se ha agregado su evaluación correctamente', { variant: 'success', autoHideDuration: 2000 });
    };

    const changeTitle = (e) => {
        const newTitle = e.target.value;
        setNewEvaluation({
            ...newEvaluation,
            title: newTitle,
        });
    };

    const changeDescription = (e) => {
        const newDescription = e.target.value;
        setNewEvaluation({
            ...newEvaluation,
            description: newDescription,
        });
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
                    <Typography color='textSecondary' style={{marginBottom: 10}}> Lorem ipsum dolor sit amet consectetur adipiscing elit dapibus leo pharetra semper, nisl vivamus sodales vitae morbi libero quis et eu. Magna hendrerit congue odio placerat mus auctor donec iaculis, primis feugiat metus et etiam arcu erat, natoque malesuada rhoncus fames ultricies porta montes. Habitant tellus imperdiet eget himenaeos scelerisque tincidunt et habitasse posuere metus, potenti enim diam euismod est nostra magnis inceptos accumsan odio, nisi quis litora fusce montes class orci phasellus curae. Congue facilisi metus ante mattis ad nec inceptos, lacinia arcu tempor enim a suscipit, curabitur dignissim feugiat purus proin habitasse.</Typography>
                    <TextField
                        variant='outlined'
                        margin='dense' 
                        name='title' 
                        value={ newEvaluation.title } 
                        onChange={ (e) => changeTitle(e) } 
                        label='Título' 
                        type='text' 
                        fullWidth 
                    />
                    <TextField
                        variant='outlined'
                        margin='dense' 
                        name='description' 
                        value={ newEvaluation.description } 
                        onChange={(e) => changeDescription (e)} 
                        label='Descripción' 
                        type='text' 
                        fullWidth 
                        multiline
                        rows = {4}
                    />
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
