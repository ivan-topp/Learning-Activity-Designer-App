import { Button, Divider, FormControlLabel, Grid, makeStyles, Switch, TextField, Typography } from '@material-ui/core'
import React from 'react'
//import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    leftPanel: {
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    workspace: {
        paddingTop: 15,
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
    spaceData: {
        marginBottom: theme.spacing(2),
        borderBottom: `2px solid ${theme.palette.divider}`
    },
    title: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metadata: {
        display: 'flex',
        flexDirection: 'column',
        //flexWrap: 'wrap',
        //justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 10,
    },
    metadataField: {
        marginRight: 10,
        display: 'flex',
        alignItems: 'center',
        width: '50%',
    }
}));

export const DesignMetadata = ({ design }) => {
    const classes = useStyles();
    //const { id } = useParams();
    if (!design) {
        return (<div></div>);
    }

    const { metadata } = design;
    const { name, category, workingTimeDesign, workingTime, priorKnowledge, description, objective } = metadata;

    return (
        <>
            <Grid container>
                <Grid item xs={12} md={3} lg={2} className={classes.leftPanel}></Grid>
                <Grid item xs={12} md={6} lg={8} className={classes.workspace}>
                    <div className={classes.title}>
                        <Typography variant='h4'>Información Diseño</Typography>
                        <Button variant='outlined' color='default'>Guardar Información</Button>
                    </div>
                    <Divider />
                    <div className={classes.metadata}>
                        <div>
                            <TextField
                                margin="dense"
                                variant="outlined"
                                name="name"
                                value={name}
                                //onChange={handleInputFormChange}
                                label="Nombre"
                                type="text"
                                fullWidth
                            />
                        </div>
                        <div>
                            <TextField
                                margin="dense"
                                variant="outlined"
                                name="category"
                                value={category ?? ''}
                                //onChange={handleInputFormChange}
                                label="Área disciplinar"
                                type="text"
                                fullWidth
                            />
                        </div>
                        <div>
                            <FormControlLabel
                                control={<Switch checked={metadata.public} onChange={() => console.log(metadata.public)} name="public" />}
                                label={metadata.public ? 'Público' : 'Privado'}
                            />
                        </div>
                        <Typography > Tiempo diseñado </Typography>
                        <div className={classes.metadataField}>
                            <TextField
                                margin="dense"
                                variant="outlined"
                                name="workingTimeDesignHours"
                                value={workingTimeDesign ?? 0}
                                //onChange={handleInputFormChange}
                                label="Horas"
                                type="number"
                                disabled
                                fullWidth
                            />
                            <Typography style={{ marginLeft: 10, marginRight: 10 }}> : </Typography>
                            <TextField
                                margin="dense"
                                variant="outlined"
                                name="workingTimeMinutes"
                                value={workingTimeDesign ?? 0}
                                //onChange={handleInputFormChange}
                                label="Minutos"
                                type="number"
                                disabled
                                fullWidth
                            />
                        </div>

                        <Typography > Tiempo de trabajo </Typography>
                        <div className={classes.metadataField}>
                            <TextField
                                margin="dense"
                                variant="outlined"
                                name="workingTimeHours"
                                value={workingTime ?? 0}
                                //onChange={handleInputFormChange}
                                label="Horas"
                                type="number"
                                inputProps={{
                                    min: 0, 
                                    max: 59
                                }}
                                fullWidth
                            />
                            <Typography style={{ marginLeft: 10, marginRight: 10 }}> : </Typography>
                            <TextField
                                margin="dense"
                                variant="outlined"
                                name="workingTimeMinutes"
                                //value={workingTime ?? 0}
                                //onChange={handleInputFormChange}
                                label="Minutos"
                                type="number"
                                inputProps={{
                                    min: 0, 
                                    max: 59
                                }}
                                fullWidth
                            />
                        </div>
                        <div>
                            <TextField
                                label="Conocimiento previo"
                                multiline
                                rows={3}
                                name="priorKnowledge"
                                value={priorKnowledge ?? ''}
                                variant="outlined"
                                fullWidth
                            />
                        </div>
                        <div>
                            <TextField
                                multiline
                                rows={3}
                                variant="outlined"
                                name="description"
                                value={description ?? ''}
                                //onChange={handleInputFormChange}
                                label="Descripción"
                                type="text"
                                fullWidth
                            />
                        </div>
                        <div>
                            <TextField
                                multiline
                                rows={3}
                                variant="outlined"
                                name="objective"
                                value={objective ?? ''}
                                //onChange={handleInputFormChange}
                                label="Objetivos"
                                type="text"
                                fullWidth
                            />
                        </div>

                    </div>
                    <div className={classes.title}>
                        <Typography variant='h4'>Resultados de aprendizaje</Typography>
                        <Button variant='outlined' color='default'>Agregar</Button>
                    </div>
                    <Divider />
                </Grid>
                <Grid item xs={12} md={3} lg={2} className={classes.rightPanel}></Grid>
            </Grid>
        </>
    )
}
