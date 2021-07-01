import React from 'react';
import { Grid, Typography, Avatar, makeStyles, Button, Divider, IconButton, } from '@material-ui/core';
import RoomIcon from '@material-ui/icons/Room';
import { useAuthState } from 'contexts/AuthContext';
import { getUser, updateContact } from 'services/UserService';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import { Star, Apartment, Group, Email, PersonAdd, Edit, Close } from '@material-ui/icons';
import { Alert, Skeleton } from '@material-ui/lab';


import { EditProfileModal } from 'pages/User/UserProfile/EditProfileModal';
import { useUiState } from 'contexts/ui/UiContext';
import { ShowContactsModal } from 'pages/User/UserProfile/ShowContactsModal';

import { createDesign, getPublicDesignsByUser } from 'services/DesignService';
import { DesignsContainer } from 'components/DesignsContainer';
import types from 'types';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
    designPanel:{
        flexDirection: 'column',
        borderLeft:`1px solid ${theme.palette.divider}`,
        background: theme.palette.background.workSpace,
        minHeight: 'calc(100vh - 128px)'
    },
    photoProfile: {
        width: theme.spacing(30),
        height: theme.spacing(30),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        [theme.breakpoints.down('md')]: {
            width: theme.spacing(25),
            height: theme.spacing(25),
        },
        [theme.breakpoints.down('sm')]: {
            width: theme.spacing(15),
            height: theme.spacing(15),
        },
    },
    spaceFirstDataFirstData:{ 
        marginBottom: theme.spacing(1),
    },
    centerGrid:{
        display: 'flex',
        alignItems: 'center', 
        justifyItems:'center',
    },
    spaceSecondData:{
        marginBottom: theme.spacing(2),   
    },
    spaceData:{
        marginLeft: theme.spacing(3),
        marginBottom: theme.spacing(2),
        marginRight: theme.spacing(3),
        [theme.breakpoints.down('xs')]: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
    },
    spaceDesign:{
        marginLeft: theme.spacing(7),
        marginTop: theme.spacing(2),
        marginRight: theme.spacing(7),
        [theme.breakpoints.down('xs')]: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
    },
    spaceIcons:{
        marginRight: theme.spacing(1)
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

export const UserProfile = () => {
    
    const classes = useStyles();
    const queryClient = useQueryClient();
    const { authState, setAuthState } = useAuthState();
    const { dispatch } = useUiState();
    const history = useHistory();
    const urlparams = useParams();
    const uid = urlparams.uid;
    const { enqueueSnackbar } = useSnackbar();

    const { isLoading, isError, data, refetch } = useQuery(['user-profile', uid], async () => {
        return await getUser(uid);
    }, { refetchOnWindowFocus: false });

    const designsQuery = useInfiniteQuery([ uid, 'user-public-designs' ], async ({ pageParam = 0 }) => {
        return await getPublicDesignsByUser(uid, pageParam);
    }, {
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage, pages) => {
            if(lastPage.nPages === pages.length) return undefined; 
            return lastPage.from;
        },
    });
    
    const updateConctactMutation = useMutation(updateContact, {
        onSuccess: (data, {uid, contacts}, context) => {
            setAuthState((prevState)=>({
                ...prevState, 
                user: Object.assign({}, {...prevState.user, contacts})
            }));
            queryClient.invalidateQueries(['user-profile', uid]);
        },
        onError: (error) => {
            console.log(error);
            enqueueSnackbar('No se ha actualizado su lista de contactos',  {variant: 'error', autoHideDuration: 2000},   );
        },
    });

    const createDesignMutation = useMutation(createDesign, {
        onMutate: async () => {
            await queryClient.cancelQueries('recent-designs');
            await queryClient.cancelQueries('designs');
            await queryClient.cancelQueries([authState.user.id, 'user-public-designs']);
        },
        onSettled: () => {
            queryClient.invalidateQueries('recent-designs');
            queryClient.invalidateQueries('designs');
            queryClient.invalidateQueries([authState.user.id, 'user-public-designs']);
        },
        onError: (error) => {
            console.log(error);
            enqueueSnackbar('No se han cargado sus diseño',  {variant: 'error', autoHideDuration: 2000},   );
        },
        onSuccess: data => {
            history.push(`/designs/${data.design._id}`);
        }
    });

    const handleCreateDesign = async () => {
        await createDesignMutation.mutate({ path: '/', isPublic: true });
    };
    
    if(isError){
        return (<div className={ classes.designPanel }>
            <Alert severity='error' variant='outlined' className={ classes.error }>
                Ha ocurrido un problema al intentar obtener el usuario en la base de datos. Esto probablemente se deba a un problema de conexión, por favor revise que su equipo tenga conexión a internet e intente más tarde.
                Si el problema persiste, por favor comuníquese con el equipo de soporte.
            </Alert>
        </div>);
    };


    const handleEditProfile = () => {
        dispatch({
            type: types.ui.openModal,
            payload: 'EditProfile',
        });
    };

    const handleShowContacts = () => {
        dispatch({
            type: types.ui.openModal,
            payload: 'Contacts',
        });
    };

    const handleAddContact = async (e) => {
        e.preventDefault();
        await updateConctactMutation.mutate({uid: authState.user.uid, contacts:[...authState.user.contacts, uid]});
        queryClient.invalidateQueries(['user-profile', uid]);
        await refetch();
    };

    const handleDeleteContact = async (e) =>{
        e.preventDefault();
        await updateConctactMutation.mutate({uid: authState.user.uid, contacts: authState.user.contacts.filter(contact=>contact!==uid)});
        queryClient.invalidateQueries(['user-profile', uid]);
    };

    return (
        <Grid container>
            <Grid item xs={12} sm={3}>
                <Grid container alignItems='center' justify='center'>
                    {
                        isLoading
                            ? <Skeleton animation='wave' variant='circle' className={classes.photoProfile}/>
                            : <Avatar alt={data.name + ' ' + data.lastname} className={classes.photoProfile} src={ data.img && data.img.length > 0 ? `${process.env.REACT_APP_URL}uploads/users/${data.img}` : '' }/>
                    }
                </Grid>
                <Grid container alignItems='center' justify='center'>
                    {
                        isLoading
                            ? <Skeleton animation='wave' height={42} width={'80%'}/>
                            : data && <Typography  align='center' variant='h5' component='h2'>{data.name + ' ' + data.lastname}</Typography>
                    }
                </Grid>
                <Grid container alignItems='center' justify='center'>
                    {
                        isLoading
                            ? <Skeleton animation='wave' height={20} width={'50%'}/>
                            : data && data.occupation && <Typography className={classes.spaceFirstData} color='textSecondary'>{data.occupation}</Typography>
                    }
                </Grid> 
                <Grid container alignItems='center' justify='center' className={classes.spaceFirstData}>
                    <Grid item >
                        {
                            isLoading
                                ? <Skeleton animation='wave' variant='circle' width={20} height={20}/>
                                : data.contacts.length > 0 
                                    ? <IconButton onClick={ handleShowContacts }>
                                        <Group />
                                    </IconButton>
                                    :
                                    <Group />
                        }
                    </Grid>
                    <Grid item >
                        {
                            isLoading
                                ? <Skeleton animation='wave' width={20} height={20} style={{marginLeft: 5}}/>
                                : <Typography style={{ marginLeft: 8 }}> {data.contacts.length}</Typography>
                        }
                    </Grid>
                    ・
                    <Grid item >
                        {
                            isLoading
                                ? <Skeleton animation='wave' variant='circle' width={20} height={20}/>
                                : <Star/>
                        }
                    </Grid>
                    <Grid item>
                        {
                            isLoading
                                ? <Skeleton animation='wave' width={20} height={20} style={{marginLeft: 5}}/>
                                : <Typography style={{ marginLeft: 8 }}> {data.scoreMean}</Typography>
                        }
                    </Grid>
                </Grid>
                <Grid container alignItems='center' justify='center' className={classes.spaceSecondData}>
                    {
                        isLoading
                            ? <Skeleton animation='wave' width={'50%'} height={42} style={{marginLeft: 5}}/>
                            : (authState.user.uid===uid) 
                                ? <Button variant ='outlined' size='small' onClick={handleEditProfile} startIcon={<Edit />}>Editar perfil</Button> 
                                : (authState.user.contacts.includes(uid)) 
                                    ? <Button variant ='outlined' size='small' onClick={handleDeleteContact} startIcon={<Close />}>Eliminar de mis contactos</Button> 
                                    : <Button variant ='outlined' size='small' onClick={handleAddContact} startIcon={<PersonAdd />} >Agregar a mis contactos</Button>
                    }
                </Grid>
                <Divider className={classes.spaceData}/>
                <Grid className={classes.spaceData}>
                    {
                        isLoading
                            ? <Skeleton animation='wave' width={'100%'} height={40} style={{marginLeft: 5}}/>
                            : data && data.institution && (
                                <Grid container className={classes.spaceSecondData} >
                                    <Grid item >
                                        <Apartment className={classes.spaceIcons}/>
                                    </Grid>
                                    <Grid item >
                                    <Typography className={classes.spaceFirstData} color='textSecondary'>{data.institution}</Typography>
                                    </Grid>
                                </Grid>
                            )
                    }
                    { isLoading
                            ? <Skeleton animation='wave' width={'100%'} height={40} style={{marginLeft: 5}}/>
                            : data && data.city && data.country &&(
                        <Grid container className={classes.spaceSecondData} >
                            <Grid item >
                                <RoomIcon className={classes.spaceIcons}/>
                            </Grid>
                            <Grid item >
                            <Typography className={classes.spaceFirstData} color='textSecondary'>{data.city + ', ' + data.country}</Typography>
                            </Grid>
                        </Grid>
                    )}
                    { isLoading
                            ? <Skeleton animation='wave' width={'100%'} height={40} style={{marginLeft: 5}}/>
                            : data && (
                        <Grid container className={classes.spaceSecondData} >
                            <Grid item >
                                <Email className={classes.spaceIcons}/>
                            </Grid>
                            <Grid item >
                            <Typography className={classes.spaceFirstData} color='textSecondary'>{data.email}</Typography>
                            </Grid>
                        </Grid>
                    )}
                    <Divider className={classes.spaceSecondData}/>
                    { isLoading
                            ? (<>
                                <Skeleton animation='wave' width={100} height={20} style={{marginLeft: 5}}/>
                                <Skeleton animation='wave' width={'100%'} height={40} style={{marginLeft: 5}}/>
                            </>)
                            : data && data.description &&(
                        <>
                            <Typography color='textSecondary' className={classes.spaceSecondData}>
                                Descripción
                            </Typography>
                            <Typography >
                                {data.description}
                            </Typography> 
                        </>
                    )}
                </Grid>
            </Grid>
            <Grid item xs={12} sm={9} className={classes.designPanel}>
               
                <Grid className={classes.spaceDesign}>
                    <Typography variant='h4'>
                        Diseños Públicos
                    </Typography>
                    <Divider />
                    {   
                        !isError && !isLoading && (authState.user.uid === uid) && 
                            <>
                                <EditProfileModal /> 
                            </> 
                    }
                    <DesignsContainer {...designsQuery} label='user-profile' handleCreateDesign={handleCreateDesign}/>
                    {!isError && !isLoading && <ShowContactsModal/> }
                </Grid>
            </Grid>
        </Grid>
    )
}
