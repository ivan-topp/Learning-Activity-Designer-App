import React from 'react';
import { IconButton, makeStyles, Typography } from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';
import { useDesignState } from 'contexts/design/DesignContext';
import { useUiState } from 'contexts/ui/UiContext';
import types from 'types';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        display: 'flex',
        padding: 20,
        width: '49%',
        marginBottom: 10,
        borderRadius: 5,
        border: `1px solid ${ theme.palette.divider }`,
        [theme.breakpoints.down('xs')]: {
            width: '100%'
        }
    },
    description: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textAlign: 'justify',
    },
    actions: {
        width: 96,
        display: 'flex',
        alignItems: 'flex-start'
    }
}));

export const LearningResult = ({ category, verb, description, index}) => {
    const classes = useStyles();
    const { uiState, dispatch: uiDispatch } = useUiState();
    const { designState, dispatch: designDispatch } = useDesignState();
    const { design } = designState;

    const handleEdit = () => {
        designDispatch({
            type: types.design.setCurrentLearningResult,
            payload: {
                category,
                verb,
                description,
                editing: true,
                index,
            }
        });
        uiDispatch({
            type: types.ui.openModal,
            payload: 'LearningResult',
        });
    };

    const handleDelete = () => {
        uiDispatch({
            type: types.ui.setConfirmData,
            payload: {
                type: 'resultado de aprendizaje',
                args: { designId: design._id, index },
                actionMutation: null,
            }
        });
        uiDispatch({
            type: types.ui.openModal,
            payload: 'Confirmation',
        });
        if(uiState.userSaveDesign){
            uiDispatch({
                type: types.ui.setUserSaveDesign,
                payload: false,
            })
        };
    };

    return (
        <div className={classes.root}>
            <div style={{width: '100%'}}>
                <Typography color="textSecondary" gutterBottom variant='caption'>Resultado</Typography>
                <Typography variant='body2'>{verb} {description}</Typography>
            </div>
            <div className={classes.actions}>
                <IconButton className={classes.deleteIcon} onClick={handleEdit} >
                    <Edit />
                </IconButton>
                <IconButton className={classes.deleteIcon} onClick={handleDelete} >
                    <Delete />
                </IconButton>
            </div>
        </div>
    )
}
