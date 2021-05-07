import React, { useState } from 'react';
import { Backdrop, Box, Grid, makeStyles, Tab, Tabs, Typography } from '@material-ui/core';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import { getDesignByLink } from 'services/DesignService';
import { DesignReader } from 'pages/DesignPageReader/DesignReader/DesignReader';
import { useDesignState } from 'contexts/design/DesignContext';
import { TabPanel } from 'components/TabPanel';
import types from 'types';
import { Alert } from '@material-ui/lab';
import { Description } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: 'calc(100vh - 128px)',
    },
    content: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    tabBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    error: {
        display: 'flex',
        justifyContent: 'center',
        padding: 20,
        alignItems: 'start',
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    loadingFile: {
        '-webkit-backface-visibility': 'hidden',
        animation: `$spinAndScale 3000ms ${theme.transitions.easing.easeInOut}`,
        animationIterationCount: 'infinite',
        animationDirection: 'alternate',
    },
    "@keyframes spinAndScale": {
        from: {
            height: 300,
            width: 300,
            transform: 'rotate(0deg)',
        },
        to: {
            height: 150,
            width: 150,
            transform: 'rotate(360deg)',
        }
    },
}));

const a11yProps = (index) => {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

export const SharedLinkPage = () => {
    const classes = useStyles();
    const urlparams = useParams();
    const [tabIndex, setTabIndex] = useState(0);
    const { dispatch } = useDesignState();

    const { isLoading, isError, error, data } = useQuery(['shared-design-by-link', urlparams.link], async () => {
        const resp = await getDesignByLink({ link: urlparams.link });
        dispatch({
            type: types.design.updateDesign,
            payload: resp.design,
        });
        return resp;
    }, { refetchOnWindowFocus: false });

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const renderError = () => {
        return <div className={classes.error}>
            <Alert severity='error'>
                {error.message}
            </Alert>
        </div>;
    };

    const renderContent = () => {
        return <><Grid container className={classes.content} key={data.design._id}>
        <Grid item xs={12} md={3} lg={2} />
        <Grid item xs={12} md={6} lg={8} className={classes.tabBar}>
            <Tabs
                value={tabIndex}
                onChange={handleChange}
                aria-label="full width tabs example"
            >
                <Tab label="DISEÑO" {...a11yProps(1)} />
            </Tabs>
        </Grid>
        <Grid item xs={12} md={3} lg={2}></Grid>
    </Grid>
        <TabPanel value={tabIndex} index={0} >
            <DesignReader type='shared-link'/>
        </TabPanel></>;
    };
    
    const renderLoading = () => {
        return (
            <Backdrop className={classes.backdrop} open={true}>
                <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box width={300} height={300} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Description className={classes.loadingFile} />
                    </Box>
                    
                    <Typography>Cargando Diseño de Aprendizaje...</Typography>
                </Box>
            </Backdrop>
        );
    };

    const renderNotFoundMessage = () => {
        return <div className={classes.error}>
            <Alert severity='error'>
                No se ha encontrado diseño.
            </Alert>
        </div>;
    };

    return (
        <div className={classes.root}>
            {
                isLoading
                    ? renderLoading()
                    : isError
                        ? renderError()
                            : data.design === {}
                                ? renderNotFoundMessage()
                                : renderContent()
            }
        </div>
    )
}
