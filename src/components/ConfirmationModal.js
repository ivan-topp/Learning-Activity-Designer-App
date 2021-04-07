import React, { useEffect, useState } from 'react'
import CloseIcon from '@material-ui/icons/Close';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles, Typography, } from '@material-ui/core';
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
    const { uiState, dispatch } = useUiState();
    const { type, args, actionMutation } = uiState.confirmModalData;
    const { enqueueSnackbar } = useSnackbar();
    const { socket } = useSocketState();
    const [message, setMessage] = useState('');

    useEffect(() => {
        if(type === 'carpeta') setMessage(`¿Estás realmente seguro de que deseas eliminar tu carpeta? Recuerda que se eliminarán también las carpetas y diseños de aprendizaje que se encuentren al interior de esta o de sus carpetas hijas y este proceso no se podrá deshacer luego de haber elegido la opción de eliminar.`);
        else setMessage(`¿Estás realmente seguro de que deseas eliminar tu ${type}? Este proceso no se podrá deshacer luego de haber elegido la opción de eliminar.`);
    }, [type]);
    
    const handleClose = () => {
        dispatch({
            type: types.ui.setConfirmData,
            payload: {
                type: null,
                args: null,
                actionMutation: null,
            }
        });
        dispatch({
            type: types.ui.toggleModal,
            payload: 'Confirmation',
        });
    };

    const confirmResult = async () => {
        if (type === 'diseño' || type === 'carpeta') {
            await actionMutation.mutate(args);
        } else if (type === 'actividad') {
            socket.emit('delete-learningActivity', args);
            enqueueSnackbar('Su actividad se ha eliminado', { variant: 'success', autoHideDuration: 2000 });
        } else if (type === 'tarea') {
            socket.emit('delete-task', args);
            enqueueSnackbar('Su tarea se ha eliminado', { variant: 'success', autoHideDuration: 2000 });
        }
        dispatch({
            type: types.ui.toggleModal,
            payload: 'Confirmation',
        });
    };

    const renderConfirmationModal = () => {
        return (
            <Dialog onClose={handleClose} open={uiState.isConfirmationModalOpen}>
                <DialogTitle className={classes.titleMargin} >
                    ¿Estás seguro?
                    </DialogTitle>
                <IconButton aria-label='close' className={classes.closeButton} onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <Typography>
                        {message}    
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
