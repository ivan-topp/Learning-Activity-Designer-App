import React from 'react';
import { IconButton, makeStyles, Typography } from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';
//import { useDesignState } from 'contexts/design/DesignContext';

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
    actions: {
        position: 'absolute',
        top: 8,
        right: 8,
    }
}));

export const LearningResult = ({ verb, description, handleEdit, handleDelete}) => {
    const classes = useStyles();
    //const { designState, dispatch } = useDesignState();

    /*const _handleEdit = () =>  {
        dispatch({
            type:
        });
    };*/

    return (
        <div className={classes.root}>
            <Typography color="textSecondary" gutterBottom variant='caption'>Resultado</Typography>
            <Typography variant='body2'>{verb}</Typography>
            <Typography color="textSecondary" gutterBottom variant='caption'>Descripción</Typography>
            <Typography className={classes.description} variant='body2'>{description}</Typography>
            <div className={classes.actions}>
                <IconButton className={classes.deleteIcon} onClick={()=>handleEdit(verb, description)}>
                    <Edit />
                </IconButton>
                <IconButton className={classes.deleteIcon} onClick={()=>handleDelete(verb, description)}>
                    <Delete />
                </IconButton>
            </div>
        </div>
    )
}
