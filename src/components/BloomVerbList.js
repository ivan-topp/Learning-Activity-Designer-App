import { FormControlLabel, makeStyles, Radio } from '@material-ui/core';
import React from 'react'
import { useQuery } from 'react-query';
import { getBloomVerbs } from '../services/BloomService';

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

export const BloomVerbList = ({ active, setVerb, category, results }) => {
    const classes = useStyles();

    const { isLoading, isError, data } = useQuery('bloom-verbs', async () => {
        return await getBloomVerbs(category);
    }, { refetchOnWindowFocus: false, retry: true});

    if(isLoading){
        return (<div>Cargando los verbos de bloom...</div>);
    }

    if(isError){
        return (<div>Error al intentar obtener los verbos de bloom.</div>);
    }
    console.log(active);

    const createOptionList = () => {
        console.log(results);
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
                    onChange={(e)=> setVerb(option.name)}
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
