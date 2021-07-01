import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles, Typography, useTheme } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useUiState } from 'contexts/ui/UiContext';
import CloseIcon from '@material-ui/icons/Close';
import types from 'types';
import { useDesignState } from 'contexts/design/DesignContext';
import { useSnackbar } from 'notistack';
import { useSocketState } from 'contexts/SocketContext';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Reorder } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    root: {
        margin: 10,
        height: 400,
    },
    dndZone: {
        width: '100%',
        padding: 10,
        backgroundColor: theme.palette.background.default,
    },
    ellipsis: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    draggable: {
        display: 'flex',
        alignItems: 'center',
        height: 55,
        width: '100%',
        marginBottom: 5,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        padding: '5px 10px',
        backgroundColor: theme.palette.background.paper,
    },
}));

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

export const ReorderActivitiesModal = () => {
    const theme = useTheme();
    const classes = useStyles();
    const isMounted = useRef(true);
    const { uiState, dispatch } = useUiState();
    const { designState } = useDesignState();
    const { design } = designState;
    const { enqueueSnackbar } = useSnackbar();
    const { socket, emitWithTimeout } = useSocketState();
    const [newOrder, setNewOrder] = useState([...design.data.learningActivities]);
    // console.log(newOrder);
    useEffect(() => {
        return () => {
            isMounted.current = false;
        }
    }, []);

    useEffect(() => {
        if (isMounted.current) setNewOrder([...design.data.learningActivities]);
    }, [design.data.learningActivities]);

    const handleClose = () => {
        dispatch({
            type: types.ui.closeModal,
            payload: 'ReorderActivities'
        });
        setTimeout(() => {
            if (isMounted.current) setNewOrder([...design.data.learningActivities]);
        }, theme.transitions.duration.enteringScreen);
    };

    const handleReorder = () => {
        console.log(newOrder.map(la => la.id));
        socket?.emit('reorder-activities', { designId: design._id, newOrder: newOrder.map(la => la.id) }, emitWithTimeout(
            (resp) => {
                if (resp.ok && uiState.userSaveDesign) {
                    dispatch({
                        type: types.ui.setUserSaveDesign,
                        payload: false,
                    });
                }
                return enqueueSnackbar(resp.message, { variant: resp.ok ? 'success' : 'error', autoHideDuration: 2000 });
            },
            () => enqueueSnackbar('Error la cambiar el orden de las actividades. Por favor revise su conexión. Tiempo de espera excedido.', { variant: 'error', autoHideDuration: 2000 }),
        ));
        handleClose();
    };

    if (!design) {
        return (<Typography>Cargando...</Typography>);
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const items = reorder(
            newOrder,
            result.source.index,
            result.destination.index
        );
        if (isMounted.current) setNewOrder(items);
    };

    return (
        <>
            <Dialog
                open={uiState.isReorderActivitiesModalOpen}
                onClose={handleClose}
                maxWidth={'sm'}
                fullWidth
            >
                <DialogTitle >
                    Ordenar Actividades
                </DialogTitle>
                <IconButton aria-label='close' className={classes.closeButton} onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers style={{ padding: 0 }}>
                    <Box className={classes.root}>
                        <Typography variant='body2' gutterBottom style={{ marginLeft: 10, marginRight: 10 }}>
                            En la siguiente lista puede ordenar las actividades de aprendizaje como desee.
                            Para hacer esto, arrastre y suelte las actividades.
                        </Typography>
                        <Typography variant='body2' gutterBottom style={{ paddingLeft: 10, paddingRight: 10, fontSize: '0.75rem' }}>
                            IMPORTANTE: Esta funcionalidad solo se encuentra disponible cuando hay un solo usuario conectado al diseño de aprendizaje.
                        </Typography>
                        {
                            designState.users.length > 1 && <Alert severity='warning' variant='outlined' style={{display: 'flex', alignItems: 'center'}}>
                                Esta funcionalidad está habilitada cuando hay un solo usuario conectado al diseño.
                                Por lo tanto, no podrá guardar los cambios. 
                                Por favor inténtelo más tarde, cuando solo usted esté conectado al diseño.
                            </Alert>
                        }
                        {
                            newOrder.length > 0
                                ? <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId="reorder-activities">
                                        {(provided, snapshot) => (
                                            <Box
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className={classes.dndZone}
                                            >
                                                {newOrder.map((la, index) => (
                                                    <Draggable key={la.id} draggableId={la.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={classes.draggable}
                                                            >
                                                                <Reorder style={{ marginRight: 10 }} />
                                                                <Box className={classes.ellipsis}>
                                                                    <Typography className={classes.ellipsis} color='textPrimary' title={!!la.title ? la.title : 'Actividad sin título'}>{!!la.title ? la.title : 'Actividad sin título'}</Typography>
                                                                    <Typography className={classes.ellipsis} color='textSecondary' variant='caption' title={!!la.description ? la.description : 'Actividad sin Descripción'}>{!!la.description ? la.description : 'Actividad sin Descripción'}</Typography>
                                                                </Box>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </Box>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                                : <Box fontSize='caption.fontSize' fontStyle='italic' textAlign='center' marginTop='50px'>
                                    No se han registrado actividades para este diseño de aprendizaje.
                                </Box>
                        }

                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant='contained' color='primary' disabled={designState.users.length > 1} onClick={handleReorder}>
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
