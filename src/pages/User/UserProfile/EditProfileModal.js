
import React, { useEffect, useRef, useState } from 'react'
import { Avatar, Backdrop, Button, ButtonBase, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, makeStyles, TextField, Typography, useTheme, } from '@material-ui/core';
import { useUiState } from 'contexts/ui/UiContext';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuthState } from 'contexts/AuthContext';
import { getUser, updateProfileInformation, updateUserImage } from 'services/UserService';
import { useParams } from 'react-router';
import { useForm } from 'hooks/useForm';
import CloseIcon from '@material-ui/icons/Close';
import { Alert } from '@material-ui/lab';
import types from 'types';
import { useSnackbar } from 'notistack';
import { AddPhotoAlternate } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    errorContainer: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
    },
    error: {
        marginTop: 15,
        minWidth: '50%',
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'justify',
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
    },
    photoProfile: ({ isHovered }) => ({
        width: theme.spacing(30),
        height: theme.spacing(30),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        backgroundColor: !isHovered
            ? theme.palette.type === 'dark' ? theme.palette.grey[600] : theme.palette.grey[400]
            : theme.palette.type === 'dark' ? theme.palette.grey[500] : theme.palette.grey[500],
    }),
    addPhotoIcon: ({ isHovered }) => ({
        position: 'absolute',
        bottom: 25,
        right: 25,
        border: `2px solid ${theme.palette.background.paper}`,
        backgroundColor: !isHovered
            ? theme.palette.type === 'dark' ? theme.palette.grey[600] : theme.palette.grey[400]
            : theme.palette.type === 'dark' ? theme.palette.grey[500] : theme.palette.grey[500],
    }),
    inputFile: {
        display: 'none',
    },
    backdrop: {
        display: 'flex',
        flexDirection: 'column',
        zIndex: theme.zIndex.modal + 1,
        color: '#fff',
    },
}));

