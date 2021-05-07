import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useInfiniteQuery } from 'react-query';
import queryString from 'query-string';
import { Button, Divider, Grid, List, ListItem, ListItemText, makeStyles, Typography } from '@material-ui/core';
import { Group, Home, Public } from '@material-ui/icons';
import { searchUsers } from 'services/UserService';
import { Alert } from '@material-ui/lab';
import { UserCard } from 'components/UserCard';
import { UserCardSkeleton } from 'components/UserCardSkeleton';

const useStyles = makeStyles((theme) => ({
    leftPanel: {
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    workspace: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 50,
        background: theme.palette.background.workSpace,
        height: 'auto',
        [theme.breakpoints.up('md')]: {
            height: 'calc(100vh - 177px)',
            overflow: 'auto'
        },
    },
    rightPanel: {
        display: 'flex',
        flexDirection: 'column',
        borderLeft: `1px solid ${theme.palette.divider}`,
    },
    icon: {
        marginRight: 10,
    },
    usersContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 15,
    },
    errorContainer: {
        marginTop: 15,
        marginBottom: 15,
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
    },
    error: {
        minWidth: '50%',
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
    },
    loadMore: {
        marginTop: 50,
    }
}));

export const SearchUsersPage = () => {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const { q } = queryString.parse(location.search);

    const redirectTo = (path) => {
        history.push(path);
    };

    const { data, status, error, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery('search-users', async ({ pageParam = 0 }) => {
        return await searchUsers(q, pageParam);
    }, {
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage, pages) => {
            if (lastPage.nPages === pages.length) return undefined;
            return lastPage.from;
        },
    });

    const userList = () => {
        return data.pages.map((page, index) => {
            return page.users.map((user, i) => <UserCard key={user._id} {...user} />);
        });
    };

    const usersSkeletonsList = () => {
        return [...Array(6).keys()].map((index) => (
            <UserCardSkeleton key={`user-skeleton-${index}`} />
        ));
    };

    if (!q) {
        return (
            <div className={classes.errorContainer}>
                <Alert severity='error' className={classes.error}>
                    No se ha ingresado filtro para la búsqueda de usuarios. Por favor ingrese información en la entrada de texto de la barra de navegación para buscar usuarios
                    y presione 'enter' o el ícono de búsqueda.
                </Alert>
            </div>
        );
    }
    
    return <>
        <Grid container>
            <Grid item xs={12} md={3} lg={2} className={classes.leftPanel}>
                <List component="nav" aria-label="main mailbox folders">
                    <ListItem button onClick={() => redirectTo('/my-designs')}>
                        <Home className={classes.icon} />
                        <ListItemText primary="Mis Diseños" />
                    </ListItem>
                    <Divider />
                    <ListItem button onClick={() => redirectTo('/shared-with-me')}>
                        <Group className={classes.icon} />
                        <ListItemText primary="Compartidos Conmigo" />
                    </ListItem>
                    <Divider />
                    <ListItem button onClick={() => redirectTo('/public-repository')}>
                        <Public className={classes.icon} />
                        <ListItemText primary="Repositorio Público" />
                    </ListItem>
                    <Divider />
                </List>
            </Grid>
            <Grid item xs={12} md={6} lg={8} className={classes.workspace}>
                
                {
                    status === 'loading' ? (
                        <div style={{ paddingTop: 15 }}>
                            <Typography variant='h4'>Buscando usuarios...</Typography>
                            <div>
                                { usersSkeletonsList() }
                            </div>
                        </div>
                    ) : status === 'error' ? (
                        <Alert severity='error' className={classes.error}>
                            { error.message}
                        </Alert>
                    ) : (
                        <div style={{ paddingTop: 15 }}>
                            <Typography variant='h4'>Usuarios encontrados</Typography>
                            {
                                data.pages[0].users.length > 0
                                    ? (<>
                                        <div className={classes.usersContainer}>
                                            {userList()}
                                            {
                                                data && hasNextPage && <Button className={classes.loadMore} color='primary' onClick={() => fetchNextPage()}>
                                                    {
                                                        isFetchingNextPage
                                                            ? 'Cargando más...'
                                                            : 'Cargar Más'
                                                    }
                                                </Button>
                                            }
                                        </div></>)
                                    : <Alert severity='error' className={classes.error}>
                                        No se han encontrado coincidencias.
                                </Alert>
                            }
                        </div>
                    )
                }
            </Grid>
            <Grid item xs={12} md={3} lg={2} className={classes.rightPanel}></Grid>
        </Grid>
    </>
}
