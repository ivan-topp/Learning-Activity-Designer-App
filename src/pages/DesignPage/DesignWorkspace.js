import { Button, ButtonGroup, Divider, Grid, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { DesignGraphic } from './DesignGraphic';
import { DesignUnit } from './DesignUnit';
import { useSocketState } from '../../contexts/SocketContext';

const useStyles = makeStyles((theme) => ({
    leftPanel: {
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    workspace: {
        paddingLeft: 15,
        paddingRight: 15,
        background: theme.palette.background.workSpace,
        height: 'calc(100vh - 177px)',
        overflow: 'auto'
    },
    rightPanel: {
        display: 'flex',
        flexDirection: 'column',
        borderLeft: `1px solid ${theme.palette.divider}`,
    },
    buttonGroupWorkSpace:{
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    textLefPanel:{
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    spaceData:{
        marginBottom: theme.spacing(1),
        borderBottom: `2px solid ${theme.palette.divider}`
    },
    LeftPanelMetadata:{
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2)
    },
    textLefPanelMetadata:{
        marginTop: theme.spacing(3)
    },
    workSpaceUnits:{
    },
    '@global': {
    //Ancho del scrollbar    
    '*::-webkit-scrollbar': {
        width: '0.4em'
    },
    //Sombra del scrollbar
    '*::-webkit-scrollbar-track': {
        '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.2)'
         
    },
    //Scrollbar
    '*::-webkit-scrollbar-thumb': {
        '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.2)',
        borderRadius: '15px',
        backgroundColor: 'rgba(0,0,0,.1)',
    }
    },
      
}));

export const DesignWorkspace = ({ design }) => {
    const classes = useStyles();
    const { metadata } = design;
    const { socket } = useSocketState();

    const handleSaveDesign = (e) => {
        socket.emit('save-design', { designId: design._id });
    };

    const handleNewUA = () => {
        socket.emit('new-tla', { designId: design._id});    
    };
    
    return (
        <>  
            <Grid container>
                <Grid item xs={12} md={3} lg={2} className={classes.leftPanel}>
                    <Grid container alignItems='center' justify='center'>
                        <Typography className={classes.textLefPanel}> INFORMACIÓN DISEÑO </Typography>
                    </Grid>
                    <Divider className={classes.spaceData}/>
                    <Grid className={classes.LeftPanelMetadata}>
                        <Grid>
                            { metadata && metadata.name &&(
                                    <>
                                        <Typography variant="body2" color='textSecondary'> Nombre </Typography>
                                        <Typography variant="body2">{ metadata.name }</Typography>
                                        <Divider/>
                                    </>
                                )
                            }
                        </Grid>
                        <Grid>
                            { metadata && metadata.category &&(
                                <>
                                        <Typography variant="body2" color='textSecondary' className={classes.textLefPanelMetadata}>Tema</Typography>
                                        <Typography variant="body2"> { metadata.category.name } </Typography>
                                        <Divider/>
                                    </>
                                )
                            }
                        </Grid>
                        <Grid>
                            { metadata && metadata.workingTime &&(
                                    <>
                                        <Typography variant="body2" color='textSecondary' className={classes.textLefPanelMetadata}> Tiempo de trabajo </Typography>
                                        <Typography variant="body2"> { metadata.workingTime } </Typography>
                                        <Divider/>
                                    </>
                                )
                            }
                        </Grid>
                        <Grid>
                            { metadata && metadata.workingTimeDesign &&(
                                    <>
                                        <Typography variant="body2" color='textSecondary' className={classes.textLefPanelMetadata}>Tiempo de trabajo Diseño</Typography>
                                        <Typography variant="body2"> { metadata.workingTimeDesign } </Typography>
                                        <Divider/>
                                    </>
                                )
                            }
                        </Grid>
                        <Grid>
                            { metadata && metadata.name &&(
                                    <>
                                        <Typography variant="body2" color='textSecondary' className={classes.textLefPanelMetadata}> Modo de entrega </Typography>
                                        <Typography variant="body2" > { metadata.name } </Typography>
                                        <Divider/>
                                    </>
                                )
                            }
                        </Grid>
                            { metadata && metadata.classSize &&(
                                    <>
                                        <Typography variant="body2" color='textSecondary' className={classes.textLefPanelMetadata}> Tamaño de la clase </Typography>
                                        <Typography variant="body2"> { metadata.classSize } </Typography>
                                        <Divider/>
                                    </>
                                )
                            }
                        <Grid>
                            { metadata && metadata.priorKnowledge &&(
                                    <>
                                        <Typography variant="body2" color='textSecondary' className={classes.textLefPanelMetadata}> Conocimiento Previo </Typography>
                                        <Typography variant="body2" > { metadata.priorKnowledge } </Typography>
                                        <Divider/>
                                    </>
                                )
                            }
                        </Grid>
                        <Grid>
                            { metadata && metadata.description &&(
                                    <>
                                        <Typography variant="body2" color='textSecondary' className={classes.textLefPanelMetadata}> Descripción </Typography>
                                        <Typography variant="body2"> { metadata.description } </Typography>
                                        <Divider/>
                                    </>
                                )
                            }
                        </Grid>
                        <Grid>
                            { metadata && metadata.objective &&(
                                    <>
                                        <Typography color='textSecondary' className={classes.textLefPanelMetadata}> Objetivos </Typography>
                                        <Typography> { metadata.objective } </Typography>
                                        <Divider/>
                                    </>
                                )
                            }
                        </Grid>
                        <Grid>
                            { /*metadata && metadata.results &&(
                                    <>
                                        <Typography color='textSecondary' className={classes.textLefPanelMetadata}> Resultados </Typography>
                                        <Typography>{ metadata.results }</Typography>
                                        <Divider/>
                                    </>
                                )*/
                            }
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6} lg={8} className={classes.workspace}>
                    <ButtonGroup size="small" aria-label="outlined primary button group" className={classes.buttonGroupWorkSpace}>
                        <Button>Nuevo</Button>
                        <Button>Compartir</Button>
                        <Button onClick = {handleSaveDesign}>Guardar</Button>
                    </ButtonGroup>
                    <Grid className={classes.workSpaceUnits}>
                        <Button size="small" variant = "outlined" onClick={handleNewUA}>Agregar Unidad de Aprendizaje</Button>
                        <Grid >
                            <DesignUnit design = { design } />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={3} md={3} lg={2} className={classes.rightPanel}>
                    <Grid >
                        <DesignGraphic design = { design }/>
                    </Grid>
                </Grid>
            </Grid>   
        </>
    )
}
