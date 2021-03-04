import React from 'react';
import { makeStyles, Tooltip } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        width: '100%',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '6px',
        height: '100%',
    },
    title:{
        display: 'flex',
        alignItems: 'center',
    },
    colorBox: {
        width: 10,
        height: 10,
        marginRight: 5,
        border: `1px solid #dddddd`,
    }
}));


export const StackedBar = ({
    height = 25,
    items = [{
        title: 'Investigación',
        value: 0.33,
    },{
        title: 'Práctica',
        value: 0.67,
    }]
}) => {
    const classes = useStyles();
    const colors = ['red', 'purple', 'green', 'yellow', 'grey', 'blue'];

    return (
        <div className={classes.root} style={{height}}>
            {
                items.map( (item, index) => (
                    <Tooltip 
                        key={`nombreGrafico${index}`} 
                        title={
                            <div className={classes.title}>
                                <div className={classes.colorBox} style={{backgroundColor: colors[index]}}></div>
                                {`${item.title}: ${item.value * 100}%`}
                            </div>
                        } 
                        arrow
                    >
                        <div
                            style={{
                                width: `${item.value * 100}%`, 
                                height: '100%', 
                                borderRadius: index === 0 
                                    ? '5px 0px 0px 5px'
                                    : index === items.length - 1
                                        ? '0px 5px 5px 0px'
                                        : 0,
                                backgroundColor: colors[index]
                                }}
                            >
                        </div>
                    </Tooltip>
                ))
            }
        </div>
    );
};
