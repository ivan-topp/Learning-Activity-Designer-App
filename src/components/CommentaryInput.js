import React, { useState } from 'react';
import { Avatar, Box, Button, Card, CardContent, Link, makeStyles, TextField, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import { useAuthState } from 'contexts/AuthContext';
import { formatName, getUserInitials } from 'utils/textFormatters';
import { useSocketState } from 'contexts/SocketContext';
import { useDesignState } from 'contexts/design/DesignContext';
import { useUiState } from 'contexts/ui/UiContext';
import types from 'types';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles({
    clickHere: {
        textDecoration: 'none',
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'underline'
        }
    }
});

export const CommentaryInput = () => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const isXSDevice = useMediaQuery(theme.breakpoints.down('xs'));
    const { dispatch } = useUiState();
    const { authState } = useAuthState();
    const { designState } = useDesignState();
    const { socket, online, emitWithTimeout } = useSocketState();
    const [commentary, setCommentary] = useState('');
    const { design } = designState;
    const { user } = authState;

    const handleComment = (e) => {
        e.preventDefault();
        if(online){
            socket?.emit('comment-design', {
                designId: design._id,
                commentary: {
                    user: {
                        _id: user.uid,
                        name: user.name,
                        lastname: user.lastname,
                        img: user.img,
                    },
                    date: new Date().toJSON(),
                    commentary: commentary.trim(),
                }
            }, emitWithTimeout(
                (resp) => {
                    if(!resp.ok){
                        enqueueSnackbar(resp.message, { variant: 'error', autoHideDuration: 2000 });
                    }
                },
                () => enqueueSnackbar('Error al agregar el comentario. Por favor revise su conexión. Tiempo de espera excedido.', { variant: 'error', autoHideDuration: 2000 }),
            ));
            reset();
        }
    };

    const reset = () => {
        setCommentary('');
    };

    const handleOpenLoginModal = () => {
        dispatch({
            type: types.ui.toggleModal,
            payload: 'Login',
        });
    };

    return (
        <Card elevation={0} style={{ marginBottom: 10 }}>
            <CardContent>
                {
                    authState.user
                        ? (<form onSubmit={handleComment} noValidate>
                            <Box style={{ display: 'flex', marginBottom: 10 }}>
                                {
                                    !isXSDevice && <Avatar
                                        style={{ marginRight: 10, marginTop: 5 }}
                                        alt={formatName(user.name, user.lastname)}
                                        src={user.img && user.img.length > 0 ? `${process.env.REACT_APP_URL}uploads/users/${user.img}` : ''}
                                    >
                                        {getUserInitials(user.name, user.lastname)}
                                    </Avatar>
                                }
                                <TextField
                                    multiline
                                    variant="outlined"
                                    name="commentary"
                                    InputLabelProps={{ shrink: true }}
                                    placeholder='Ingresa tu comentario'
                                    value={commentary}
                                    onChange={({ target }) => setCommentary(target.value)}
                                    label="Nuevo Comentario"
                                    type="text"
                                    fullWidth
                                />
                            </Box>
                            <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button type='submit' variant='contained' color='primary' disabled={!commentary.length} disableElevation>
                                    Comentar
                                </Button>
                            </Box>
                        </form>)
                        : <Typography align='center'>Para poder comentar este diseño debes <Link className={classes.clickHere} onClick={handleOpenLoginModal}>ingresar sesión</Link>.</Typography>
                }
            </CardContent>
        </Card>
    )
}
