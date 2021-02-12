import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { Breadcrumbs, Divider, Grid, Link, List, ListItem, ListItemText, makeStyles, Typography } from '@material-ui/core';
import { RecentDesigns } from './RecentDesigns';
import { DesignsContainer } from '../../components/DesignsContainer';
import { useQuery } from 'react-query';
import { Group, Home, Public } from '@material-ui/icons';
import { getDesignsByFolder } from '../../services/DesignService';

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
        minHeight: 'calc(100vh - 64px)'
    },
    rightPanel: {
        display: 'flex',
        flexDirection: 'column',
        borderLeft: `1px solid ${theme.palette.divider}`,
    },
    icon:{
        marginRight: 10,
    },
    breadCrumbs: {
        marginTop: 20,
        width: '100%',
        padding: '10px 15px 10px 15px',
        borderRadius: 3,
        backgroundColor: theme.palette.background.default
    }
}));

export const MyDesignsPage = () => {

    const classes = useStyles();
    const history = useHistory();
    const urlparams = useParams();
    const designsRef = useRef(null);
    const [ width, setWidth ] = useState(0);
    const [ height, setHeight ] = useState(0);
    const path = urlparams.urlPath ? '/' + urlparams.urlPath : '/';
    const folderName = !urlparams.urlPath ? 'Mis Diseños' : path.split('/')[ path.split('/').length - 1 ];

    const designsQuery = useQuery(["designs", path], async () => {
        return getDesignsByFolder(path);
    });

    const redirectTo = useCallback(
        (path) => {
            history.push(path);
        },
        [history],
    );

    const handleOpenFolder = useCallback(
        ( e, path ) => {
            e.preventDefault();
            redirectTo('/my-designs' + path);
        },
        [redirectTo],
    );

    const handleLoadMore = ( e ) => {
        console.log('Load More Designs');
    };

    const createBreadcrumbsLinks = useCallback(
        () => {
            if (path.length !== 1) {
                let newPath = '';
                const folderList = path.split('/');
                folderList.shift();
                return folderList.map((folderName) => {
                    newPath += '/' + folderName;
                    const folderPath = newPath;
                    return (<div key={ folderPath } style={{ display: 'flex' }}>
                        {
                            (path === folderPath)
                                ? <Typography color="textPrimary">{ folderName } </Typography>
                                : <Link color="inherit" href="/" onClick={(e) => handleOpenFolder(e, folderPath)}>
                                    { folderName }
                                </Link>
                        }
                    </div>);
                });
            }
        },
        [ path, handleOpenFolder ],
    );

    useEffect(() => {
        if (designsRef.current) {
            setHeight(designsRef.current.offsetHeight);
            setWidth(designsRef.current.offsetWidth);
        }
    }, [designsRef]);

    return (
        <>
            <Grid container>
                <Grid item xs={12} md={3} lg={2} className={classes.leftPanel}>
                    <List component="nav" aria-label="main mailbox folders">
                        <ListItem button selected>
                            <Home className={classes.icon}/>
                            <ListItemText primary="Mis Diseños" />
                        </ListItem>
                        <Divider />
                        <ListItem button onClick={() => redirectTo('/shared-with-me')}>
                            <Group className={classes.icon}/>
                            <ListItemText primary="Compartidos Conmigo" />
                        </ListItem>
                        <Divider />
                        <ListItem button onClick={() => redirectTo('/public-repository')}>
                            <Public className={classes.icon}/>
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
                        <DesignsContainer title={ path === '/' ? 'Mis Diseños' : folderName } {...designsQuery} onLoadMore={ handleLoadMore } />
                    </Grid>
                    <Grid item xs={12} md={3} lg={2} className={classes.rightPanel}></Grid>
                </Grid>
        </>
    );
};