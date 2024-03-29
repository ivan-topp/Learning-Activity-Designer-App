import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, makeStyles, useTheme } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react'
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
    const theme = useTheme();
    const isMounted = useRef(true);
    const { uiState, dispatch } = useUiState();
    const { learningActivityIndex, taskIndex } = uiState.resourceLink;
    const { designState } = useDesignState();
    const { design } = designState;
    const [newResource, setNewResource] = useState([...design.data.learningActivities[learningActivityIndex].tasks[taskIndex].resourceLinks]);
    const { socket, emitWithTimeout } = useSocketState();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        return () => {
            isMounted.current = false;
        }
    }, []);

    const handleClose = () => {
        dispatch({
            type: types.ui.closeModal,
            payload: 'Resource',
        });
        setTimeout(() => {
            if (isMounted.current) setNewResource([...design.data.learningActivities[learningActivityIndex].tasks[taskIndex].resourceLinks]);
            dispatch({
                type: types.ui.setResourceLink,
                payload: {
                    learningActivityIndex: null,
                    taskIndex: null,
                }
            });
        }, theme.transitions.duration.enteringScreen);
    };
    
    const handleAddResource = () =>{
        const newLinks = {
            title: '',
            link: '',
        }
        if (isMounted.current) setNewResource([...newResource, newLinks]);
        if(uiState.userSaveDesign){
            dispatch({
                type: types.ui.setUserSaveDesign,
                payload: false,
            })
        };
    };

    const handleAddResourceInDesign = () =>{
        socket?.emit('change-resource-in-task', { designId: design._id, learningActivityIndex, taskIndex, resources: [...newResource] }, emitWithTimeout(
            (resp) => {
                enqueueSnackbar(resp.message, { variant: resp.ok ? 'success' : 'error', autoHideDuration: 2000 });
            },
            () => enqueueSnackbar('Error al modificar los recursos en la tarea. Por favor revise su conexión. Tiempo de espera excedido.', { variant: 'error', autoHideDuration: 2000 }),
        ));
        dispatch({
            type: types.ui.closeModal,
            payload: 'Resource'
        });
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
