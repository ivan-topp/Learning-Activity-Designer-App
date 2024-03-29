import React from 'react';
import { useHistory } from 'react-router-dom';
import { Avatar, makeStyles, Typography } from '@material-ui/core';
import { formatName, getUserInitials } from 'utils/textFormatters';

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
    name: {

    },
    location: {

    }
}));

export const UserCard = ({ _id, name, lastname, city, country, scoreMean, img, occupation, onClick }) => {
    const classes = useStyles();
    const history = useHistory();

    const handleViewUser = (e, id) => {
        e.stopPropagation();
        if(onClick) onClick();
        history.push(`/profile/${id}`);
    };

    return (
        <div className={classes.root} onClick={ ( e ) => handleViewUser(e, _id) }>
            <div className={classes.card}>
                <Avatar
                    className={classes.photo}
                    alt={formatName(name, lastname)}
                    src={img && img.length > 0 ? `${process.env.REACT_APP_URL}uploads/users/${img}` : ''}
                >
                    {getUserInitials(name, lastname)}
                </Avatar>
                <div className={classes.body} >
                    <div className={classes.name}>
                        <Typography variant='h5' color='textPrimary'>
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
                </div>
            </div>
        </div>
    )
}
