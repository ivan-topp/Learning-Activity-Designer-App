import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles, Step, StepLabel, Stepper, TextField } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { BloomPiramid } from './BloomPiramid';
import { BloomVerbList } from './BloomVerbList';
import { useSocketState } from '../contexts/SocketContext';

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

export const LearningResultModal = ({ designId, isOpen, handleClose }) => {
    const classes = useStyles();
    const { socket/*, online*/ } = useSocketState();
    const [category, setCategory] = useState(null);
    const [verb, setVerb] = useState('');
    const [description, setDescription] = useState('');
    const [activeStep, setActiveStep] = useState(0);
    const steps = ['Selecciona una categoría de bloom', 'Selecciona un verbo', 'Proporciona una descripción'];

    const handleNext = () => {
        if(activeStep === 0 && category === null) return console.log('No ha seleccionado una categoría de bloom.');
        else if (activeStep === 1 && verb === '') return console.log('No ha seleccionado un verbo de bloom.');
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleFinish = () => {
        if(description.trim() === '') return console.log('No se ha ingresado una descripción.');
        console.log(category, verb, description);

        socket.emit('add-learning-result', { designId, learningResult: { verb, description } });

        handleClose();
        setActiveStep(0);
        setCategory(null);
        setVerb('');
        setDescription('');
    };


    return (
        <Dialog fullWidth open={isOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
            <div className={classes.title}>
                <DialogTitle id="form-dialog-title" onClose={handleClose} >
                    Nuevo resultado de aprendizaje
                </DialogTitle>
                <IconButton className={classes.close} aria-label="close" onClick={handleClose}>
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
                        ? <BloomPiramid index={category} setCategory={setCategory}/>
                        : (activeStep === 1)
                            ? <BloomVerbList active={verb} setVerb={setVerb} category={category} />
                            : <TextField
                                multiline
                                rows={6}
                                variant="outlined"
                                name="description"
                                value={description}
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