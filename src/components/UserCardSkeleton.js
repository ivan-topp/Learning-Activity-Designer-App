import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        width: '100%',
        padding: 5,
        borderRadius: 10,
        marginTop: 10,
        backgroundColor: theme.palette.background.design,
    },
    card: {
        display: 'flex',
        width: '100%',
    },
    body: {
        width: '100%',
        display: 'flex',
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    photo: {
        margin: 10,
        width: theme.spacing(8),
        height: theme.spacing(8),
    },
    name: {
        width: '50%',
        [theme.breakpoints.down('sm')]: {
            width: '70%',
        },
        [theme.breakpoints.down('xs')]: {
            width: '100%',
        },
    },
    location: {
        width: '35%',
        [theme.breakpoints.down('sm')]: {
            width: '50%',
        },
        [theme.breakpoints.down('xs')]: {
            width: '80%',
        },
    },
    ocupation: {
        width: '35%',
        [theme.breakpoints.down('sm')]: {
            width: '50%',
        },
        [theme.breakpoints.down('xs')]: {
            width: '80%',
        },
    }
}));

export const UserCardSkeleton = () => {
    const classes = useStyles();
    const theme = useTheme();

    return (
        <div className={classes.root}>
            <div className={classes.card}>
                <div className={classes.photo}>
                    <Skeleton  width={theme.spacing(8)} height={theme.spacing(8)} variant="circle" animation='wave' />
                </div>
                <div className={classes.body} >
                    <Skeleton className={classes.name} animation='wave' height={42} style={{borderRadius: 4}} />
                    <Skeleton className={classes.location} animation='wave' height={20} style={{borderRadius: 4}} />
                    <Skeleton className={classes.ocupation} animation='wave' height={20} style={{borderRadius: 4}} />
                </div>
            </div>
        </div>
    )
}
