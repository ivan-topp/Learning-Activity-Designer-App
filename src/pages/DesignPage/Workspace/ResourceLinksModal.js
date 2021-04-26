import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, makeStyles} from '@material-ui/core';
import React, { useState } from 'react'
import types from 'types';
import { useUiState } from 'contexts/ui/UiContext';
import CloseIcon from '@material-ui/icons/Close';
import { useDesignState } from 'contexts/design/DesignContext';
import { ResourceLink } from './ResourceLink';
import { useSocketState } from 'contexts/SocketContext';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
    spaceInit:{
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },buttonZone: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        [theme.breakpoints.down('xs')]: {
            flexWrap: 'wrap',
        },
    },resourceZone: {
        height: 'auto',
        [theme.breakpoints.up('xs')]: {
            height: '90%',
            overflow: 'auto',
            overflowX: 'hidden',
        },
    },contentSpace:{
        height: 'auto',
        paddingBottom: theme.spacing(6),
        [theme.breakpoints.up('xs')]: {
            height: 'calc(100vh - 500px)',
            overflow: 'auto'
        },
    }
}));

export const ResourceLinksModal = () => {
    const classes = useStyles();
    const { uiState, dispatch } = useUiState();
    const { learningActivityIndex, taskIndex } = uiState.resourceLink;
    const { designState } = useDesignState();
    const { design } = designState;
    const [newResource, setNewResource] = useState([...design.data.learningActivities[learningActivityIndex].tasks[taskIndex].resourceLinks]);
    const { socket } = useSocketState();
    const { enqueueSnackbar } = useSnackbar();

    const handleClose = () => {
        setNewResource([...design.data.learningActivities[learningActivityIndex].tasks[taskIndex].resourceLinks]);
        dispatch({
            type: types.ui.setResourceLink,
            payload: {
                learningActivityIndex: null,
                taskIndex: null,
            }
        });
        dispatch({
            type: types.ui.toggleModal,
            payload: 'Resource',
        });
    };
    
    const handleAddResource = () =>{
        const newLinks = {
            title: '',
            link: '',
        }
        setNewResource([...newResource, newLinks]);
    };

    const handleAddResourceInDesign = () =>{
        socket.emit('change-resource-in-task', { designId: design._id, learningActivityIndex, taskIndex, resources: [...newResource] });
        dispatch({
            type: types.ui.toggleModal,
            payload: 'Resource'
        });
        enqueueSnackbar('Se ha agregado su recurso correctamente', { variant: 'success', autoHideDuration: 2000 });
    }
    
    return (
        <div>
            <Dialog onClose={handleClose} open={uiState.isResourceModalOpen} fullWidth={true} maxWidth={'md'} >
                <DialogTitle >
                    Administrar Recursos
                </DialogTitle>
                <IconButton aria-label='close' className={classes.closeButton} onClick={handleClose}>
                    <CloseIcon/>
                </IconButton>
                <DialogContent dividers >
                    <Grid className={classes.contentSpace}>
                        <div className={classes.buttonZone}>
                            <Button variant={'outlined'} color = {'primary'} onClick = {handleAddResource}>Agregar recurso</Button>
                        </div>
                        <Box className={classes.resourceZone}>
                            <Box >
                            {
                                newResource.map((resource, i) => <ResourceLink key={`resource-${i}-task-${taskIndex}-learningActivity-${learningActivityIndex}`} index={i} resource = {resource} newResource={newResource} setNewResource={setNewResource}/>)
                            }
                            </Box>
                        </Box>
                        
                    </Grid>
                </DialogContent>
                <DialogActions >
                    <Button onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant='contained' color='primary' onClick={handleAddResourceInDesign}>
                        Guardar recursos
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
