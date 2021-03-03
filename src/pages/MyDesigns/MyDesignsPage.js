import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { Breadcrumbs, Button, Divider, Grid, Link, List, ListItem, ListItemText, makeStyles, Typography } from '@material-ui/core';
import { RecentDesigns } from './RecentDesigns';
import { DesignsContainer } from '../../components/DesignsContainer';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';
import { Group, Home, Public } from '@material-ui/icons';
import { createDesign, getDesignsByFolder } from '../../services/DesignService';
import { getfolderByPath } from '../../services/FolderService';
import { FoldersContainer } from '../../components/FoldersContainer';
import { useAuthState } from '../../contexts/AuthContext';

const useStyles = makeStyles((theme) => ({
    leftPanel: {
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    workspace: {
        paddingLeft: 30,
        paddingRight: 30,
        background: theme.palette.background.workSpace,
        minHeight: 'calc(100vh - 128px)'
    },
    rightPanel: {
        display: 'flex',
        flexDirection: 'column',
        borderLeft: `1px solid ${theme.palette.divider}`,
    },
    icon: {
        marginRight: 10,
    },
    breadCrumbs: {
        marginTop: 20,
        marginBottom: 20,
        width: '100%',
        padding: '10px 15px 10px 15px',
        borderRadius: 3,
        backgroundColor: theme.palette.background.default
    },
    designsAndFoldersContainer: {
        paddingTop: 15,
    }
}));

export const MyDesignsPage = () => {
    const classes = useStyles();
    const history = useHistory();
    const urlparams = useParams();
    const designsRef = useRef(null);
    const queryClient = useQueryClient();
    const { authState } = useAuthState();
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const path = urlparams.urlPath ? '/' + urlparams.urlPath : '/';
    const folderName = !urlparams.urlPath ? 'Mis Diseños' : path.split('/')[path.split('/').length - 1];

    const designsQuery = useInfiniteQuery(['designs', path], async ({ pageParam = 0 }) => {
        return await getDesignsByFolder(path, pageParam);
    }, {
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage, pages) => {
            if(lastPage.nPages === pages.length) return undefined; 
            return lastPage.from;
        },
    });

    const foldersQuery = useQuery(['folders', path], async () => {
        return await getfolderByPath(path);
    }, { refetchOnWindowFocus: false });

    const createDesignMutation = useMutation(createDesign, {
        onMutate: async () => {
            await queryClient.cancelQueries('recent-designs');
            await queryClient.cancelQueries(['designs', path]);
            await queryClient.cancelQueries([authState.user.id, 'user-public-designs']);
        },
        onSettled: () => {
            queryClient.invalidateQueries('recent-designs');
            queryClient.invalidateQueries(['designs', path]);
            queryClient.invalidateQueries([authState.user.id, 'user-public-designs']);
        },
        onError: (error) => {
            // TODO: Emitir notificación o message para denotar el error.
            console.log(error);
        },
        onSuccess: data => {
            //console.log('onSuccess');
            //console.log(data);
            history.push(`/designs/${data.design._id}`);
        }
    });

    const redirectTo = useCallback(
        (path) => {
            history.push(path);
        },
        [history],
    );

    const handleOpenFolder = useCallback(
        (e, path) => {
            e.preventDefault();
            redirectTo('/my-designs' + path);
        },
        [redirectTo],
    );

    const createBreadcrumbsLinks = useCallback(
        () => {
            if (path.length !== 1) {
                let newPath = '';
                const folderList = path.split('/');
                folderList.shift();
                return folderList.map((folderName) => {
                    newPath += '/' + folderName;
                    const folderPath = newPath;
                    return (<div key={folderPath} style={{ display: 'flex' }}>
                        {
                            (path === folderPath)
                                ? <Typography color="textPrimary">{folderName} </Typography>
                                : <Link color="inherit" href="/" onClick={(e) => handleOpenFolder(e, folderPath)}>
                                    {folderName}
                                </Link>
                        }
                    </div>);
                });
            }
        },
        [path, handleOpenFolder],
    );

    useEffect(() => {
        if (designsRef.current) {
            setHeight(designsRef.current.offsetHeight);
            setWidth(designsRef.current.offsetWidth);
        }
    }, [designsRef]);

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
                        <ListItem button selected>
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
                <Grid item xs={12} md={6} lg={8} ref={designsRef} className={classes.workspace}>
                    <Breadcrumbs className={classes.breadCrumbs}>
                        {
                            path.length !== 1
                                ? <Link color="inherit" href="/" onClick={(e) => handleOpenFolder(e, '')}>
                                    <Typography > Mis Diseños </Typography>
                                </Link>
                                : <Typography color="textPrimary"> Mis Diseños </Typography>
                        }
                        {
                            createBreadcrumbsLinks()
                        }
                    </Breadcrumbs>
                    {
                        path === '/' && <RecentDesigns id='recent' width={width} height={height} />
                    }
                    <div className={ classes.designsAndFoldersContainer }>
                        <div style={{display:'flex', justifyContent: 'space-between', alignItems:'flex-end', paddingBottom: 5}}>
                            <Typography variant='h4'>
                                {path === '/' ? 'Mis Diseños' : folderName}
                            </Typography>
                            <Button variant='outlined' style={{height: 35}} size='large' color='default' onClick={(e)=>handleCreateDesign(e, path)}> 
                                Crear Diseño
                            </Button>
                        </div>
                        <Divider />
                        <FoldersContainer {...foldersQuery}/>
                        <DesignsContainer {...designsQuery} />
                    </div>
                </Grid>
                <Grid item xs={12} md={3} lg={2} className={classes.rightPanel}></Grid>
            </Grid>
        </>
    );
};