import React from 'react';
import { Button, Divider, Grid, List, ListItem, ListItemText, makeStyles, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { Group, Home, Public } from '@material-ui/icons';
import { useAuthState } from '../../contexts/AuthContext';
import { useMutation, useQueryClient } from 'react-query';
import { createDesign } from '../../services/DesignService';

const useStyles = makeStyles((theme) => ({
    leftPanel: {
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    workspace: {
        paddingLeft: 30,
        paddingRight: 30,
        minHeight: '100vh',
    },
    rightPanel: {
        display: 'flex',
        flexDirection: 'column',
        borderLeft: `1px solid ${theme.palette.divider}`,
    },
    icon:{
        marginRight: 10,
    }
}));

export const PublicRepositoryPage = () => {
    const classes = useStyles();
    const history = useHistory();
    const { authState } = useAuthState();
    const queryClient = useQueryClient();

    const createDesignMutation = useMutation(createDesign, {
        onMutate: async (path) => {
            await queryClient.cancelQueries('recent-designs');
            await queryClient.cancelQueries(['designs', path]);
            await queryClient.cancelQueries([authState.user.id, 'user-public-designs']);
        },
        onSettled: (data, error, path) => {
            queryClient.invalidateQueries('recent-designs');
            queryClient.invalidateQueries(['designs', path]);
            queryClient.invalidateQueries([authState.user.id, 'user-public-designs']);
        },
        onError: (error) => {
            // TODO: Emitir notificación o message para denotar el error.
            console.log(error);
        },
        onSuccess: data => {
            console.log('onSuccess');
            console.log(data);
            history.push(`/designs/${data.design._id}`);
        }
    });

    const redirectTo = (path) => {
        history.push(path);
    };

    const handleCreateDesign = async ( e, path = '/' ) => {
        await createDesignMutation.mutate(path);
    };

    return (
        <>
            <Grid container>
                <Grid item xs={12} md={3} lg={2} className={classes.leftPanel}>
                    <Button variant='contained' color='default' style={{margin:10}} onClick={handleCreateDesign}> 
                        Crear Diseño
                    </Button>
                    <List component="nav" aria-label="main mailbox folders">
                        <ListItem button onClick={() => redirectTo('/my-designs')}>
                            <Home className={classes.icon}/>
                            <ListItemText primary="Mis Diseños" />
                        </ListItem>
                        <Divider />
                        <ListItem button  onClick={() => redirectTo('/shared-with-me')}>
                            <Group className={classes.icon}/>
                            <ListItemText primary="Compartidos Conmigo" />
                        </ListItem>
                        <Divider />
                        <ListItem button selected>
                            <Public className={classes.icon}/>
                            <ListItemText primary="Repositorio Público" />
                        </ListItem>
                        <Divider />
                    </List>
                </Grid>
                    <Grid item xs={12} md={6} lg={8} className={classes.workspace}>
                        <Typography variant='h4'>Repositorio Público</Typography>
                    </Grid>
                    <Grid item xs={12} md={3} lg={2} className={classes.rightPanel}></Grid>
                </Grid>
        </>
    );
};