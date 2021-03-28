import { IconButton, makeStyles, Snackbar, SnackbarContent } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import CloseIcon from '@material-ui/icons/Close';
import React, { useState } from 'react'

const useStyles = makeStyles((theme) => ({
    success: {
        backgroundColor: green[600]
    },
    error:{
        backgroundColor: '6C140D'
    }

}));

export const EmitMessage = ({type, message, autoClose}) => {
    
    const classes = useStyles();
    const [open, setOpen] = useState(true);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
      };

    return (
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                open={open}
                autoHideDuration={autoClose}
                onClose={handleClose}>
                <SnackbarContent
                    className = {classes[type]}
                    message = {message}
                    action = {
                        <IconButton onClick={handleClose}>
                            <CloseIcon></CloseIcon>
                        </IconButton>
                    }
                >  
                </SnackbarContent>   
            </Snackbar>
        </div>
    )
}
