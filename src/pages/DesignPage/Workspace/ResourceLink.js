import { Box, Divider, Grid, IconButton, makeStyles, TextField, Tooltip } from '@material-ui/core'
import React, { useEffect, useRef } from 'react'
import { Delete } from '@material-ui/icons';
import { useUiState } from 'contexts/ui/UiContext';
import types from 'types';

const useStyles = makeStyles((theme) => ({
    spaceResource:{
        marginTop: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    tooltip: {
        maxHeight: "25px",
        minHeight: "25px",
        minWidth: "25px",
        maxWidth: "25px",
    },
    icon:{
        maxHeight: "25px",
        minHeight: "25px",
        minWidth: "25px",
        maxWidth: "25px",
    },
    resourceLinkGrid:{
        display: 'grid',
        gridTemplateColumns: '95% 5%',
    },
}));

export const ResourceLink = ({index, resource, newResource, setNewResource}) => {
    const classes = useStyles();
    
    const { uiState, dispatch } = useUiState();
    
    const isMounted = useRef(true);
    useEffect(() => {
        return () => {
            isMounted.current = false;
        }
    }, []);

    const changeTitle = (event) => {
        const newTitle = event.target.value;
        if (isMounted.current) setNewResource( newResource => newResource.map((resource, i) => {
            if ( i === index ) {
                resource.title = newTitle;
            }
            return resource;
        }));
        if(uiState.userSaveDesign){
            dispatch({
                type: types.ui.setUserSaveDesign,
                payload: false,
            })
        };
    };

    const changeLink = (event) => {
        const newLink = event.target.value;
        if (isMounted.current) setNewResource( newResource => newResource.map((resource, i) => {
            if ( i === index ) {
                resource.link = newLink;
            }
            return resource;
        }));
        if(uiState.userSaveDesign){
            dispatch({
                type: types.ui.setUserSaveDesign,
                payload: false,
            })
        };
    };
    
    const handleDeleteResourceLink = (index) =>{
        if (index === newResource.length - 1) {
            if (isMounted.current) setNewResource([
                ...newResource.slice(0, index),
            ])
        } else {
            if (isMounted.current) setNewResource([
                ...newResource.slice(0, index),
                ...newResource.slice(index + 1, newResource.length)
            ])
        };
        if(uiState.userSaveDesign){
            dispatch({
                type: types.ui.setUserSaveDesign,
                payload: false,
            })
        };
    };

    const resourceLink = () =>{
        return (
            <div key={index} className={classes.spaceResource}>
                <Grid >
                    <div className={classes.resourceLinkGrid}>
                        <div >
                            <TextField
                                variant='outlined'
                                margin='dense' 
                                name='title' 
                                value={ resource.title } 
                                onChange={ (e) => changeTitle(e) } 
                                label='Título' 
                                type='text' 
                                fullWidth 
                            />
                            <TextField
                                variant='outlined'
                                margin='dense' 
                                name='link' 
                                value={ resource.link } 
                                onChange={ (e)=>changeLink(e)} 
                                label='Enlace' 
                                type='text' 
                                fullWidth 
                            />
                        </div>
                        <div>
                        <Box display="flex" flexDirection="row-reverse">
                                    <Box>
                                        <Tooltip title="Eliminar recurso" className= {classes.tooltip}>
                                            <IconButton onClick={() => handleDeleteResourceLink(index)}>
                                                <Delete className={classes.icon} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>
                        </div>
                    </div>
                <Divider style={{marginTop: 10}}/>
                </Grid>
            </div>
        )
    }
    return (
        <>
            {
                resourceLink()
            }
        </>
    )
}
