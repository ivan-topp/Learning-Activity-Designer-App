import React from 'react'
import { useHistory } from 'react-router-dom';
import { useAuthState } from '../../contexts/AuthContext';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import {  Grid, makeStyles, Typography, ButtonBase, Avatar, Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        margin: 'auto',
        maxWidth: 500,
    },
    photo: {
        width: theme.spacing(20),
        height: theme.spacing(20),
    },
    button:{
        marginLeft: theme.spacing(6)
    }
}));
export const UserCard = () => {
    const classes = useStyles();
    const history = useHistory();
    const { authState } = useAuthState();

    const handleAddContact = () => {
        console.log('Agregar');
    };
    const handleDeleteContact = () => {
        console.log('Eliminar');
    }
    return (
        <>
            <Grid item>
                <ButtonBase >
                    <Avatar alt="usuario" className={classes.photo} src="" onClick ={(e) => history.push('/profile/6019caa3719c7a3264a60b8d')}/>
                </ButtonBase>
            </Grid>
            <Grid item xs={12} sm container>
                <Grid item xs container direction="column" spacing={2}>
                    <Grid item xs>
                        <Typography  variant="subtitle1" style={{ cursor: 'pointer', width: '50px' }} onClick ={(e) => history.push('/profile/6019caa3719c7a3264a60b8d')}>
                            Nombre
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Ocupacion
                        </Typography>
                    </Grid>
                    <Grid item>
                    
                        <Button variant ='outlined' size='small' onClick={handleAddContact} startIcon={<PersonAddIcon />} className={classes.button}>Agregar a mis contactos</Button>
                    </Grid>
                </Grid>
                
            </Grid>
        </>
    )
}
