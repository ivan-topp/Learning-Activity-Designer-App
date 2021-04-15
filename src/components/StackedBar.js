import React from 'react';
import { makeStyles, Tooltip, Typography } from '@material-ui/core';
import { useUserConfigState } from 'contexts/UserConfigContext';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        width: '100%',
        border: `1px solid ${theme.palette.divider}`,
        //borderRadius: '6px',
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
    },
    colorBoxRightPanel: {
        width: 13,
        height: 13,
        marginRight: 5,
    },
    spacingGraphic:{
        marginTop: theme.spacing(1),
        display: 'flex',
        flexWrap: 'wrap',
    },
    legend:{
        marginTop: theme.spacing(0.5),
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5),
        display: 'flex',
        alignItems: 'center',
    },
}));

/*borderRadius: index === 0 
    ? '5px 0px 0px 5px'
    : index === items.length - 1  && item.value !== 0
        ? '0px 5px 5px 0px'
        : 0,
*/

export const StackedBar = ({ height = 25, items, type, legends, colorGraphicToPdf }) => {
    const classes = useStyles();
    const { userConfig } = useUserConfigState();
    let colors = [];
    let valueTotal = 0;
    
    items.map ((item) =>( valueTotal = item.value + valueTotal));
    if( type === 'Activity' ){ (userConfig.darkTheme) ? colors = ['#57A8E7', '#E95D5D', '#C8951F', '#087A4C', '#DFDF3F', '#A75BCD'] : colors = ['#57A8E7', '#E95D5D', '#C8951F', '#087A4C', '#DFDF3F', '#A75BCD'];}
    else if( type === 'Format'){ (userConfig.darkTheme) ? colors = ['rgba(61, 156, 65, 0.8)', 'rgba(224, 243, 225, 0.8)', 'rgba(102, 242, 108, 0.75)'] : colors = ['rgba(61, 156, 65, 0.8)', 'rgba(224, 243, 225, 0.8)', 'rgba(102, 242, 108, 0.75)'];}
    else if( type === 'Modality' ){ (userConfig.darkTheme) ? colors = ['#A6CAF6', '#6996CD', '#5FA2EF', '#135BB3'] : colors = ['#A6CAF6', '#6996CD', '#5FA2EF', '#135BB3']};
    
    return (
        <>  
            <div className={classes.root} style={{height}} >
                {   
                    items.map( (item, index) => (
                        <Tooltip 
                            key={`nombreGrafico${index}`} 
                            title={
                                <div className={classes.title}>
                                    <div className={classes.colorBox} style={{backgroundColor: colors[index]}}></div>
                                    {`${item.title}: ${((item.value * 100)/valueTotal).toFixed(1)}%`}
                                </div>
                            } 
                            arrow
                        >
                            <div
                                style={{
                                    width: `${item.value * 100}%`, 
                                    height: '100%', 
                                    backgroundColor: colors[index]
                                    }}
                                >
                            </div>
                        </Tooltip>
                    ))
                }
            </div>
            {   
                (legends) && 
                <div className={classes.spacingGraphic}>
                    { items.map ((item, index) =>( 
                        <div className={classes.legend} key = {`legends-${index}`}  >
                            <div className={classes.colorBoxRightPanel} style={{backgroundColor: colors[index]}}></div>
                            {colorGraphicToPdf ? 
                                <Typography variant="caption" > {item.title} </Typography> 
                                :
                                <Typography variant="caption" style={{color: "#000000"}}> {item.title} </Typography>
                            }
                        </div>)
                    )}
                </div>
            }
        </>
    );
};
