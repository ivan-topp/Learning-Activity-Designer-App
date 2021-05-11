import React from 'react';
import { IconButton, makeStyles, Typography } from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';
import { useDesignState } from 'contexts/design/DesignContext';
import { useUiState } from 'contexts/ui/UiContext';
import types from 'types';

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

export const LearningResult = ({ verb, description, index}) => {
    const classes = useStyles();
    const { uiState, dispatch: uiDispatch } = useUiState();
    const { designState, dispatch: designDispatch } = useDesignState();
    const { design } = designState;

    const handleEdit = () => {
        const { bloomVerbs, bloomCategories } = designState;
        const category = bloomCategories.find((category) => category._id === bloomVerbs.find((v) => v.name === verb).category)._id;
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
            type: types.ui.toggleModal,
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
            type: types.ui.toggleModal,
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
            <Typography color="textSecondary" gutterBottom variant='caption'>Resultado</Typography>
            <Typography variant='body2'>{verb}</Typography>
            <Typography color="textSecondary" gutterBottom variant='caption'>Descripción</Typography>
            <Typography className={classes.description} variant='body2'>{description}</Typography>
            <div className={classes.actions}>
                <IconButton className={classes.deleteIcon} onClick={handleEdit}>
                    <Edit />
                </IconButton>
                <IconButton className={classes.deleteIcon} onClick={handleDelete}>
                    <Delete />
                </IconButton>
            </div>
        </div>
    )
}
