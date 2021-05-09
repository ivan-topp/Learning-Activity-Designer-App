import { Box, ListItemIcon, Menu, MenuItem, Typography } from '@material-ui/core';
import React, { useRef, useState } from 'react';

const initialState = {
    mouseX: null,
    mouseY: null,
};

export const RightClickMenu = ({ options, children }) => {

    const [state, setState] = useState(initialState);
    const ref = useRef();

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const area = ref.current.getBoundingClientRect();
        if(
            (e.clientX >= area.x && e.clientX <= (area.x + area.width)) &&
            (e.clientY >= area.y && e.clientY <= (area.y + area.height))
        ) {
            setState({
                mouseX: e.clientX - 2,
                mouseY: e.clientY - 4,
            });
        } else handleClose();
    };

    const handleSelect = (e, onSelect) => {
        if(onSelect) onSelect(e);
        handleClose();
    };

    const handleClose = () => {
        setState(initialState);
    };

    const renderContent = () => {
        if(options && options.length){
            return options.map((option, index) => {
                return (<MenuItem key={`option-${index}-${option}`} onClick={ (e) => handleSelect(e, option.onSelect)}>
                    {
                        option.icon 
                            ?   <ListItemIcon>
                                    { option.icon }
                                </ListItemIcon> 
                            : <div></div>
                    }
                    <Typography>{ option.label }</Typography>
                </MenuItem>);
            });
        }else {
            return (
                <Typography component='div'>
                    <Box fontStyle="italic">
                        No hay opciones especificadas.
                    </Box>
                </Typography>
            );
      }
    };

    return (
        <div ref={ref} onContextMenu={handleClick} style={{width: 325}}>
            {children}
            <Menu
                keepMounted
                open={state.mouseY !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                state.mouseY !== null && state.mouseX !== null
                    ? { top: state.mouseY, left: state.mouseX }
                    : undefined
                }
            >   
                { renderContent() }
            </Menu>
        </div>
    )
}
