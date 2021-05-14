import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, makeStyles, Step, StepLabel, Stepper, TextField, Typography } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { BloomPiramid } from 'pages/DesignPage/Metadata/BloomPiramid';
import { BloomVerbList } from 'pages/DesignPage/Metadata/BloomVerbList';
import { useSocketState } from 'contexts/SocketContext';
import { useDesignState } from 'contexts/design/DesignContext';
import types from 'types';
import { useUiState } from 'contexts/ui/UiContext';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
    closeButton: {
        color: theme.palette.grey[500],
    },
    title: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    adornament: {
        display: 'flex',
        alignItems: 'flex-start'
    },
    steps: {
        padding: 0,
        marginTop: 30,
        marginBottom: 30,
    },
    stepContent: {
        margin: 20,
        [theme.breakpoints.down('xs')]: {
            margin: 10
        },
    }
}));

export const LearningResultModal = ({ design, isOpen }) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { socket/*, online*/, emitWithTimeout } = useSocketState();
    const { designState, dispatch: designDispatch } = useDesignState();
    const { uiState, dispatch: uiDispatch } = useUiState();
    const { category, verb, editing, index } = designState.currentLearningResult;
    const [ description, setDescription ] = useState(designState.currentLearningResult.description ?? '');
    const [activeStep, setActiveStep] = useState(0);
    const steps = ['Selecciona una categoría de bloom', 'Selecciona un verbo', 'Proporciona una descripción'];

    const isMounted = useRef(true);
    useEffect(() => {
        return () => {
            isMounted.current = false;
        }
    }, []);

    useEffect(() => {
        if(isMounted.current) setDescription(designState.currentLearningResult.description);
    }, [setDescription, designState.currentLearningResult.description]);

    const handleNext = () => {
        if(activeStep === 0 && category === null) return console.log('No ha seleccionado una categoría de bloom.');
        else if (activeStep === 1 && (verb === '' || !verb)) return console.log('No ha seleccionado un verbo de bloom.');
        if (isMounted.current) setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        if (isMounted.current) setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleClose = (e) => {
        uiDispatch({
            type: types.ui.toggleModal,
            payload: 'LearningResult',
        });
    };

    const handleCloseModal = () => {
        handleClose();
        if (isMounted.current) setActiveStep(0);
        setDescription('');
        designDispatch({ type: types.design.clearCurrentLearningResult });
    };

    const handleFinish = () => {
        if(!description || (description && description.trim() === '')) return console.log('No se ha ingresado una descripción.');
        designDispatch({
            type: types.design.setCurrentLearningResultField,
            payload: {
                field: 'description',
                value: description,
            }
        });
        if(!editing) socket?.emit('add-learning-result', { designId: design._id, learningResult: { verb, description } }, emitWithTimeout(
            (resp) => {
                if(!resp.ok) return enqueueSnackbar(resp.message, { variant: 'error', autoHideDuration: 2000 });
                if(uiState.userSaveDesign){
                    uiDispatch({
                        type: types.ui.setUserSaveDesign,
                        payload: false,
                    });
                };
                handleCloseModal();
            },
            () => enqueueSnackbar('Error al agregar el resultado de aprendizaje. Por favor revise su conexión. Tiempo de espera excedido.', { variant: 'error', autoHideDuration: 2000 }),
        ));
        else if (editing){
            socket?.emit('edit-learning-result', { designId: design._id, index, learningResult: { verb, description } }, emitWithTimeout(
                (resp) => {
                    if(!resp.ok) return enqueueSnackbar(resp.message, { variant: 'error', autoHideDuration: 2000 });
                    if(uiState.userSaveDesign){
                        uiDispatch({
                            type: types.ui.setUserSaveDesign,
                            payload: false,
                        });
                    };
                    handleCloseModal();
                },
                () => enqueueSnackbar('Error al editar el resultado de aprendizaje. Por favor revise su conexión. Tiempo de espera excedido.', { variant: 'error', autoHideDuration: 2000 }),
            ));
        };
        
    };

    return (
        <Dialog fullWidth open={isOpen} onClose={handleCloseModal} aria-labelledby="form-dialog-title">
            <DialogTitle style={{padding: '5px 5px 5px 16px'}}>
                <Box className={classes.title}>
                    <Box className={classes.ellipsis}>
                        {
                            !editing ? 'Nuevo resultado de aprendizaje' : 'Editar resultado de aprendizaje'
                        }
                    </Box>
                    <IconButton aria-label='close' className={classes.closeButton} onClick={handleCloseModal}>
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers style={{padding: 0}}>
                <Stepper 
                    classes={{root: classes.steps}}
                    activeStep={activeStep} 
                    alternativeLabel
                >
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {
                    (activeStep === 0)
                        ? <Box className={classes.stepContent}>
                            <Typography style={{marginLeft: 10, marginRight: 10, marginBottom:10}} align='justify'>
                                En la siguiente pirámide se encuentran las distintas categorías o habilidades de pensamiento descritas según la taxonomía de Benjamín Bloom.
                            </Typography>
                            <Typography style={{marginLeft: 10, marginRight: 10, marginBottom:10}} align='justify'>
                                Por favor seleccione la categoría que más sentido tenga con el resultado de aprendizaje que desea crear.
                            </Typography>
                            <BloomPiramid />
                        </Box>
                        : (activeStep === 1)
                            ? <Box className={classes.stepContent}>
                                <Typography style={{marginLeft: 10, marginRight: 10, marginBottom:10}} align='justify'>
                                    En la siguiente lista se encuentran los distintos verbos descritos por la taxonomía de Bloom disponibles para la categoría "{designState.bloomCategories.find(bc => bc._id === category).name }". 
                                </Typography>
                                <Typography style={{marginLeft: 10, marginRight: 10, marginBottom:10}} align='justify'>
                                    Por favor seleccione el verbo que más sentido tenga con el resultado de aprendizaje que desea crear.
                                </Typography>
                                <BloomVerbList />
                            </Box>
                            : <Box className={classes.stepContent}>
                                <Typography style={{marginLeft: 10, marginRight: 10, marginBottom:10}} align='justify'>
                                    Usted ha seleccionado el verbo "{verb}" correspondiente a la categoría "{designState.bloomCategories.find(bc => bc._id === category).name }".
                                </Typography>
                                <Typography style={{marginLeft: 10, marginRight: 10, marginBottom:10}} align='justify'>
                                    Por favor complete la descripción del resultado de aprendizaje.
                                </Typography>
                                <TextField
                                    multiline
                                    classes={{}}
                                    rows={6}
                                    variant="outlined"
                                    name="description"
                                    value={description ?? ''}
                                    onChange={({target})=> setDescription(target.value)}
                                    label="Descripción"
                                    type="text"
                                    InputProps={{
                                        style: {display: 'flex', alignItems: 'flex-start'},
                                        startAdornment: <InputAdornment 
                                            position="start" 
                                            style={{height: '100%'}}
                                            classes={{root: classes.adornament}}
                                        >
                                            <div style={{width: '100%', height: '100%'}}>
                                                {verb}
                                            </div>
                                        </InputAdornment>,
                                    }}
                                    fullWidth
                                />
                            </Box>
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
                        ? <Button variant="contained" color="primary" disabled = {activeStep === 2 && (description === null || description === '')} onClick={handleFinish}>
                            Finalizar
                        </Button>
                        : <Button variant="contained" color="primary" disabled = {activeStep === 0 ? category === null : activeStep === 1 && verb === null} onClick={handleNext}>
                            Siguiente
                        </Button>
                }
            </DialogActions>
        </Dialog>
    )
}