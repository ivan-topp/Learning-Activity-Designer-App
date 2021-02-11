import React from 'react';
import { Grid, Typography, Avatar, makeStyles, Button, Divider, } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import ApartmentIcon from '@material-ui/icons/Apartment';
import GroupIcon from '@material-ui/icons/Group';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import EmailIcon from '@material-ui/icons/Email';
import { useAuthState } from '../../contexts/AuthContext';
import { searchMyProfile } from '../../services/UserService';


const useStyles = makeStyles((theme) => ({
    profilePanel:{
        background: theme.palette.primary.sidePanels
    },
    designPanel:{
        flexDirection: 'column',
        borderLeft:`1px solid ${theme.palette.divider}`,
        background: theme.palette.primary.workspace,
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
    }
}));

export const UserProfile = () => {
    
    const classes = useStyles();
    const { authState } = useAuthState();

    const handleEditProfile = () => {
        console.log('Editar perfil');
    };
    const handleAddContact = () => {
        console.log('Agregar usuario');
    };
    const handleGetMyProfile = async (e) => {
        e.preventDefault();
        const uid = authState.user.uid
        let res = await searchMyProfile(uid);
        console.log(res);
    };

    return (
        <Grid container className={classes.profilePanel}>
            <Grid item xs={12} sm={3}>
                <Grid container alignItems='center' justify='center'>
                    <Avatar alt='IconoUsuario'className={classes.photoProfile}/>
                </Grid>
                <Grid container alignItems='center' justify='center'>
                    <Typography variant='h5' component='h2'>{authState.user.name}</Typography>
                </Grid>
                <Grid container alignItems='center' justify='center'>
                    <Typography className={classes.spaceFirstData} color='textSecondary'>Ocupación</Typography>
                </Grid> 
                <Grid container alignItems='center' justify='center' className={classes.spaceFirstData}>
                    <Grid item >
                        <GroupIcon/>
                    </Grid>
                    <Grid item >
                        <Typography>{authState.user.contacs}</Typography>
                    </Grid>
                    ・
                    <Grid item >
                    <StarIcon/>
                    </Grid>
                    <Grid item >
                        <Typography>{authState.user.scoreMean}</Typography>
                    </Grid>
                </Grid>
                <Grid container alignItems='center' justify='center' className={classes.spaceSecondData}>
                    {(authState.user.uid==="6019caa3719c7a3264a60b8d") ? 
                        <Button variant ='outlined' size='small' onClick={handleEditProfile}>Editar perfil</Button> 
                        : 
                        <Button variant ='outlined' size='small' onClick={handleAddContact}>Agregar a mis contactos</Button>}  
                </Grid>
                <Divider className={classes.spaceData}/>
                <Grid className={classes.spaceData}>
                    <Grid container className={classes.spaceSecondData} >
                        <Grid item >
                            <ApartmentIcon className={classes.spaceIcons}/>
                        </Grid>
                        <Grid item >
                            <Typography>Universidad Católica de Temuco</Typography>
                        </Grid>
                    </Grid>
                    <Grid container className={classes.spaceFirstData}>
                        <Grid item>
                            <LocationOnIcon className={classes.spaceIcons}/>
                        </Grid>
                        <Grid item className={classes.spaceSecondData}>
                            <Typography>Temuco, Chile</Typography>
                        </Grid>
                    </Grid>
                    <Grid container >
                        <Grid item>
                            <EmailIcon className={classes.spaceIcons}/>
                        </Grid>
                        <Grid item className={classes.spaceSecondData}>
                            <Typography>aguzman2016@alu.uct.cl</Typography>
                        </Grid>
                    </Grid>
                    <Divider className={classes.spaceSecondData}/>
                        <Typography color='textSecondary' className={classes.spaceSecondData}>
                            Descripción
                        </Typography>
                        <Typography >
                            Hola mi nombre es {authState.user.name}
                        </Typography>     
                </Grid>
            </Grid>
            <Grid item xs={12} sm={9} className={classes.designPanel}>
                <Grid className={classes.spaceDesign}>
                    <Typography variant='h4' component='h1' color='textSecondary'>Diseños</Typography>
                </Grid>
                <Divider className={classes.spaceDesign}/>
                <Grid className={classes.spaceDesign}>
                    <Typography variant='h5' component='h1'>Mis diseños</Typography>
                    <Button variant="outlined" onClick={handleGetMyProfile}>Perfil Actual</Button>
                </Grid>
            </Grid>
        </Grid>
    )
}
