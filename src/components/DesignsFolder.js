import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { Folder } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';


const useStyles = makeStyles((theme) =>({
    root: {
        border: `1px solid ${ theme.palette.divider }`,
        width: 325,
        minWidth: 325,
        borderRadius: 5,
        margin: '10px 10px 10px 0px',
        cursor: 'pointer',
        userSelect: 'none',
        backgroundColor: 'rgba(0, 0, 0, 0)',//theme.palette.primary.sidePanels,
        '&:hover': {
            boxShadow: '0px 0px 10px 0 #bcc3d6',
            background: theme.palette.background.designHover,
        },
    },
    folderBody: {
        //backgroundColor: 'green',
        padding: '15px 10px 15px 20px',
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
    },
    folderName: {
        //backgroundColor: 'grey',
        paddingTop: 3,
        fontSize: 20,
        paddingLeft: 20,
    }
}));

export const DesignsFolder = ({ name, path, ...rest }) => {
    const classes = useStyles();
    const history = useHistory();

    const handleOpenFolder = ( e ) => {
        history.push('/my-designs' + path);
    };

    return (
        <div className={ classes.root } { ...rest } onClick={ handleOpenFolder }>
            <div className={ classes.folderBody }>
                <Folder fontSize='large'/>
                <Typography className={ classes.folderName }>
                    { name }
                </Typography>
            </div>
        </div>
    );
};
