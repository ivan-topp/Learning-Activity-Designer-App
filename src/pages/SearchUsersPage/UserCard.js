import React from 'react';
import { Avatar, Button, ButtonBase, Grid, makeStyles, Typography } from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { formatName, getUserInitials } from '../utils/textFormatters';
import { useHistory } from 'react-router-dom';
import { useUiState } from '../contexts/UiContext';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        width: '100%',
        padding: 5,
        borderRadius: 10,
        border: `1px solid ${ theme.palette.divider }`,
        marginTop: 10,
        cursor: 'pointer',
        backgroundColor: theme.palette.background.design,
        '&:hover': {
            zIndex: 0.5,
            background: theme.palette.background.designHover,
        },
    },
    card: {
        display: 'flex',
        width: '100%',
        //backgroundColor: 'grey',
    },
    body: {
        display: 'flex',
        marginLeft: 10,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    photo: {
        margin: 10,
        width: theme.spacing(8),
        height: theme.spacing(8),
    },
    button:{
        marginLeft: theme.spacing(6)
    }
}));

export const UserCard = ({ _id, name, lastname, city, country, scoreMean, img, occupation }) => {
    const classes = useStyles();
    const history = useHistory();
    const { uiState, setUiState } = useUiState();

    const handleViewUser = (e, id) => {
        e.stopPropagation();
        history.push(`/profile/${id}`);
        setUiState((prevState) => ({
            ...prevState,
            isContactsModalOpen: false,
        }));
    };
    const handleAddContact = () => {
        console.log('Agregar');
    };
    const handleDeleteContact = () => {
        console.log('Eliminar');
    }

    return (
        <div className={classes.root} >
            <Grid item>
                <ButtonBase  onClick={ ( e ) => handleViewUser(e, _id) }>
                    <Avatar
                        className={ classes.photo }
                        alt={ formatName(name, lastname) }
                        src={ img ?? '' }
                    >
                        <Typography variant='h5'>
                            { getUserInitials(name, lastname) }
                        </Typography>
                    </Avatar>
                </ButtonBase>
            </Grid>
            <Grid item xs={12} sm container>
                <Grid item xs container direction="column" spacing={2}>
                    <Grid item xs>
                        <div className={classes.name}>
                            <Typography variant='h5' color='textPrimary' onClick={ ( e ) => handleViewUser(e, _id) }>
                                {name + ' ' + lastname}
                            </Typography>
                        </div>
                        <div className={classes.location}>
                            <Typography variant='subtitle1' color='textSecondary'>
                                {
                                    city && country 
                                        ? city + ', ' + country
                                        : city ?? country ?? 'Sin locación'
                                }
                            </Typography>
                        </div>
                        <div >
                            <Typography variant='subtitle1' color='textSecondary'>
                                {
                                    occupation
                                        ? occupation
                                        : 'Sin ocupación'
                                }
                            </Typography>
                        </div>
                        <div >
                            <Typography variant='subtitle1' color='textSecondary'>
                                {
                                    scoreMean
                                }
                            </Typography>
                        </div>
                    </Grid>
                    <Grid item>
                        <Button variant ='outlined' size='small' onClick={handleAddContact} startIcon={<PersonAddIcon />} className={classes.button}>Agregar a mis contactos</Button>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}
