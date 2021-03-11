import React from 'react';
import { Box, makeStyles, Typography } from '@material-ui/core';
import { Folder } from '@material-ui/icons';
import { Link } from 'react-router-dom';


const useStyles = makeStyles((theme) =>({
    root: {
        border: `1px solid ${ theme.palette.divider }`,
        width: 325,
        minWidth: 325,
        borderRadius: 5,
        margin: '10px 10px 10px 0px',
        cursor: 'pointer',
        userSelect: 'none',
        backgroundColor: theme.palette.background.paper,
        textDecoration: 'none',
        color: theme.palette.text.primary,
        '&:hover': {
            boxShadow: '0px 0px 10px 0 #bcc3d6',
            background: theme.palette.background.designHover,
        },
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
    }
}));

export const DesignsFolder = ({ name, path, ...rest }) => {
    const classes = useStyles();

    return (
        <Box className={ classes.root } component={Link}  to={`/my-designs${path}`} { ...rest }>
            <div className={ classes.folderBody }>
                <Folder fontSize='large'/>
                <Typography className={ classes.folderName }>
                    { name }
                </Typography>
            </div>
        </Box>
    );
};
