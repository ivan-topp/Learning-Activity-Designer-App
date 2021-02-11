import React from 'react';
import { Divider, Grid, List, ListItem, ListItemText, makeStyles, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { Group, Home, Public } from '@material-ui/icons';

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

    const redirectTo = (path) => {
        history.push(path);
    };

    return (
        <>
            <Grid container>
                <Grid item xs={12} md={3} lg={2} className={classes.leftPanel}>
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