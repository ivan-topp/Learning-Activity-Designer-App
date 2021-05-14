import { Avatar, Box, Button, Card, CardContent, CardHeader, makeStyles, TextField, Typography } from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';
import { CustomMenu } from 'components/CustomMenu';
import { useAuthState } from 'contexts/AuthContext';
import { useDesignState } from 'contexts/design/DesignContext';
import { useSocketState } from 'contexts/SocketContext';
import { useUiState } from 'contexts/ui/UiContext';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import types from 'types';
import { formatDate, formatTime } from 'utils/dateTimeFormatter';
import { formatName, getUserInitials } from 'utils/textFormatters';

const useStyles = makeStyles((theme) => ({
    root: ({ editing }) => ({
        marginBottom: 10,
        boxShadow: editing ? '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)': 'none',
    }),
    header: {
        paddingBottom: 0,
    }
}));

export const Commentary = ({ data }) => {
    const { enqueueSnackbar } = useSnackbar();
    const { authState } = useAuthState();
    const { dispatch } = useUiState();
    const { designState } = useDesignState();
    const { socket, online, emitWithTimeout } = useSocketState();
    const { design } = designState;
    const { user, date, commentary } = data;
    const [ editing, setEditing] = useState(false);
    const [ commentaryInput, setCommentaryInput ] = useState(commentary);
    const classes = useStyles({editing});

    const handleEditCommentary = ( e ) => {
        e.preventDefault();
        console.log();
        if(commentary.trim() !== commentaryInput.trim()){
            if(online){
                socket?.emit('comment-design', { 
                    designId: design._id, 
                    commentary: {
                        ...data,
                        commentary: commentaryInput.trim()
                    }
                }, emitWithTimeout(
                    (resp) => {
                        if(!resp.ok){
                            enqueueSnackbar(resp.message, { variant: 'error', autoHideDuration: 2000 });
                        }
                    },
                    () => {
                        setCommentaryInput(commentary);
                        enqueueSnackbar('Error al editar el comentario. Por favor revise su conexión. Tiempo de espera excedido.', { variant: 'error', autoHideDuration: 2000 });
                    },
                ));
            }
        }
        setEditing(false);
        
    };

    const handleDeleteCommentary = () => {
        dispatch({
            type: types.ui.setConfirmData,
            payload: {
                type: 'comentario',
                args: { 
                    designId: design._id, 
                    commentaryId: data._id,
                },
                actionMutation: null,
            }
        });
        dispatch({
            type: types.ui.toggleModal,
            payload: 'Confirmation',
        });
    };

    const getOptions = () => {
        if (authState.user.uid === user._id) {
            return <CustomMenu
                options={[
                    { icon: <Edit />, label: 'Editar', onSelect: () => setEditing(true) },
                    { icon: <Delete />, label: 'Eliminar', onSelect: handleDeleteCommentary },
                ]}
            />;
        } else if (authState.user.uid === design.owner) {
            return <CustomMenu
                options={[
                    { icon: <Delete />, label: 'Eliminar', onSelect: handleDeleteCommentary },
                ]}
            />;
        } else return <div></div>;
    };

    return (
        <Card className={classes.root} elevation={0}>
            <CardHeader
                className={classes.header}
                avatar={
                    <Avatar
                        alt={formatName(user.name, user.lastname)}
                        src={user.img && user.img.length > 0 ? `${process.env.REACT_APP_URL}uploads/users/${user.img}` : ''}
                    >
                        {getUserInitials(user.name, user.lastname)}
                    </Avatar>
                }
                action={
                    authState.user ? getOptions() : null
                }
                title={user.name + ' ' + user.lastname}
                subheader={formatDate(new Date(date)) + ' a las ' + formatTime(new Date(date))}
            />
            <CardContent>
                {
                    editing
                        ? <form onSubmit={handleEditCommentary} noValidate>
                            <TextField
                                multiline
                                rowsMax={6}
                                variant="outlined"
                                name="commentary"
                                value={commentaryInput ?? ''}
                                onChange={({ target }) => setCommentaryInput(target.value)}
                                label="Editar Comentario"
                                type="text"
                                fullWidth
                            />
                            <Box style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                                <Button type='submit' variant='contained' color='primary' disabled={!commentaryInput.length} disableElevation>
                                    Guardar
                                </Button>
                            </Box>
                        </form>
                        : <Typography >{commentary}</Typography>
                }
            </CardContent>
        </Card>
    )
}
