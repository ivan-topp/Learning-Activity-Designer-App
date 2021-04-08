import React, { useState } from 'react';
import { Box, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';

export const CustomMenu = ({ options, Icon=MoreVert }) => {
    const [isOpen, setOpen] = useState(null);

    const handleOpen = (e) => {
        setOpen(e.currentTarget);
    };

    const handleSelect = (e, onSelect) => {
        if(onSelect) onSelect(e);
        handleClose();
    };

    const handleClose = () => {
        setOpen(null);
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
        <div>
            <IconButton onClick={handleOpen}>
                <Icon />   
            </IconButton>
            <Menu
                anchorEl={isOpen}
                open={Boolean(isOpen)}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                onClose={handleClose}
            >   
                { renderContent() }
            </Menu>
        </div>
    )
}
