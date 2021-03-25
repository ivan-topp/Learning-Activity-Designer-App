import React from 'react'
import PieChart, {
    Legend,
    Series,
    Tooltip,
  } from 'devextreme-react/pie-chart';
import { useUserConfigState } from 'contexts/UserConfigContext';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';

export const PieGraphic = ({items}) => {
    const { userConfig } = useUserConfigState();
    const customizeTooltip = (arg) =>{
        return {
          text: `${arg.argumentText} - ${(arg.percent * 100).toFixed(1)}%`
        };
    };
    
    return (
        <>
            <PieChart
                id='pie'
                palette = {(userConfig.darkTheme) ? ['#57A8E7', '#E95D5D', '#C8951F', '#087A4C', '#DFDF3F', '#A75BCD'] : ['#57A8E7', '#E95D5D', '#C8951F', '#087A4C', '#DFDF3F', '#A75BCD']}
                dataSource={items}
                title = 'Análisis'
                theme = {(userConfig.darkTheme) ? 'generic.contrast' : 'generic.light'}
            >   
                <Series argumentField='title' valueField = 'value'/>
                <Legend
                    verticalAlignment='bottom'
                    horizontalAlignment='center'
                    itemTextPosition='right'
                    rowCount={2}
                />
                <Tooltip enabled={true} customizeTooltip={customizeTooltip}>
                </Tooltip>
            </PieChart>
        </>
    )
}