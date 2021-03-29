import React from 'react';
import { Divider, Grid, makeStyles, Typography } from '@material-ui/core';
import { LeftPanel } from 'pages/Navigation/LeftPanel';
import { useInfiniteQuery } from 'react-query';
import { getDesignsSharedWithMe } from 'services/DesignService';
import { DesignsContainer } from 'components/DesignsContainer';

const useStyles = makeStyles((theme) => ({
    leftPanel: {
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    workspace: {
        paddingTop: 20,
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

export const SharedWithMePage = () => {
    const classes = useStyles();

    const sharedDesignsQuery = useInfiniteQuery(['shared-designs'], async ({ pageParam = 0 }) => {
        return await getDesignsSharedWithMe(pageParam);
    }, {
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage, pages) => {
            if(lastPage.nPages === pages.length) return undefined; 
            return lastPage.from;
        },
    });

    return (
        <>
            <Grid container>
                <Grid item xs={12} md={3} lg={2} className={classes.leftPanel}>
                    <LeftPanel />
                </Grid>
                    <Grid item xs={12} md={6} lg={8} className={classes.workspace}>
                        <Typography variant='h4' style={{marginBottom: 5}}>Compartidos conmigo</Typography>
                        <Divider />
                        <DesignsContainer {...sharedDesignsQuery} label='shared-with-me'/>
                    </Grid>
                    <Grid item xs={12} md={3} lg={2} className={classes.rightPanel}></Grid>
                </Grid>
        </>
    );
};