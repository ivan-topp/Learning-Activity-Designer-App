
import React from 'react'
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, makeStyles, TextField, Typography, } from '@material-ui/core';
import { useUiState } from 'contexts/ui/UiContext';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuthState } from 'contexts/AuthContext';
import { getUser, updateProfileInformation } from 'services/UserService';
import { useParams } from 'react-router';
import { useForm } from 'hooks/useForm';
import CloseIcon from '@material-ui/icons/Close';
import { Alert } from '@material-ui/lab';
import types from 'types';

const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    photoProfile: {
        width: theme.spacing(30),
        height: theme.spacing(30),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    errorContainer: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
    },
    error: {
        marginTop: 15,
        minWidth: '50%',
        display:'flex',
        justifyContent: 'center',
        textAlign: 'justify',
        alignItems:'center',
    }

}));

export const EditProfileModal = React.memo(() => {
    const classes = useStyles();
    const queryClient = useQueryClient();
    const { uiState, dispatch } = useUiState();
    const { authState } = useAuthState();
    const urlparams = useParams();
    const uid = urlparams.uid;

    const { isLoading, isError, data } = useQuery(['user-profile', uid], async () => {
        return await getUser(uid);
    }, { refetchOnWindowFocus: false });

    const [ formData, handleInputChange, reset] = useForm({
        name: data.name,
        lastname: data.lastname,
        occupation: data.occupation,
        institution: data.institution,
        country: data.country,
        city: data.city,
        description: data.description,
    });
    
    const { name, lastname, occupation, institution, country, city, description } = formData;

    const updateProfileInformationMutation = useMutation(updateProfileInformation, {
        onMutate: async () =>{
            // Cancela consultas con la key especificada
            await queryClient.cancelQueries(['user-profile', uid]);
            // Guarda los datos antes de la eliminación por si algo sale mal
            const previousUserProfile = queryClient.getQueryData(['user-profile', uid]);
            // Actualiza de manera optimista (Suponiendo que el servidor responde correctamente)
            let keys = ['user-profile', uid]
            queryClient.setQueryData(keys, oldData =>{
                const newData = Object.assign({}, { ...oldData, uid, name, lastname, occupation, institution, country, city, description});
                return newData;
            });
            // Retorna un contexto con los datos previos a la eliminación para restaurar la consulta si es que algo sale mal
            return { previousUserProfile };
        },
        // Si la mutación falla, usa los datos previos desde el contexto retornado en onMutate para restaurar los datos
        onError: (error, context) => {
            // TODO: Emitir notificación para retroalimentar
            console.log(error);
            queryClient.setQueryData(['user-profile', uid], context.previousUserProfile);
        },
        onSettled: () => {
            // Invalida las queries para que todas las queries con estas keys se actualicen por cambios
            queryClient.invalidateQueries(['user-profile', uid]);
        },
    });
    
    if(isError){
        return (<div className={ classes.errorContainer }>
            <Alert severity='error' className={ classes.error }>
                Ha ocurrido un problema al intentar obtener el usuario en la base de datos. Esto probablemente se deba a un problema de conexión, por favor revise que su equipo tenga conexión a internet e intente más tarde.
                Si el problema persiste, por favor comuníquese con el equipo de soporte.
            </Alert>
        </div>);
    };

    if(isLoading){
        return (<Typography>Cargando...</Typography>);
    };

    const handleClose = () => {
        dispatch({
            type: types.ui.toggleModal,
            payload: 'EditProfile',
        });
        reset();
    };

    const handleSaveInformation = async (e) => {
        e.preventDefault();
        await updateProfileInformationMutation.mutate({uid: authState.user.uid, name, lastname, occupation, institution, country, city, description});
        dispatch({
            type: types.ui.toggleModal,
            payload: 'EditProfile',
        });
        //Mensaje de guardado con exito
    };
    return (
        <>  
            <Dialog onClose={handleClose} aria-labelledby='customized-dialog-title' open={uiState.isEditProfileModalOpen}>
                <DialogTitle id='customized-dialog-title' onClose={handleClose}>
                    Editar perfil
                    <IconButton aria-label='close' className={classes.closeButton} onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={1}>
                        
                        <Grid container alignItems='center' justify='center'>
                            <Avatar alt={data.name + ' ' + data.lastname} className={classes.photoProfile} src={ data.img ?? ''}/>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant='outlined'
                                margin='dense' 
                                name='name' 
                                value={ name } 
                                onChange={ handleInputChange } 
                                label='Nombres' 
                                type='text' 
                                fullWidth 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField
                            variant='outlined'
                            margin='dense' 
                            name='lastname' 
                            value={ lastname } 
                            onChange={ handleInputChange } 
                            label='Apellidos' 
                            type='text' 
                            fullWidth 
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField
                            variant='outlined'
                            margin='dense' 
                            name='country' 
                            value={ country ?? '' } 
                            onChange={ handleInputChange } 
                            label='País' 
                            type='text' 
                            fullWidth 
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField
                            variant='outlined'
                            margin='dense' 
                            name='city' 
                            value={ city ?? ''} 
                            onChange={ handleInputChange } 
                            label='Ciudad' 
                            type='text' 
                            fullWidth 
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField
                            variant='outlined'
                            margin='dense' 
                            name='occupation' 
                            value={ occupation ?? ''} 
                            onChange={ handleInputChange } 
                            label='Ocupación' 
                            type='text' 
                            fullWidth 
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField
                            variant='outlined'
                            margin='dense' 
                            name='institution' 
                            value={ institution ?? '' } 
                            onChange={ handleInputChange } 
                            label='Institución' 
                            type='text' 
                            fullWidth 
                        />
                        </Grid>
                        <Grid item xs={12}>
                        <TextField
                            multiline 
                            variant='outlined'
                            margin='dense'
                            name='description'
                            rows={4} 
                            value={ description ?? ''} 
                            onChange={ handleInputChange } 
                            label='Descripción' 
                            type='text' 
                            fullWidth 
                        />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant='contained' color='primary' onClick={handleSaveInformation}>
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
});
