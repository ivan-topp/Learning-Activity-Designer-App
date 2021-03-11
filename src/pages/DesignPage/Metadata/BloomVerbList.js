import { FormControlLabel, makeStyles, Radio } from '@material-ui/core';
import { useDesignState } from 'contexts/design/DesignContext';
import React from 'react'
import { useQuery } from 'react-query';
import { getBloomVerbs } from 'services/BloomService';
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
    const results = designState.design.metadata.results;
    const category = designState.currentLearningResult.category;
    const active = designState.currentLearningResult.verb;
    
    const { isLoading, isError, data } = useQuery('bloom-verbs', async () => {
        return await getBloomVerbs(category);
    }, { refetchOnWindowFocus: false, retry: true});

    if(isLoading){
        return (<div>Cargando los verbos de bloom...</div>);
    }

    if(isError){
        return (<div>Error al intentar obtener los verbos de bloom.</div>);
    }
    
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
        return data.bloomVerbs.map(option => {
            const exists = !!results.find(result => option.name === result.verb);
            const isActive = active === option.name;
            return (
            <FormControlLabel 
                className={classes.option}
                key={option._id}
                value={option.name}
                control={<Radio 
                    disabled={exists}
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
