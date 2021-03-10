import { makeStyles } from '@material-ui/core';
import React from 'react';
import { useQuery } from 'react-query';
import { getBloomCategories } from 'services/BloomService';

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
        backgroundColor: theme.palette.primary.main,
        marginBottom: 10,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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
        boxShadow: '0 0px 8px 0 rgba(0, 0, 0, 0.2), 0 0px 20px 0 rgba(0, 0, 0, 0.19)'
    }
}));

export const BloomPiramid = ({index, setCategory}) => {
    const classes = useStyles();

    const { isLoading, isError, data} = useQuery('bloom-categories', async () => {
        return await getBloomCategories();
    }, { refetchOnWindowFocus: false });

    if(isLoading){
        return (<div>Cargando categorías de bloom...</div>);
    }

    if(isError){
        return (<div>Error al intentar obtener las categorías de bloom.</div>);
    }

    const createOptionList = () => {
        return data.bloomCategories.map( option => {
            const isActive = index === option._id;
            return (
                <div 
                    key={option._id}
                    onClick={()=> setCategory(isActive ? null : option._id)}
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
