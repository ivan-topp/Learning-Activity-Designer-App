import React, { useEffect, useState } from 'react';
import {
    Button,
    makeStyles,
    IconButton,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    useTheme
} from '@material-ui/core';
import { createFolder, renameFolder } from 'services/FolderService';

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
    const theme = useTheme();
    const { uiState, dispatch } = useUiState();
    const { folderPath, folder, isFolderModalOpen } = uiState;
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const [error, setError] = useState(null);
    const [name, setName] = useState(folder.name);

    useEffect(() => {
        setName(folder.name);
    }, [folder.name, setName]);

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
            enqueueSnackbar('Carpeta creada con éxito.',  {variant: 'success', autoHideDuration: 2000});
            handleCloseModal();
        }
    });

    const renameFolderMutation = useMutation(renameFolder, {
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
            enqueueSnackbar('Nombre de carpeta cambiado con éxito.',  {variant: 'success', autoHideDuration: 2000});
            handleCloseModal();
        }
    });

    const handleChangeName = ({target}) => {
        if(!!error) setError(null);
        setName(target.value);
    };

    const handleCloseModal = () => {
        dispatch({
            type: types.ui.closeModal,
            payload: 'Folder',
        });
        setTimeout(() => dispatch({
            type: types.ui.setFolder,
            payload: {
                _id: null,
                name: '',
            }
        }), theme.transitions.duration.enteringScreen);
        setName('');
        setError(null);
    };

    const handleCreateFolder = async (e) => {
        if (name.trim() === '') return setError('Este campo es obligatorio.');
        if (name.trim() === '/' || name.trim().toLowerCase() === 'mis diseños') return setError('Nombre de carpeta no permitido.');
        await createFolderMutation.mutate({path: folderPath, folderName: name.trim()});
    };
    
    const handleRenameFolder = async (e) => {
        if (name.trim() === '') return setError('Este campo es obligatorio.');
        if (name.trim() === '/' || name.trim().toLowerCase() === 'mis diseños') return setError('Nombre de carpeta no permitido.');
        if (name.trim().toLowerCase() === folder.name.trim().toLowerCase()) return handleCloseModal();
        await renameFolderMutation.mutate({id: folder._id, name});
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
                    Usted está por { !folder._id ? 'crear una nueva carpeta' : 'editar una carpeta' }.
                    Por favor ingrese el { !folder._id ? '' : 'nuevo' } nombre para su carpeta en la siguiente entrada de texto.
                </Typography>
                <Typography variant='caption' >
                    IMPORTANTE: No puede existir una carpeta en el directorio con el mismo nombre.
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
                {
                    !folder._id 
                        ? <Button variant="contained" color="primary" onClick={handleCreateFolder}>
                            Crear Carpeta
                            </Button>
                        : <Button variant="contained" color="primary" onClick={handleRenameFolder}>
                            Editar Carpeta
                        </Button>
                }
                
            </DialogActions>
        </Dialog>
    )
}
