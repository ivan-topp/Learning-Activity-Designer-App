import React, { useState } from 'react';
import { Box, IconButton, ListItemIcon, makeStyles, Menu, MenuItem, Typography } from '@material-ui/core';
import { Delete, Edit, Folder, MoreVert } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { RightClickMenu } from './RightClickMenu';
import { useUiState } from 'contexts/ui/UiContext';
import types from 'types';
import { deleteFolder } from 'services/FolderService';
import { useMutation, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        border: `1px solid ${theme.palette.divider}`,
        width: 325,
        minWidth: 325,
        borderRadius: 5,
        margin: '10px 10px 10px 0px',
        cursor: 'pointer',
        backgroundColor: theme.palette.background.paper,
        '&:hover': {
            boxShadow: '0px 0px 10px 0 #bcc3d6',
            background: theme.palette.background.designHover,
        },
    },
    content: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    folderContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        borderRadius: theme.shape.borderRadius,
        alignItems: 'center',
        width: '100%',
        userSelect: 'none',
        
        textDecoration: 'none',
        color: theme.palette.text.primary,
    },
    folderBody: {
        padding: '15px 10px 15px 20px',
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        textDecoration: 'none',
    },
    folderName: {
        paddingTop: 3,
        fontSize: 20,
        paddingLeft: 20,
    },
    more: {
        marginRight: 10,
    },
}));

export const DesignsFolder = ({ _id, name, path, ...rest }) => {
    const classes = useStyles();
    const [isMenuOpen, setMenuOpen] = useState(null);
    const { dispatch } = useUiState();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const parentPath = path !== '/' + name ? path.replace('/' + name, '') : path.replace(name, '');

    const deleteFolderMutation = useMutation(deleteFolder, {
        onMutate: async () => {
            await queryClient.cancelQueries(['folders', parentPath]);
            const previousFolders = queryClient.getQueryData(['folders', parentPath]);
            queryClient.setQueryData(['folders', parentPath], oldFolders => oldFolders.filter(folder => folder._id !== _id));
            return { previousFolders };
        },
        onSettled: () => {
            queryClient.invalidateQueries(['folders', parentPath]);
        },
        onError: (error, folder, context) => {
            queryClient.setQueryData(['folders', parentPath], context.previousFolders);
            enqueueSnackbar(error.message,  {variant: 'error', autoHideDuration: 2000});
        },
        onSuccess: data => {
            enqueueSnackbar('Carpeta eliminada con éxito.',  {variant: 'success', autoHideDuration: 2000});
        }
    });

    const handleRename = (e) => {
        setMenuOpen(null);
        dispatch({
            type: types.ui.setFolder,
            payload: {
                _id,
                name,
            },
        });
        dispatch({
            type: types.ui.openModal,
            payload: 'Folder',
        });
    };

    const handleDelete = async (e) => {
        setMenuOpen(null);
        dispatch({
            type: types.ui.setConfirmData,
            payload: {
                type: 'carpeta',
                args: { id: _id},
                actionMutation: deleteFolderMutation,
            }
        });
        dispatch({
            type: types.ui.openModal,
            payload: 'Confirmation',
        });
        //await deleteFolderMutation.mutate({ id: _id });
    };

    const handleOpenMenu = (e) => {
        e.stopPropagation();
        setMenuOpen(e.currentTarget);
    };

    return (
        <Box className={classes.root} {...rest} >
            <RightClickMenu options={[
                { icon: <Edit></Edit>, label: 'Cambiar Nombre', onSelect: handleRename },
                { icon: <Delete></Delete>, label: 'Eliminar', onSelect: handleDelete },
            ]}>
                <div className={classes.content}>
                    <Box className={classes.folderContainer} component={Link} to={`/my-designs${path}`} {...rest} >
                        <div className={classes.folderBody}>
                            <Folder fontSize='large' />
                            <Typography className={classes.folderName}>
                                {name}
                            </Typography>
                        </div>
                    </Box>
                    <IconButton className={classes.more} onClick={handleOpenMenu}>
                        <MoreVert />
                    </IconButton>
                    <Menu
                        onBlur={()=>setMenuOpen(null)}
                        anchorEl={isMenuOpen}
                        open={Boolean(isMenuOpen)}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        onClose={()=>setMenuOpen(null)}
                    >
                        <MenuItem onClick={handleRename}>
                            <ListItemIcon>
                                <Edit />
                            </ListItemIcon>
                            <Typography>Cambiar Nombre</Typography>
                        </MenuItem>
                        <MenuItem onClick={handleDelete}>
                            <ListItemIcon>
                                <Delete />
                            </ListItemIcon>
                            <Typography>Eliminar</Typography>
                        </MenuItem>
                    </Menu>
                </div>
            </RightClickMenu>
        </Box>
    );
};
