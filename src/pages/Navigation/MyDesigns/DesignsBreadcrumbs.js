import { Breadcrumbs, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
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
    link:{
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline'
        }
    }
}));

export const DesignsBreadcrumbs = () => {
    const classes = useStyles();
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
                            : <Typography className={classes.link} color="inherit" component={Link} to={`/my-designs${folderPath}`} >{folderName} </Typography>
                    }
                </div>);
            });
        }
    };

    return (
        <Breadcrumbs className={classes.root}>
            {
                path.length !== 1
                    ? <Typography className={classes.link} color="inherit" component={Link} to="/my-designs"> Mis Diseños </Typography>
                    : <Typography color="textPrimary"> Mis Diseños </Typography>
            }
            {
                createBreadcrumbsLinks()
            }
        </Breadcrumbs>
    )
}
