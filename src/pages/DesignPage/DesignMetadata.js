import { Grid, makeStyles } from '@material-ui/core'
import React from 'react'

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
    spaceData:{
        marginBottom: theme.spacing(2),
        borderBottom: `2px solid ${theme.palette.divider}`
    },  
}));

export const DesignMetadata = ({ design }) => {
    const classes = useStyles();

    return (
        <>
            <Grid container>
                <Grid item xs={12} md={3} lg={2} className={classes.leftPanel}></Grid>
                <Grid item xs={12} md={6} lg={8} className={classes.workspace}>
                    
                </Grid>
                <Grid item xs={12} md={3} lg={2} className={classes.rightPanel}></Grid>
            </Grid>   
        </>
    )
}
