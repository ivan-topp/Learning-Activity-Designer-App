import React, { useState } from 'react';
import { Box, Button, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';

export const CustomMenu = ({ options, Icon, text, fullWidth = false, children }) => {
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
        }else if(children){
            return children;
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
        <div style={{width: fullWidth ? '100%': 'auto'}}>
            {
                text 
                    ? <Button fullWidth={fullWidth} variant='outlined' onClick={handleOpen}>
                        {Icon}
                        <Typography style={{marginLeft: 10}}>{text}</Typography> 
                    </Button>
                    : <IconButton onClick={handleOpen}>
                        {Icon ?? <MoreVert />} 
                    </IconButton>
            }
            
            <Menu
                anchorEl={isOpen}
                open={Boolean(isOpen)}
                keepMounted
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
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
