import { Button, ButtonGroup, Divider, Grid, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { DesignGraphic } from './DesignGraphic';
import { DesignUnit } from './DesignUnit';

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
        minHeight: 'calc(100vh - 64px)'
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
}));

export const DesignWorkspace = ({ design }) => {
    const classes = useStyles();
    const { metadata } = design;

    
    const handleSaveDesign = () => {
        console.log('Guardar diseño');
    };
    const handleNewUA = () => {
        console.log('Agregar nueva unidad de aprendizaje')
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
                            { metadata && metadata.objetive &&(
                                    <>
                                        <Typography color='textSecondary' className={classes.textLefPanelMetadata}> Objetivos </Typography>
                                        <Typography> { metadata.objetive } </Typography>
                                        <Divider/>
                                    </>
                                )
                            }
                        </Grid>
                        <Grid>
                            { metadata && metadata.results &&(
                                    <>
                                        <Typography color='textSecondary' className={classes.textLefPanelMetadata}> Resultados </Typography>
                                        <Typography>{ metadata.results }</Typography>
                                        <Divider/>
                                    </>
                                )
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
                    <Grid>
                        <Button size="small" variant = "outlined" onClick={handleNewUA}>Agregar Unidad de Aprendizaje</Button>
                        <DesignUnit design = { design } />
                    </Grid>
                </Grid>
                <Grid item xs={3} md={3} lg={2} className={classes.rightPanel}>
                    <Grid>
                        <DesignGraphic  design = { design }/>
                    </Grid>
                </Grid>
            </Grid>   
        </>
    )
}
