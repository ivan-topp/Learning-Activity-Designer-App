import React, { useState } from 'react'
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, Grid, IconButton, Link as MaterialLink, makeStyles, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import { useUiState } from 'contexts/ui/UiContext';
import CloseIcon from '@material-ui/icons/Close';
import types from 'types';
import { Alert, Autocomplete } from '@material-ui/lab';
import { useDesignState } from 'contexts/design/DesignContext';
import { useSnackbar } from 'notistack';
import { useQuery } from 'react-query';
import { getUser } from 'services/UserService';
import { useSocketState } from 'contexts/SocketContext';
import { Link } from 'react-router-dom';
import { Add, FileCopy } from '@material-ui/icons';
import { CustomMenu } from 'components/CustomMenu';

const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    titleSectionShare: {
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        width: 'fit-content',
    },
    divSectionShare: {
        padding: 20,
    },
}));

export const ShareModal = () => {
    const classes = useStyles();
    const { uiState, dispatch } = useUiState();
    const { designState } = useDesignState();
    const { design } = designState;
    const [user] = useState('');
    const [inputUser, setInputUser] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    const { socket, emitWithTimeout } = useSocketState();
    const [newPrivileges, setNewPrivileges] = useState([...design.privileges]);
    const { data, error, isError, isLoading } = useQuery(['user-profile', design.owner], async () => {
        return await getUser(design.owner);
    }, { refetchOnWindowFocus: false });

    const handleAddContactInArray = (v) => {
        if (!v) return;
        const user = data.contacts.find(u => u.name === v);
        if (!user) return;
        const isInDesignContacts = design.privileges.map(privilege => privilege.user._id === user._id).reduce((a, b) => a || b);
        if (!isInDesignContacts) {
            setNewPrivileges([...newPrivileges, { user, type: 1 }]);
        } else {
            enqueueSnackbar('El usuario ya se encuentra agregado', { variant: 'error', anchorOrigin: { vertical: 'bottom', horizontal: 'center' }, autoHideDuration: 2000 });
        };
        setInputUser('');
    };

    const handleClose = () => {
        setNewPrivileges([...design.privileges]);
        dispatch({
            type: types.ui.toggleModal,
            payload: 'Share'
        });
    };

    const handleAddContactInDesign = () => {
        socket?.emit('change-design-privileges', { designId: design._id, privileges: [...newPrivileges] }, emitWithTimeout(
            (resp) => {
                if(!resp.ok) setNewPrivileges([...design.privileges]);
                enqueueSnackbar(resp.message, { variant: resp.ok ? 'success' : 'error', autoHideDuration: 2000 });
            },
            () => {
                setNewPrivileges([...design.privileges]);
                enqueueSnackbar('Error al compartir el diseño. Por favor revise su conexión. Tiempo de espera excedido.', { variant: 'error', autoHideDuration: 2000 });
            },
        ));
        dispatch({
            type: types.ui.toggleModal,
            payload: 'Share'
        });
    };

    const handleCopyLinkToClipboard = () => {
        navigator.clipboard.writeText(process.env.REACT_APP_URL + 'shared-link/' + design.readOnlyLink);
        enqueueSnackbar('Enlace copiado.', { variant: 'success', anchorOrigin: { vertical: 'bottom', horizontal: 'left' }, autoHideDuration: 2000 });
    };

    const handleGenerateLink = () => {
        socket?.emit('generate-new-share-link', { designId: design._id }, emitWithTimeout(
            (resp) => enqueueSnackbar(resp.message, { variant: resp.ok ? 'success' : 'error', autoHideDuration: 2000 }),
            () => enqueueSnackbar('Error al generar el nuevo enlace. Por favor revise su conexión. Tiempo de espera excedido.', { variant: 'error', autoHideDuration: 2000 }),
        ));
    };

    const handleChange = (e, type, index) => {
        const v = e.target.value;
        if (v === type) return;
        if (v === 'Quitar') {
            if (index === newPrivileges.length - 1) {
                setNewPrivileges([
                    ...newPrivileges.slice(0, index),
                ])
            } else {
                setNewPrivileges([
                    ...newPrivileges.slice(0, index),
                    ...newPrivileges.slice(index + 1, newPrivileges.length)
                ])
            }
        } else {
            const p = { ...newPrivileges[index] };
            p.type = v;
            if (index === newPrivileges.length - 1) {
                setNewPrivileges([
                    ...newPrivileges.slice(0, index),
                    p,
                ])
            } else {
                setNewPrivileges([
                    ...newPrivileges.slice(0, index),
                    p,
                    ...newPrivileges.slice(index + 1, newPrivileges.length)
                ])
            }
        };
    };

    if (error) {
        return (
            <div className={classes.error}>
                <Alert severity='error'>
                    {error}
                </Alert>
            </div>
        );
    };

    if (!design || !data) {
        return (<Typography>Cargando...</Typography>);
    };

    const content = () => {
        if (isLoading) {
            return <Typography>Cargando...</Typography>
        } else if (isError) {
            return (
                <div className={classes.error}>
                    <Alert severity='error'>
                        {error}
                    </Alert>
                </div>)
        } else {
            return (
                <>

                    <div className={classes.divSectionShare}>
                        <div className={classes.titleSectionShare}>
                            <Typography color='textSecondary'> Compartir mediante enlace </Typography>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 10, paddingLeft: 10, paddingRight: 10 }}>
                            <Typography align='justify'> Mediante el siguiente enlace puedes compartir este diseño en modo solo lectura: </Typography>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <MaterialLink
                                    style={{ wordBreak: 'break-word' }}
                                    component={Link}
                                    to={`/shared-link/${design.readOnlyLink}`}
                                    onClick={handleClose}
                                    align='center'
                                >
                                    {process.env.REACT_APP_URL + 'shared-link/' + design.readOnlyLink}
                                </MaterialLink>
                                <CustomMenu options={[
                                    { icon: <FileCopy fontSize='small' />, label: 'Copiar enlace', onSelect: handleCopyLinkToClipboard },
                                    { icon: <Add />, label: 'Generar nuevo enlace', onSelect: handleGenerateLink },
                                ]} />
                            </div>
                        </div>
                    </div>
                    <Divider />
                    <div className={classes.divSectionShare}>
                        <div className={classes.titleSectionShare}>
                            <Typography color='textSecondary'> Compartir a contactos </Typography>
                        </div>
                        <div>
                            <Autocomplete
                                value={user}
                                blurOnSelect
                                onChange={(e, v) => {
                                    handleAddContactInArray(v)
                                }}
                                inputValue={inputUser}
                                onInputChange={(event, newInputUser) => {
                                    setInputUser(newInputUser);
                                }}
                                options={data.contacts.map(contact => {
                                    return contact.name
                                })}
                                getOptionSelected={(option, value) => option.id === value.id}
                                renderInput={(params) =>
                                    <TextField
                                        {...params}
                                        label="Buscar Contacto"
                                        margin="normal"
                                        variant="outlined"
                                        InputProps={{ ...params.InputProps }}
                                    />
                                }
                            />
                        </div>
                        <div>
                            <Divider style={{ marginBottom: 10 }} />
                            {newPrivileges.map((privilege, i) => {
                                return (
                                    <Grid container style={{ marginBottom: 10 }} key={`privilege-${i}`}>
                                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Box style={{ justifyContent: 'space-between' }}>
                                                    <Avatar style={{ marginRight: 7 }} />
                                                </Box>
                                                <Box style={{ justifyContent: 'space-between' }}>
                                                    <Typography>{privilege.user.name + ' ' + privilege.user.lastname}</Typography>
                                                    <Typography color={'textSecondary'}>{privilege.user.email}</Typography>
                                                </Box>
                                            </div>
                                            <Box >
                                                {(privilege.user._id === design.owner) ?
                                                    <Typography>Propietario</Typography>
                                                    :
                                                    <FormControl variant='outlined' size='small'>
                                                        <Select
                                                            key={`privileges-action-${i}`}
                                                            name='type'
                                                            value={privilege.type}
                                                            onChange={(e) => { handleChange(e, privilege.type, i) }}
                                                        >
                                                            <MenuItem value={0}> Editor </MenuItem>
                                                            <MenuItem value={1}> Lector</MenuItem>
                                                            <MenuItem value={'Quitar'}> Quitar</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                }
                                            </Box>
                                        </Grid>
                                    </Grid>
                                )
                            })}
                        </div>
                    </div>
                </>
            )
        }
    };

    return (
        <>
            <Dialog
                open={uiState.isShareModalOpen}
                onClose={handleClose}
                maxWidth={'sm'}
                fullWidth
            >
                <DialogTitle >
                    Compartir Diseño
                </DialogTitle>
                <IconButton aria-label='close' className={classes.closeButton} onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers style={{ padding: 0 }}>
                    {content()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant='contained' color='primary' onClick={handleAddContactInDesign}>
                        Listo
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
