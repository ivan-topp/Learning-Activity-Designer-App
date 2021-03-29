import React from 'react';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import { LeftPanel } from 'pages/Navigation/LeftPanel';

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
        minHeight: 'calc(100vh - 128px)',
    },
    rightPanel: {
        display: 'flex',
        flexDirection: 'column',
        borderLeft: `1px solid ${theme.palette.divider}`,
    },
    icon:{
        marginRight: 10,
    }
}));

export const PublicRepositoryPage = () => {
    const classes = useStyles();

    return (
        <>
            <Grid container>
                <Grid item xs={12} md={3} lg={2} className={classes.leftPanel}>
                    <LeftPanel />
                </Grid>
                    <Grid item xs={12} md={6} lg={8} className={classes.workspace}>
                        <Typography variant='h4'>Repositorio Público</Typography>
                    </Grid>
                    <Grid item xs={12} md={3} lg={2} className={classes.rightPanel}></Grid>
                </Grid>
        </>
    );
};