import React from 'react';
import { Grid, Typography, Avatar, makeStyles, Button, Divider, } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import ApartmentIcon from '@material-ui/icons/Apartment';
import GroupIcon from '@material-ui/icons/Group';
import EmailIcon from '@material-ui/icons/Email';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import { useAuthState } from '../../contexts/AuthContext';
import {  getUser, updateContact } from '../../services/UserService';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { getPublicDesignsByUser } from '../../services/DesignService';
import { DesignsContainer } from '../../components/DesignsContainer';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
    designPanel:{
        flexDirection: 'column',
        borderLeft:`1px solid ${theme.palette.divider}`,
        background: theme.palette.background.workSpace,
        minHeight: 'calc(100vh - 64px)'
    },
    photoProfile: {
        width: theme.spacing(30),
        height: theme.spacing(30),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
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
        marginLeft: theme.spacing(5),
        marginBottom: theme.spacing(2),
        marginRight: theme.spacing(5),
    },
    spaceDesign:{
        marginLeft: theme.spacing(7),
        marginTop: theme.spacing(2),
        marginRight: theme.spacing(7) 
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
    const urlparams = useParams();
    const uid = urlparams.uid;

    const { isLoading, isError, data, error, refetch } = useQuery("user-profile", async () => {
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
            console.log(data);
            console.log(uid, contacts);
            console.log(context);
            setAuthState((prevState)=>({
                ...prevState, 
                user: Object.assign({}, {...prevState.user, contacts})
            }));
            queryClient.invalidateQueries('user-profile');
        }
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

    const handleEditProfile = () => {
        console.log('Editar perfil');
    };

    const handleAddContact = async (e) => {
        e.preventDefault();
        await updateConctactMutation.mutate({uid: authState.user.uid, contacts:[...authState.user.contacts, uid]});
        queryClient.invalidateQueries('user-profile');
        await refetch();
    };

    const handleDeleteContact = async (e) =>{
        e.preventDefault();
        console.log(authState.user)
        console.log(authState.user.uid, authState.user.contacts.filter(contact=>contact!==uid));
        await updateConctactMutation.mutate({uid: authState.user.uid, contacts: authState.user.contacts.filter(contact=>contact!==uid)});
        queryClient.invalidateQueries('user-profile');
    };
    
    if(isError){
        return (<Typography>Error: {error.message}</Typography>);
    };
    if(isLoading){
        return (<Typography>Cargando...</Typography>);
    };

    return (
        <Grid container>
            <Grid item xs={12} sm={3}>
                <Grid container alignItems='center' justify='center'>
                    <Avatar alt={data.name + ' ' + data.lastname} className={classes.photoProfile} src={ data.img ?? ''}/>
                </Grid>
                <Grid container alignItems='center' justify='center'>
                    { data && <Typography  align='center' variant='h5' component='h2'>{data.name + ' ' + data.lastname}</Typography>}
                </Grid>
                <Grid container alignItems='center' justify='center'>
                    { data && data.occupation && <Typography className={classes.spaceFirstData} color='textSecondary'>{data.occupation}</Typography>}
                </Grid> 
                <Grid container alignItems='center' justify='center' className={classes.spaceFirstData}>
                    <Grid item >
                        <GroupIcon/>
                    </Grid>
                    <Grid item >
                        <Typography style={{ marginLeft: 8 }}> {data.contacts.length}</Typography>
                    </Grid>
                    ・
                    <Grid item >
                    <StarIcon/>
                    </Grid>
                    <Grid item>
                        <Typography style={{ marginLeft: 8 }}> {data.scoreMean}</Typography>
                    </Grid>
                </Grid>
                <Grid container alignItems='center' justify='center' className={classes.spaceSecondData}>
                    {(authState.user.uid===uid) ? 
                        <Button variant ='outlined' size='small' onClick={handleEditProfile} startIcon={<EditIcon />}>Editar perfil</Button> 
                        :
                        (authState.user.contacts.includes(uid)) ? 
                        <Button variant ='outlined' size='small' onClick={handleDeleteContact} startIcon={<CloseIcon />}>Eliminar de mis contactos</Button> 
                        : 
                        <Button variant ='outlined' size='small' onClick={handleAddContact} startIcon={<PersonAddIcon />} >Agregar a mis contactos</Button>}  
                </Grid>
                <Divider className={classes.spaceData}/>
                <Grid className={classes.spaceData}>
                    { data && data.institution && (
                        <Grid container className={classes.spaceSecondData} >
                            <Grid item >
                                <ApartmentIcon className={classes.spaceIcons}/>
                            </Grid>
                            <Grid item >
                            <Typography className={classes.spaceFirstData} color='textSecondary'>{data.institution}</Typography>
                            </Grid>
                        </Grid>
                    )}
                    { data && data.city && data.country &&(
                        <Grid container className={classes.spaceSecondData} >
                            <Grid item >
                                <ApartmentIcon className={classes.spaceIcons}/>
                            </Grid>
                            <Grid item >
                            <Typography className={classes.spaceFirstData} color='textSecondary'>{data.city + ', ' + data.country}</Typography>
                            </Grid>
                        </Grid>
                    )}
                    { data && (
                        <Grid container className={classes.spaceSecondData} >
                            <Grid item >
                                <EmailIcon className={classes.spaceIcons}/>
                            </Grid>
                            <Grid item >
                            <Typography className={classes.spaceFirstData} color='textSecondary'>{data.email}</Typography>
                            </Grid>
                        </Grid>
                    )}
                    <Divider className={classes.spaceSecondData}/>
                    { data && data.description &&(
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
                    <DesignsContainer {...designsQuery}/>
                </Grid>
            </Grid>
        </Grid>
    )
}
