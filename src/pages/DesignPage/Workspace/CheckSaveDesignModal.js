import React from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useUiState } from 'contexts/ui/UiContext';
import { useHistory } from 'react-router-dom';
import types from 'types';

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

export const CheckSaveDesignModal = () => {
    const classes = useStyles();
    const { uiState, dispatch } = useUiState();
    const { url } = uiState.historyData;
    const history = useHistory();

    const handleClose = () => {
        dispatch({
            type: types.ui.closeModal,
            payload: 'CheckSaveDesign',
        });
    };

    const handleHistoryPush = () =>{
        dispatch({
            type: types.ui.setUserSaveDesign,
            payload: true,
        });
        dispatch({
            type: types.ui.closeModal,
            payload: 'CheckSaveDesign',
        });
        history.push(`${url}`);
    }

    return (
        <>
            <Dialog onClose={handleClose} open={uiState.isCheckSaveDesignModalOpen}>
                <DialogTitle className={classes.titleMargin} >
                    Está apunto de salir del diseño
                </DialogTitle>
                <IconButton aria-label='close' className={classes.closeButton} onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <Typography align = 'center' style ={{marginTop: 15, marginBottom: 25}}>
                        Usted está intentando salir del diseño actual, pero existen cambios que no han sido guardados. ¿Desea continuar sin guardar?
                    </Typography>
                    <Typography  variant = 'caption'>
                        IMPORTANTE: Al aceptar realizar esta acción los cambios no se guardaran.
                    </Typography>
                    <Box>
                        <Typography  variant = 'caption'>
                            RECOMENDACIÓN: Guarde sus cambios antes de salir de esta página.
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancelar
                        </Button>
                    <Button onClick={handleHistoryPush}>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
