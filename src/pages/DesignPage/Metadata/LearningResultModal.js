import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles, Step, StepLabel, Stepper, TextField } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { BloomPiramid } from 'pages/DesignPage/Metadata/BloomPiramid';
import { BloomVerbList } from 'pages/DesignPage/Metadata/BloomVerbList';
import { useSocketState } from 'contexts/SocketContext';
import { useDesignState } from 'contexts/design/DesignContext';
import types from 'types';
import { useUiState } from 'contexts/ui/UiContext';

const useStyles = makeStyles((theme) => ({
    title: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    close: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    }
}));

export const LearningResultModal = ({ design, isOpen }) => {
    const classes = useStyles();
    const { socket/*, online*/ } = useSocketState();
    const { designState, dispatch: designDispatch } = useDesignState();
    const { dispatch: uiDispatch } = useUiState();
    const { category, verb, editing, index } = designState.currentLearningResult;
    const [ description, setDescription ] = useState(designState.currentLearningResult.description ?? '');
    const [activeStep, setActiveStep] = useState(0);
    const steps = ['Selecciona una categoría de bloom', 'Selecciona un verbo', 'Proporciona una descripción'];

    useEffect(() => {
        setDescription(designState.currentLearningResult.description);
    }, [setDescription, designState.currentLearningResult.description]);

    const handleNext = () => {
        if(activeStep === 0 && category === null) return console.log('No ha seleccionado una categoría de bloom.');
        else if (activeStep === 1 && verb === '') return console.log('No ha seleccionado un verbo de bloom.');
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleClose = (e) => {
        uiDispatch({
            type: types.ui.toggleModal,
            payload: 'LearningResult',
        });
    };

    const handleCloseModal = () => {
        handleClose();
        setActiveStep(0);
        designDispatch({ type: types.design.clearCurrentLearningResult });
    };

    const handleFinish = () => {
        if(description.trim() === '') return console.log('No se ha ingresado una descripción.');
        designDispatch({
            type: types.design.setCurrentLearningResultField,
            payload: {
                field: 'description',
                value: description,
            }
        });
        if(!editing) socket.emit('add-learning-result', { designId: design._id, learningResult: { verb, description } });
        else if (editing){
            socket.emit('edit-learning-result', { designId: design._id, index, learningResult: { verb, description } });
        }
        handleCloseModal();
    };

    return (
        <Dialog fullWidth open={isOpen} onClose={handleCloseModal} aria-labelledby="form-dialog-title">
            <div className={classes.title}>
                <DialogTitle id="form-dialog-title" onClose={handleCloseModal} >
                    {
                        !editing ? 'Nuevo resultado de aprendizaje' : 'Editar resultado de aprendizaje'
                    }
                </DialogTitle>
                <IconButton className={classes.close} aria-label="close" onClick={handleCloseModal}>
                    <Close />
                </IconButton>
            </div>
            <DialogContent>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {
                    (activeStep === 0)
                        ? <BloomPiramid />
                        : (activeStep === 1)
                            ? <BloomVerbList />
                            : <TextField
                                multiline
                                rows={6}
                                variant="outlined"
                                name="description"
                                value={description ?? ''}
                                onChange={({target})=> setDescription(target.value)}
                                label="Descripción"
                                type="text"
                                fullWidth
                            />
                }
            </DialogContent>
            <DialogActions>
                <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                >
                    Volver
                </Button>
                {
                    (activeStep === steps.length - 1)
                        ? <Button variant="contained" color="primary" onClick={handleFinish}>
                            Finalizar
                        </Button>
                        : <Button variant="contained" color="primary" onClick={handleNext}>
                            Siguiente
                        </Button>
                }
            </DialogActions>
        </Dialog>
    )
}