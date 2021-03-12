import React from 'react'
import CloseIcon from '@material-ui/icons/Close';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles, } from '@material-ui/core';
import { useUiState } from '../../contexts/UiContext';
import { getUser } from '../../services/UserService';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import { UserCard } from '../../components/UserCard';

const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}));

export const ShowContactsModal = () => {
    const classes = useStyles();
    const { uiState, setUiState } = useUiState();
    const urlparams = useParams();
    const uid = urlparams.uid;

    const { data } = useQuery(['user-profile', uid], async () => {
        return await getUser(uid);
    }, { refetchOnWindowFocus: false });
    
    const contactList = () => {
        return data.contacts.map(( contact ) => {
            return <UserCard key={contact._id} {...contact}/>
        });
    };

    const handleClose = () => {
        setUiState((prevState) => ({
            ...prevState,
            isContactsModalOpen: false,
        }));
    };
    return (
        <>  
            <Dialog onClose={handleClose} aria-labelledby='customized-dialog-title' open={uiState.isContactsModalOpen}>
                <DialogTitle id='customized-dialog-title' onClose={handleClose}>
                    Contactos.
                <IconButton aria-label='close' className={classes.closeButton} onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    { contactList() }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
