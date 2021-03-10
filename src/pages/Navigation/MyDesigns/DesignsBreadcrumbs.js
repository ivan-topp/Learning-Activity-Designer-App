import { Breadcrumbs, Link, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useUiState } from 'contexts/ui/UiContext';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: 20,
        marginBottom: 20,
        width: '100%',
        padding: '10px 15px 10px 15px',
        borderRadius: 3,
        backgroundColor: theme.palette.background.default
    },
}));

export const DesignsBreadcrumbs = () => {
    const classes = useStyles();
    const history = useHistory();
    const { uiState } = useUiState();
    const path = uiState.folderPath;

    const createBreadcrumbsLinks = () => {
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
                            : <Link color="inherit" href="/" onClick={(e) => {
                                handleOpenFolder(e, folderPath);
                            }}>
                                {folderName}
                            </Link>
                    }
                </div>);
            });
        }
    };

    const handleOpenFolder = (e, path) => {
        e.preventDefault();
        history.push('/my-designs' + path);
    };

    return (
        <Breadcrumbs className={classes.root}>
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
    )
}
