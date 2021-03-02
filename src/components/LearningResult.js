import React from 'react';
import { IconButton, makeStyles, Typography } from '@material-ui/core';
import { Delete } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        padding: 20,
        width: '49%',
        marginBottom: 10,
        borderRadius: 5,
        border: `1px solid ${ theme.palette.divider }`,
    },
    description: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textAlign: 'justify',
    },
    deleteIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
    }
}));

export const LearningResult = ({verb, description}) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Typography color="textSecondary" gutterBottom variant='caption'>Resultado</Typography>
            <Typography variant='body2'>{verb}</Typography>
            <Typography color="textSecondary" gutterBottom variant='caption'>Descripción</Typography>
            <Typography className={classes.description} variant='body2'>{description}</Typography>
            <IconButton className={classes.deleteIcon} onClick={()=>console.log('object')}>
                <Delete />
            </IconButton>
        </div>
    )
}
