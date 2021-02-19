import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, makeStyles, Avatar, Tabs, Tab } from '@material-ui/core';
import { useSocketState } from '../../contexts/SocketContext';
import { useAuthState } from '../../contexts/AuthContext';
import { formatName, getUserInitials } from '../../utils/textFormatters';
import { DesignWorkspace } from './DesignWorkspace';
import { DesignMetadata } from './DesignMetadata';
import { TabPanel } from '../../components/TabPanel'
import PropTypes from 'prop-types';

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
    menu:{
        marginTop: theme.spacing(1),
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    menuLetters:{
        marginLeft: theme.spacing(2),
        marginBottom: theme.spacing(1),
    },
    menuLettersSelected:{
        marginLeft: theme.spacing(2),
        borderBottom: `2px solid ${theme.palette.divider}`
    }, 
}));

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

const a11yProps = (index) =>{
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
}

export const DesignPage = () => {
    const classes = useStyles();
    const { id } = useParams();
    const { authState } = useAuthState();
    const { socket/*, online*/ } = useSocketState();
    const [ users, setUsersList] = useState([]);
    const [value, setValue] = useState(0);

    useEffect(() => {
        socket.emit('join-to-design', { user: authState.user, designId: id });
        socket.on('joined', ( users ) => setUsersList(users));
        return () => {
            socket.emit('leave-from-design', { user: authState.user, designId: id });
            socket.off('joined');
        };
    }, [socket, authState.user, id]);
    
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    
    return (
        <>  
            <Grid container className={classes.menu}>
                <Grid item xs={12} md={2} />
                <Grid item xs={12} md={8} >
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="full width tabs example"
                        >
                        <Tab label="METADATA" {...a11yProps(0)} />
                        <Tab label="DISEÑO" {...a11yProps(1)} />
                    </Tabs>
                </Grid>
                <Grid item xs={12} md ={2}>
                {
                    users.map((user, index) => 
                        <Avatar
                            key={user.uid + index}
                            alt={formatName(user.name, user.lastname)}
                            src={user.img ?? ''}
                        >
                            {getUserInitials(user.name, user.lastname)}
                        </Avatar>
                    )
                }
                </Grid>
            </Grid>
                <TabPanel value={value} index={0}>
                    <DesignMetadata/>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <DesignWorkspace/>
                </TabPanel>
        </>
    )
}