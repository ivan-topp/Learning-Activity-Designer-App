import React from 'react';
import { Button, Divider, List, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import { Group, Home, Public } from '@material-ui/icons';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { useAuthState } from '../../contexts/AuthContext';
import { createDesign } from '../../services/DesignService';

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: 10,
    },
}));

export const LeftPanel = () => {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const queryClient = useQueryClient();
    const { authState } = useAuthState();

    const createDesignMutation = useMutation(createDesign, {
        onMutate: async () => {
            await queryClient.cancelQueries('recent-designs');
            await queryClient.cancelQueries(['designs', '/']);
            await queryClient.cancelQueries([authState.user.id, 'user-public-designs']);
        },
        onSettled: () => {
            queryClient.invalidateQueries('recent-designs');
            queryClient.invalidateQueries(['designs', '/']);
            queryClient.invalidateQueries([authState.user.id, 'user-public-designs']);
        },
        onError: (error) => {
            // TODO: Emitir notificación o message para denotar el error.
            console.log(error);
        },
        onSuccess: data => {
            history.push(`/designs/${data.design._id}`);
        }
    });

    const handleCreateDesign = async () => {
        await createDesignMutation.mutate('/');
    };

    return (
        <>
            <Button variant='contained' color='default' style={{ margin: 10 }} onClick={handleCreateDesign}>
                Crear Diseño
            </Button>
            <List component="nav" aria-label="main mailbox folders">
                <ListItem button selected={location.pathname.includes('/my-designs')} component={ Link } to='/my-designs'>
                    <Home className={classes.icon} />
                    <ListItemText primary='Mis Diseños'/>
                </ListItem>
                <Divider />
                <ListItem button selected={location.pathname.includes('/shared-with-me')} component={ Link } to='/shared-with-me'>
                    <Group className={classes.icon} />
                    <ListItemText primary='Compartidos Conmigo' />
                </ListItem>
                <Divider />
                <ListItem button selected={location.pathname.includes('/public-repository')} component={ Link } to='/public-repository'>
                    <Public className={classes.icon} />
                    <ListItemText primary='Repositorio Público' />
                </ListItem>
                <Divider />
            </List>
        </>
    )
}
