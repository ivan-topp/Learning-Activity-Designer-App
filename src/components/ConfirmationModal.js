import React from 'react'
import CloseIcon from '@material-ui/icons/Close';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, makeStyles, Typography, } from '@material-ui/core';
import { useUiState } from 'contexts/ui/UiContext';
import types from 'types';
import { useSnackbar } from 'notistack';
import { useSocketState } from 'contexts/SocketContext';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    titleMargin:{
        margin: 'auto',
    },
    bodyMargin:{
        marginLeft: theme.spacing(5),
        marginRight: theme.spacing(5)
    }
}));

export const ConfirmationModal = ({ type, actionMutation, args }) => {
    const classes = useStyles();
    const { uiState, dispatch } = useUiState();
    const { enqueueSnackbar } = useSnackbar();
    const { socket } = useSocketState();

    const handleClose = () => {
        if (uiState.isConfirmationModalOpen) {
            dispatch({
                type: types.ui.toggleModal,
                payload: 'Confirmation',
            });
        }
        else if(uiState.isOtherConfirmationModalOpen) {
            dispatch({
                type: types.ui.toggleModal,
                payload: 'OtherConfirmation',
            });
        }
    };
    
    const confirmResult = async() =>{
        if (type === 'diseño') {
            await actionMutation.mutate(args);
            enqueueSnackbar('Su diseño se ha eliminado',  {variant: 'success', autoHideDuration: 2000});
        }else if(type === 'actividad'){
            socket.emit('delete-learningActivity', args );
            enqueueSnackbar('Su actividad se ha eliminado',  {variant: 'success', autoHideDuration: 2000});
        } else if(type === 'tarea'){
            socket.emit('delete-task', args);
            enqueueSnackbar('Su tarea se ha eliminado',  {variant: 'success', autoHideDuration: 2000});
        };
        if (uiState.isConfirmationModalOpen) {
            dispatch({
                type: types.ui.toggleModal,
                payload: 'Confirmation',
            });
        };
        if (uiState.isOtherConfirmationModalOpen) {
            dispatch({
                type: types.ui.toggleModal,
                payload: 'OtherConfirmation',
            });
        };
    };
    
    const renderConfirmationModal = () => {
        if (uiState.isConfirmationModalOpen) {
            return (
                <Dialog onClose={handleClose} open={uiState.isConfirmationModalOpen}>
                    <DialogTitle className = {classes.titleMargin} >
                        <Grid >
                            <HighlightOffIcon color="secondary" style={{ fontSize: 100 }}/>
                        </Grid>
                        Está seguro?
                    </DialogTitle>
                    <IconButton aria-label='close' className={classes.closeButton} onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                    <DialogContent className={classes.bodyMargin}>
                        <Typography> 
                            ¿Estás realmente seguro de que deseas eliminar tu {type}? Este proceso no se podrá deshacer luego de haber elegido la opción de eliminar. 
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button variant = 'contained' color='primary' onClick={confirmResult}>
                            Eliminar
                        </Button>
                    </DialogActions>
                </Dialog>
            )
        } else if(uiState.isOtherConfirmationModalOpen){
            return (<Dialog onClose={handleClose} open={uiState.isOtherConfirmationModalOpen}>
                <DialogTitle className = {classes.titleMargin} >
                    <Grid >
                        <HighlightOffIcon color="secondary" style={{ fontSize: 100 }}/>
                    </Grid>
                    Está seguro?
                </DialogTitle>
                <IconButton aria-label='close' className={classes.closeButton} onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
                <DialogContent className={classes.bodyMargin}>
                    <Typography> 
                        ¿Estás realmente seguro de que deseas eliminar tu {type}? Este proceso no se podrá deshacer luego de haber elegido la opción de eliminar. 
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant = 'contained' color='primary' onClick={confirmResult}>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
            )
        }
    }

    return (
        <>
            {   
                renderConfirmationModal()
            }
        </>
    )
}
