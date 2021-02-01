import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Typography,
    IconButton,
    Grid,
} from '@material-ui/core';
import { CloseRounded } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    close: {
        position: 'absolute',
        top: 5,
        right: 5,
        padding: 15,
    },
    header: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
}));

export const ModalFormWithImage = React.memo(({ isOpen, handleClose, maxWidth = 'sm', title = '', subtitle = '', image, content, actions }) => {
    const classes = useStyles();

    return (
        <Dialog
            fullWidth={true}
            maxWidth={maxWidth}
            open={isOpen}
            onClose={handleClose}
        >
            <DialogTitle className={classes.header} disableTypography>
                <IconButton className={classes.close} onClick={handleClose} color="inherit" size='small'>
                    <CloseRounded />
                </IconButton>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        {image}
                    </Grid>
                    <Grid item xs={12}>
                        <Typography align='center' variant='h5' component='p'>
                            {title}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography align='center' variant='subtitle1' component='h1'>
                            {subtitle}
                        </Typography>
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent>
                {content}
            </DialogContent>
            {
                (actions) && <DialogActions>
                    {actions}
                </DialogActions>
            }
        </Dialog>
    );
});

ModalFormWithImage.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    image: PropTypes.object.isRequired,
    content: PropTypes.object,
    actions: PropTypes.object,
}; 