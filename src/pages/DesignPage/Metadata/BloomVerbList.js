import React from 'react';
import { FormControlLabel, makeStyles, Radio } from '@material-ui/core';
import { useDesignState } from 'contexts/design/DesignContext';
import types from 'types';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        justifyContent: 'center',
    },
    option: {
        minWidth: '25%'
    }
}));

export const BloomVerbList = () => {
    const classes = useStyles();
    const { designState, dispatch } = useDesignState();
    const category = designState.currentLearningResult.category;
    const active = designState.currentLearningResult.verb;
    const { bloomVerbs } = designState;
    
    const handleSelectOption = ( value ) => {
        dispatch({
            type: types.design.setCurrentLearningResultField,
            payload: {
                field: 'verb',
                value,
            }
        });
    };

    const createOptionList = () => {
        return bloomVerbs.filter((verb) => verb.category === category).map(option => {
            const isActive = active === option.name;
            return (
            <FormControlLabel 
                className={classes.option}
                key={option._id}
                value={option.name}
                control={<Radio
                    checked={isActive}
                    onChange={(e)=> handleSelectOption(option.name)}
                    value={option.name}
                />}
                label={option.name}
            />
        )});
    }
    return (
        <div className={classes.root}>
            {createOptionList()}
        </div>
    )
}
