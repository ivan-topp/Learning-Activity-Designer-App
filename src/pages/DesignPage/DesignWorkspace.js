import { Button, ButtonGroup, Divider, Grid, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { DesignGraphic } from './DesignGraphic';

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
    designUnit:{
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
}));

export const DesignWorkspace = ({ design }) => {
    const classes = useStyles();
    return (
        <>  {console.log(design)}
            <Grid container>
                <Grid item xs={12} md={3} lg={2} className={classes.leftPanel}>
                    <Grid container alignItems='center' justify='center'>
                        <Typography className={classes.textLefPanel}> INFORMACIÓN DISEÑO </Typography>
                    </Grid>
                    <Divider className={classes.spaceData}/>
                    <Grid className={classes.LeftPanelMetadata}>
                        <Typography color='textSecondary'>
                            Nombre
                        </Typography>
                        <Typography>
                            {design.metadata.name}
                        </Typography>
                        <Divider/>
                        <Typography color='textSecondary' className={classes.textLefPanelMetadata}>
                            Tema
                        </Typography>
                        <Typography>
                            No definido.
                        </Typography>
                        <Divider/>
                        <Typography color='textSecondary' className={classes.textLefPanelMetadata}>
                            Tiempo de trabajo
                        </Typography>
                        <Typography>
                            No definido.
                        </Typography>
                        <Divider/>
                        <Typography color='textSecondary' className={classes.textLefPanelMetadata}>
                            Tiempo de trabajo Diseño
                        </Typography>
                        <Typography>
                            No definido.
                        </Typography>
                        <Divider/>
                        <Typography color='textSecondary' className={classes.textLefPanelMetadata}>
                            Modo de entrega
                        </Typography>
                        <Typography>
                            No definido.
                        </Typography>
                        <Divider/>
                        <Typography color='textSecondary' className={classes.textLefPanelMetadata}>
                            Tamaño de la clase
                        </Typography>
                        <Typography>
                            No definido.
                        </Typography>
                        <Divider/>
                        <Typography color='textSecondary' className={classes.textLefPanelMetadata}>
                            Conocimiento Previo
                        </Typography>
                        <Typography>
                            No definido.
                        </Typography>
                        <Divider/>
                        <Typography color='textSecondary' className={classes.textLefPanelMetadata}>
                            Descripción
                        </Typography>
                        <Typography>
                            No definido.
                        </Typography>
                        <Divider/>
                        <Typography color='textSecondary' className={classes.textLefPanelMetadata}>
                            Objetivos
                        </Typography>
                        <Typography>
                            No definido.
                        </Typography>
                        <Divider/>
                        <Typography color='textSecondary' className={classes.textLefPanelMetadata}>
                            Resultados
                        </Typography>
                        <Typography>
                            No definido.
                        </Typography>
                        <Divider/>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6} lg={8} className={classes.workspace}>
                    <ButtonGroup size="small" aria-label="outlined primary button group" className={classes.buttonGroupWorkSpace}>
                        <Button>Nuevo</Button>
                        <Button>Compartir</Button>
                        <Button>Guardar</Button>
                    </ButtonGroup>
                    <Grid>
                        <Button variant = "outlined">Agregar Unidad de Aprendizaje</Button>
                        <Grid className={classes.designUnit}>
                            <Typography> Unidad </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={3} lg={2} className={classes.rightPanel}>
                    <DesignGraphic/>
                </Grid>
            </Grid>   
        </>
    )
}
