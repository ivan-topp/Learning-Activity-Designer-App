import React, { useEffect, useState } from 'react'
import CloseIcon from '@material-ui/icons/Close';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles, Typography, useTheme, } from '@material-ui/core';
import { useUiState } from 'contexts/ui/UiContext';
import types from 'types';
import { useSnackbar } from 'notistack';
import { useSocketState } from 'contexts/SocketContext';

const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    titleMargin: {
        margin: 'auto',
    },
    bodyMargin: {
        marginLeft: theme.spacing(5),
        marginRight: theme.spacing(5)
    }
}));

export const ConfirmationModal = () => {
    const classes = useStyles();
    const theme = useTheme();
    const { uiState, dispatch } = useUiState();
    const { type, args, actionMutation } = uiState.confirmModalData;
    const { enqueueSnackbar } = useSnackbar();
    const { socket, emitWithTimeout } = useSocketState();
    const [message, setMessage] = useState('');

    useEffect(() => {
        if(type === 'carpeta') setMessage(`¿Estás realmente seguro de que deseas eliminar tu carpeta? `);
        else setMessage(`¿Estás realmente seguro de que deseas eliminar tu ${type}?`);
    }, [type]);
    
    const handleClose = () => {
        dispatch({
            type: types.ui.closeModal,
            payload: 'Confirmation',
        });
        setTimeout(() => dispatch({
            type: types.ui.setConfirmData,
            payload: {
                type: null,
                args: null,
                actionMutation: null,
            }
        }), theme.transitions.duration.enteringScreen);
    };

    const confirmResult = async () => {
        let socketEvent = null;
        let errorMessage = null;
        if (type === 'diseño' || type === 'carpeta') {
            await actionMutation.mutate(args);
        } else if (type === 'actividad') {
            socketEvent = 'delete-learningActivity';
            errorMessage = 'Error al eliminar la actividad.';
        } else if (type === 'tarea') {
            socketEvent = 'delete-task';
            errorMessage = 'Error al eliminar la tarea.';
        } else if (type === 'comentario') {
            socketEvent = 'delete-comment';
            errorMessage = 'Error al eliminar el comentario.';
        } else if (type === 'resultado de aprendizaje') {
            socketEvent = 'delete-learning-result';
            errorMessage = 'Error al eliminar el resultado de aprendizaje.';
        }
        if(socketEvent){
            socket?.emit(socketEvent, args, emitWithTimeout(
                (resp) => {
                    if(resp.ok && uiState.userSaveDesign){
                        dispatch({
                            type: types.ui.setUserSaveDesign,
                            payload: false,
                        });
                    }
                    return enqueueSnackbar(resp.message, { variant: resp.ok ? 'success': 'error', autoHideDuration: 2000 });
                },
                () => enqueueSnackbar(errorMessage + ' Por favor revise su conexión. Tiempo de espera excedido.', { variant: 'error', autoHideDuration: 2000 }),
            ));
        }
        handleClose();
    };

    const renderConfirmationModal = () => {
        return (
            <Dialog onClose={handleClose} open={uiState.isConfirmationModalOpen}>
                <DialogTitle className={classes.titleMargin} >
                    Eliminar {type}
                    </DialogTitle>
                <IconButton aria-label='close' className={classes.closeButton} onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <Typography align = 'center' style ={{marginTop: 15, marginBottom: 25}}>
                        {message}    
                    </Typography>
                    <Typography align = 'center' variant = 'caption'>
                        { (type !== 'carpeta') 
                            ? 'IMPORTANTE: Este proceso no se podrá deshacer luego de haber elegido la opción de eliminar.'
                            : 'IMPORTANTE: Recuerda que se eliminarán también las carpetas y diseños de aprendizaje que se encuentren al interior de esta o de sus carpetas hijas y este proceso no se podrá deshacer luego de haber elegido la opción de eliminar.' }  
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancelar
                        </Button>
                    <Button variant='contained' color='primary' onClick={confirmResult}>
                        Eliminar
                        </Button>
                </DialogActions>
            </Dialog>
        )
    }
    return (
        <>
            {
                renderConfirmationModal()
            }
        </>
    )
}
