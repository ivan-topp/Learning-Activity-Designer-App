import React from 'react';
import { makeStyles } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme) =>({
    root: {
        border: `1px solid ${ theme.palette.divider }`,
        width: 325,
        minWidth: 325,
        borderRadius: 10,
        margin: '10px 10px 10px 0px',
        cursor: 'pointer',
        userSelect: 'none',
    },
    folderBody: {
        //backgroundColor: 'green',
        width: '100%',
        padding: '15px 10px 15px 20px',
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
    },
    folderName: {
        //backgroundColor: 'black',
        marginLeft: 20,
    }
}));

export const FolderSkeleton = () => {
    const classes = useStyles();
    return (
        <div className={ classes.root }>
            <div className={ classes.folderBody }>
                <Skeleton variant="circle" width={40} height={40} style={{marginBottom: 3}}/>
                <Skeleton className={ classes.folderName } animation="wave" height={20} width={'60%'}/>
            </div>
        </div>
    );
};
