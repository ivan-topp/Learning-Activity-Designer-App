import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, makeStyles, Tabs, Tab, Typography } from '@material-ui/core';
import { useSocketState } from 'contexts/SocketContext';
import { useAuthState } from 'contexts/AuthContext';
import { TabPanel } from 'components/TabPanel';
import { useDesignState } from 'contexts/design/DesignContext';
import types from 'types';
import { Alert } from '@material-ui/lab';
import { useSharedDocContext } from 'contexts/SharedDocContext';
import { DesignReader } from './DesignReader/DesignReader';

const useStyles = makeStyles((theme) => ({
    menu: {
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
        minHeight: 'calc(100vh - 128px)',
    },
}));

const a11yProps = (index) => {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

export const DesignPageReader = () => {
    const classes = useStyles();
    const isMounted = useRef(true);
    const metadataRef = useRef();
    const { id } = useParams();
    const { doc, provider, connectToDesign, clearDoc } = useSharedDocContext();
    const { authState } = useAuthState();
    const { socket, online } = useSocketState();
    const [ tabIndex, setTabIndex ] = useState(0);
    const { designState, dispatch } = useDesignState();
    const { design } = designState;
    const [error, setError] = useState(null);
    
    useEffect(()=>{
        let metadataComponent = metadataRef.current;
        return () => {
            metadataComponent?.clearEditors();
            clearDoc();
            isMounted.current = false;
        };
    }, [clearDoc]);
    
    useEffect(() => {
        if(online){
            socket?.emit('join-to-design', { user: authState.user, designId: id, public: true }, (res) => {
                if (res.ok){
                    if(isMounted.current) {
                        dispatch({
                            type: types.design.updateDesign,
                            payload: res.data.design
                        });
                        connectToDesign(id);
                    }
                } 
                else setError(res.message);
            });
        }
    }, [socket, authState.user, online, id, dispatch, connectToDesign]);

    useEffect(() => {
        return () => {
            socket?.emit('leave-from-design', { user: authState.user, designId: id });
        }
    }, [socket, authState.user, id])

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };
    
    if(error){
        return (
            <div className={classes.error}>
                <Alert severity='error'>
                    { error }
                </Alert>
            </div>
        );
    }

    if (!design || !doc || !provider) {
        
        return (<Typography>Cargando...</Typography>);
    }

    return (
        <>
            <Grid container className={classes.menu} key={design._id}>
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
                <DesignReader />
            </TabPanel>
        </>
    )
}