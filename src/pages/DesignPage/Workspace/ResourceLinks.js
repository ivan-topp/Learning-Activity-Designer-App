import { Box, Grid, IconButton, makeStyles, Paper, TextField, Tooltip, Typography, useMediaQuery, useTheme } from '@material-ui/core'
import { Delete } from '@material-ui/icons';
import { SharedTextFieldTipTapEditor } from 'components/SharedTextFieldTipTapEditor';
import { useDesignState } from 'contexts/design/DesignContext';
import { useSocketState } from 'contexts/SocketContext';
import { useUiState } from 'contexts/ui/UiContext';
import { useForm } from 'hooks/useForm';
import { useSnackbar } from 'notistack';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import types from 'types';

const useStyles = makeStyles((theme) => ({
    spaceResource:{
        marginBottom: theme.spacing(3),
        marginLeft: theme.spacing(2)
    },
    spacePaper:{
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        marginRight: theme.spacing(2)
    },
    spaceInResource:{
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },buttonPos: {
        marginLeft: "auto",
    }, grid:{
        [theme.breakpoints.down('md')]: {
            gridTemplateAreas: `
                'title title'
                'link link'`,
        },
    },
    tooltip: {
        maxHeight: "20px",
        minHeight: "20px",
        minWidth: "20px",
        maxWidth: "20px",
    },
    icon:{
        maxHeight: "20px",
        minHeight: "20px",
        minWidth: "20px",
        maxWidth: "20px",
    },
    delete: {
        display: 'flex',
        alignItems: 'end',
    },
}));

export const ResourceLinks = forwardRef(({index, resourceLink, taskIndex, learningActivityIndex, ...rest }, ref) => {
    const classes = useStyles()
    const isMounted = useRef(true);
    const titleRef = useRef();
    const linkRef = useRef();
    const { socket } = useSocketState();
    const { designState } = useDesignState();
    const { design } = designState;
    const { enqueueSnackbar } = useSnackbar();
    const { dispatch } = useUiState();
    const theme = useTheme();
    const isMediumDevice = useMediaQuery(theme.breakpoints.down('md'));
    
    const [form, handleInputChange, , setValues] = useForm({
        title: resourceLink.title,
        link: resourceLink.link
    });

    useImperativeHandle(
        ref,
        () => ({
            clearTexts: () => {
                titleRef?.current.clearText();
                linkRef?.current.clearText();
            }
        }),
    );

    useEffect(()=>{
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if(isMounted.current){
            if(form.title !== resourceLink.title){
                setValues((prevState) => ({
                    ...prevState,
                    title: resourceLink.title,
                }));
            }
        }
    }, [form.title, resourceLink.title, setValues]);

    useEffect(() => {
        if(isMounted.current){
            if(form.link !== resourceLink.link){
                setValues((prevState) => ({
                    ...prevState,
                    link: resourceLink.link,
                }));
            }
        }
    }, [form.link, resourceLink.link, setValues]);

    const { title, link,  } = form;

    const handleEditTaskField = ({ target }) => {
        let { name: field, value } = target;
        let subfield = null;
        if(field.includes('title')) field = 'title';
        else if (field.includes('link')) field = 'link';
        handleInputChange({ target });
        socket.emit('edit-resource-link-field', { designId: design._id, learningActivityIndex, taskIndex, index, field, value, subfield });
    };

    const handleDeleteResourceLink = (index) => {
        if (title === "" && link === "" ){
            socket.emit('delete-resource-link', { designId: design._id, learningActivityIndex, taskIndex, index });
            enqueueSnackbar('Su recurso se ha eliminado',  {variant: 'success', autoHideDuration: 2000});
        } else {
            dispatch({
                type: types.ui.setConfirmData,
                payload: {
                    type: 'recurso',
                    args: { designId: design._id, learningActivityIndex, taskIndex, index },
                    actionMutation: null,
                }
            })
            dispatch({
                type: types.ui.toggleModal,
                payload: 'Confirmation',
            });
        }
    };

    const listResourceArray = () => {
        return (
            <Grid key={index} >
                <Paper square className = {classes.spacePaper}>
                    <Grid container className={classes.spaceResource}>
                        <Grid item sm={11} className={classes.spaceInResource}>
                            <Grid container>
                                <Grid item xs = {11}>
                                    <Typography variant="body2" color="textSecondary">Recurso número {index + 1}</Typography>
                                </Grid>
                                <Grid item xs = {1} >
                                    <Box display="flex" flexDirection="row-reverse">
                                        <Box>
                                            <Tooltip title="Eliminar recurso" className= {classes.tooltip}>
                                                <IconButton onClick={() => handleDeleteResourceLink(index)}>
                                                    <Delete className={classes.icon} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                            <div className={classes.grid}>
                                <TextField
                                    style={{ gridArea: 'title', marginTop: 10, }}
                                    label='Título'
                                    fullWidth
                                    margin='none'
                                    variant='outlined'
                                    color='primary'
                                    InputProps={{
                                        inputComponent: SharedTextFieldTipTapEditor,
                                        inputProps: {
                                            ref: titleRef,
                                            name: `title-resourceLink-${index}-task-${taskIndex}-learningactivity-${learningActivityIndex}`, // TODO: Cambiar y utilizar id generada en mongo como nombre de dato compartido.
                                            placeholder: 'Título',
                                            initialvalue: title,
                                            onChange: handleEditTaskField,
                                            multiline: false,
                                        }
                                    }}
                                />
                                <TextField
                                    style={{ gridArea: 'link', marginTop: 10 }}
                                    label='Enlace'
                                    fullWidth
                                    margin='none'
                                    variant='outlined'
                                    color='primary'
                                    InputProps={{
                                        inputComponent: SharedTextFieldTipTapEditor,
                                        inputProps: {
                                            ref: linkRef,
                                            name: `link-resourceLink-${index}-task-${taskIndex}-learningactivity-${learningActivityIndex}`, // TODO: Cambiar y utilizar id generada en mongo como nombre de dato compartido.
                                            placeholder: 'Enlace',
                                            initialvalue: link,
                                            onChange: handleEditTaskField,
                                            multiline: false,
                                        }
                                    }}
                                />
                            </div>
                        </Grid>
                    </Grid>
                </Paper> 
            </Grid>
        )
    }

    return (
        <>  
            {
                listResourceArray()
            }
        </>
    )
})
