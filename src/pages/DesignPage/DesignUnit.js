import { Box, Button, Divider, Grid, IconButton, makeStyles, Paper, Tooltip, Typography } from '@material-ui/core'
import React from 'react'
import { DesignActivity } from './DesignActivity';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const useStyles = makeStyles((theme) => ({
    unitSpacing:{
        marginTop: theme.spacing(3),
    },
    titleUnitSpacing:{
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(1)
    },
    trashIcon:{
        marginLeft: "auto",
    },
    spacingDescriptionTLA:{
        marginTop: theme.spacing(1),
    },
    spacingDescription:{
        marginRight: theme.spacing(2)
    },
    spacingLinkedResults:{
        marginTop: theme.spacing(2),
    },
    buttonPos:{
        marginTop: theme.spacing(1),
        marginLeft: "auto",
    },
    gridActivity:{
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(1),
    }
}));

export const DesignUnit = ({ design }) => {
    const classes = useStyles();
    
    const handleDeleteUnit = ()=> {
        console.log("Eliminar unidad");
    };

    const handleAddActivity = () => {
        console.log("Agregar nueva Actividad");
    };
    return (
        <>  
            {  
                design.data.tlas.map((value, index)=>{
                    return (
                        <Grid className={classes.unitSpacing} key={index}>
                            <Paper>
                                <Grid container>
                                    <Grid item >
                                        <Typography className={classes.titleUnitSpacing}>{value.title}</Typography>
                                    </Grid>
                                    <Grid item  className={classes.trashIcon}>
                                        <Tooltip title="Delete"> 
                                            <IconButton onClick={handleDeleteUnit}>
                                                <DeleteForeverIcon fontSize="small"/>
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                                <Divider/>
                                <Grid container spacing={2} >
                                    <Grid item xs={12} sm={8}>
                                        <Box boxShadow={1} className={classes.gridActivity}>
                                            <DesignActivity/>
                                        </Box>
                                        <Grid container>
                                            <Grid item />
                                            <Grid item  className={classes.buttonPos}>
                                                <Button size="small" variant="outlined" onClick={handleAddActivity}> Agregar Tarea </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="body2" className={classes.spacingDescriptionTLA} color="textSecondary"> Descripción Unidad de aprendizaje </Typography>
                                        <Typography variant="body2" className={classes.spacingDescription}>
                                            {value.description}
                                        </Typography>
                                        <Typography variant="body2" className={classes.spacingLinkedResults} color="textSecondary"> Resultados Vinculados </Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    )
                })
            }
        </>
    )
}
