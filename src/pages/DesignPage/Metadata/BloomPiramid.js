import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useDesignState } from 'contexts/design/DesignContext';
import types from 'types';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: 300,
        clipPath: 'polygon(50% 0, 0 100%, 100% 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    option: {
        backgroundColor: theme.palette.secondary.main,
        marginBottom: 10,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: theme.palette.getContrastText(theme.palette.secondary.main),
        '&:hover': {
            transition: 'box-shadow .3s',
            cursor: 'pointer',
            boxShadow: '0 0px 8px 0 rgba(0, 0, 0, 0.2), 0 0px 20px 0 rgba(0, 0, 0, 0.19)'
        }
    },
    crear: {
        paddingTop: 30,
        height: '25%'
    },
    evaluar: {
        height: '16.6%'
    },
    analizar: {
        height: '16.6%'
    },
    aplicar: {
        height: '16.6%'
    },
    comprender: {
        height: '16.6%'
    },
    recordar: {
        height: '16.6%'
    },
    active: {
        boxShadow: '0 0px 8px 0 rgba(0, 0, 0, 0.2), 0 0px 20px 0 rgba(0, 0, 0, 0.19)',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.getContrastText(theme.palette.primary.main),
    }
}));

export const BloomPiramid = () => {
    const classes = useStyles();
    const { designState, dispatch } = useDesignState();
    const active = designState.currentLearningResult.category;
    const { bloomCategories } = designState;

    const handleSelectOption = ( value ) => {
        dispatch({
            type: types.design.setCurrentLearningResultField,
            payload: {
                field: 'category',
                value,
            }
        });
    };

    const createOptionList = () => {
        return bloomCategories.map( option => {
            const isActive = active._id === option._id;
            return (
                <div 
                    key={option._id}
                    onClick={()=> handleSelectOption(isActive ? null : option)}
                    className={`${classes.option} ${classes[option.name.toLowerCase()]} ${isActive && classes.active}`}
                >
                    { option.name }
                </div>
            );
        });
    };

    return (
        <div className={classes.root}>
            { createOptionList() }
        </div>
    );
};