export const EditProfileModal = React.memo(() => {
    const [isHovered, setHovered] = useState(false);
    const theme = useTheme();
    const classes = useStyles({ isHovered });
    const queryClient = useQueryClient();
    const { uiState, dispatch } = useUiState();
    const { authState, setAuthState } = useAuthState();
    const urlparams = useParams();
    const fileInputRef = useRef();
    const [file, setFile] = useState(null);
    const [imgSource, setImgSource] = useState(null);
    const [loading, setLoading] = useState(false);
    const uid = urlparams.uid;
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if(file){
            const objectUrl = URL.createObjectURL(file);
            setImgSource(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [file])

    const { isLoading, isError, data } = useQuery(['user-profile', uid], async () => {
        return await getUser(uid);
    }, { refetchOnWindowFocus: false });

    const [formData, handleInputChange, reset] = useForm({
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
        onMutate: async (args) => {
            // Cancela consultas con la key especificada
            await queryClient.cancelQueries(['user-profile', uid]);
            // Guarda los datos antes de la eliminación por si algo sale mal
            const previousUserProfile = queryClient.getQueryData(['user-profile', uid]);
            // Actualiza de manera optimista (Suponiendo que el servidor responde correctamente)
            queryClient.setQueryData(['user-profile', uid], oldData => {
                const newData = Object.assign({}, { ...oldData, uid, img: args.img, name, lastname, occupation, institution, country, city, description });
                return newData;
            });
            // Retorna un contexto con los datos previos a la eliminación para restaurar la consulta si es que algo sale mal
            return { previousUserProfile };
        },
        // Si la mutación falla, usa los datos previos desde el contexto retornado en onMutate para restaurar los datos
        onError: (error, context) => {
            console.log(error);
            queryClient.setQueryData(['user-profile', uid], context.previousUserProfile);
            setLoading(false);
            dispatch({
                type: types.ui.closeModal,
                payload: 'EditProfile',
            });
            setTimeout(() => {
                setImgSource(null);
                setFile(null);
                enqueueSnackbar(error.message, { variant: 'error', autoHideDuration: 2000 });
            }, theme.transitions.duration.enteringScreen);
        },
        onSettled: () => {
            queryClient.invalidateQueries(['user-profile', uid]);
            queryClient.invalidateQueries('recent-designs');
            queryClient.invalidateQueries('designs');
            queryClient.invalidateQueries([uid, 'user-public-designs']);
        },
        onSuccess: (data, args) => {
            setLoading(false);
            dispatch({
                type: types.ui.closeModal,
                payload: 'EditProfile',
            });
            setTimeout(() => {
                setImgSource(null);
                setFile(null);
                enqueueSnackbar('Usuario actualizado correctamente', { variant: 'success', autoHideDuration: 2000 });
                setAuthState((prevState) => ({
                    ...prevState,
                    user: {
                        ...prevState.user,
                        img: data.value.img
                    }
                }));
            }, theme.transitions.duration.enteringScreen);
        }
    });

    if (isError) {
        return (<div className={classes.errorContainer}>
            <Alert severity='error' className={classes.error}>
                Ha ocurrido un problema al intentar obtener el usuario en la base de datos. Esto probablemente se deba a un problema de conexión, por favor revise que su equipo tenga conexión a internet e intente más tarde.
                Si el problema persiste, por favor comuníquese con el equipo de soporte.
            </Alert>
        </div>);
    };

    if (isLoading) {
        return (<Typography>Cargando...</Typography>);
    };

    const handleClose = () => {
        dispatch({
            type: types.ui.closeModal,
            payload: 'EditProfile',
        });
        setTimeout(() => {
            reset();
            setImgSource(null);
            setFile(null);
        }, theme.transitions.duration.enteringScreen);
    };

    const handleSaveInformation = async (e) => {
        e.preventDefault();
        setLoading(true);
        let img = data.img;
        if (file) {
            const formData = new FormData();
            formData.append('img', file);
            const resp = await updateUserImage(formData);
            if (!resp.ok) enqueueSnackbar(resp.message, { variant: 'error', autoHideDuration: 2000 });
            else img = resp.data.user.img;
        }
        await updateProfileInformationMutation.mutate({ uid: authState.user.uid, img, name, lastname, occupation, institution, country, city, description });
    };

    const handleChangeFile = async (event) => {
        var file = event.target.files[0];
        //var reader = new FileReader();
        //reader.onloadend = function (e) {
        //    setImgSource(e.target.result);
        //};
        //reader.readAsDataURL(file);
        setFile(file);
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
                        <Grid container alignItems='center' justify='center' className={classes.avatarContainer}>
                            <input
                                ref={fileInputRef}
                                accept="image/x-png,image/jpeg"
                                className={classes.inputFile}
                                type="file"
                                onChange={handleChangeFile}
                            />
                            <div
                                style={{ position: 'relative' }}
                            >
                                <Avatar
                                    component={ButtonBase}
                                    className={classes.photoProfile}
                                    src={
                                        imgSource 
                                            ? imgSource
                                            : (data.img && data.img.length > 0 )
                                                ? `${process.env.REACT_APP_URL}uploads/users/${data.img}` 
                                                : ''
                                    }
                                    alt={data.name + ' ' + data.lastname}
                                    onClick={(e) => fileInputRef?.current.click()}
                                    onMouseEnter={(e) => { setHovered(true) }}
                                    onMouseLeave={(e) => { setHovered(false) }}
                                />
                                <Avatar
                                    component={ButtonBase}
                                    className={classes.addPhotoIcon}
                                    onClick={(e) => fileInputRef?.current.click()}
                                    onMouseEnter={(e) => { setHovered(true) }}
                                    onMouseLeave={(e) => { setHovered(false) }}
                                >
                                    <AddPhotoAlternate />
                                </Avatar>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant='outlined'
                                margin='dense'
                                name='name'
                                value={name}
                                onChange={handleInputChange}
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
                                value={lastname}
                                onChange={handleInputChange}
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
                                value={country ?? ''}
                                onChange={handleInputChange}
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
                                value={city ?? ''}
                                onChange={handleInputChange}
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
                                value={occupation ?? ''}
                                onChange={handleInputChange}
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
                                value={institution ?? ''}
                                onChange={handleInputChange}
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
                                value={description ?? ''}
                                onChange={handleInputChange}
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
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
                <Typography>Actualizando información...</Typography>
            </Backdrop>
        </>
    )
});
