import React from 'react';
import { makeStyles } from '@material-ui/core';
import { DesignsFolder } from './DesignsFolder';

const useStyles = makeStyles({
    root: {
        paddingTop: 15,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    designsContainer: {
        width: '100%',
        display: 'flex',
        flexGrow: 1,
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    }
});

export const FoldersContainer = ({ title, data }) => {
    const classes = useStyles();    

    const folderList = () => {
        return data.map((folder) => <DesignsFolder key={'my-folder' + folder._id} {...folder} />);
    };

    return data && data.length > 0 
        ?(<div className={classes.root}>
            <div className={classes.designsContainer}>
                { folderList() }
            </div>
        </div>)
        : (<div></div>);
};