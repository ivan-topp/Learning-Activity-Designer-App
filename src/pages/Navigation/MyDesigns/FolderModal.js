import React, { useState } from 'react';
import {
    Button,
    makeStyles,
    IconButton,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography
} from '@material-ui/core';
import { createFolder } from 'services/FolderService';

import { Close } from '@material-ui/icons';
import { useUiState } from 'contexts/ui/UiContext';
import types from 'types';
import { useMutation, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';

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
    },
    folderNameInput: {
        marginTop: 20,
        marginBottom: 20,
    }
}));

export const FolderModal = () => {

    const classes = useStyles();
    const { uiState, dispatch } = useUiState();
    const { folderPath, folder, isFolderModalOpen } = uiState;
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const [error, setError] = useState(null);
    const [name, setName] = useState(folder.name);

    const createFolderMutation = useMutation(createFolder, {
        onMutate: async () => {
            await queryClient.cancelQueries(['folders', folderPath]);            
        },
        onSettled: () => {
            queryClient.invalidateQueries(['folders', folderPath]);
        },
        onError: (error) => {
            enqueueSnackbar(error.message,  {variant: 'error', autoHideDuration: 2000});
        },
        onSuccess: data => {
            handleCloseModal();
        }
    });

    const handleChangeName = ({target}) => {
        if(!!error) setError(null);
        setName(target.value);
    };

    const handleCloseModal = () => {
        dispatch({
            type: types.ui.toggleModal,
            payload: 'Folder',
        });
        dispatch({
            type: types.ui.setFolder,
            payload: {
                _id: null,
                name: '',
            }
        });
        setError(null);
    };

    const handleCreateFolder = async (e) => {
        if (name.trim() !== ''){
            await createFolderMutation.mutate({path: folderPath, folderName: name});
        } else {
            setError('Este campo es obligatorio.');
        }
    };

    return (
        <Dialog fullWidth open={isFolderModalOpen} aria-labelledby="form-dialog-title">
            <div className={classes.title}>
                <DialogTitle id="form-dialog-title" onClose={handleCloseModal} >
                    {
                        !folder._id ? 'Nueva Carpeta' : 'Editar Carpeta'
                    }
                </DialogTitle>
                <IconButton className={classes.close} aria-label="close" onClick={handleCloseModal}>
                    <Close />
                </IconButton>
            </div>
            <DialogContent>
                <Typography style={{marginBottom: 20}}>
                    Usted está por { !folder._id ? 'crear' : 'editar' } una nueva carpeta.
                    Por favor ingrese el { !folder._id ? '' : 'nuevo' } nombre para su carpeta en la siguiente entrada de texto.
                </Typography>
                <Typography variant='caption' >
                    Importante: No puede existir una carpeta en el directorio con el mismo nombre.
                </Typography>
                <TextField 
                    className={classes.folderNameInput}
                    error={!!error}
                    helperText={error}
                    margin="dense"
                    variant="outlined"
                    name="name"
                    value={name}
                    onChange={handleChangeName}
                    label="Nombre Carpeta"
                    type="text"
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseModal}>
                    Cancelar
                </Button>
                <Button variant="contained" color="primary" onClick={handleCreateFolder}>
                    Crear Carpeta
                </Button>
            </DialogActions>
        </Dialog>
    )
}
