import React from 'react'
import { Grid, IconButton, makeStyles, Typography, Tooltip, Box } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const useStyles = makeStyles((theme) => ({
    activitySpacing:{
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(3),
    },
    trashIcon:{
        marginLeft: "auto",
    },
    paintGrid:{
        backgroundColor: "success.main"
    },
    colorSpacingLearning:{
        padding: 12
    }
}));

export const DesignActivity = () => {

    const handleDeleteActivity = ()=> {
        console.log("Eliminar actividad");
    };
    const classes = useStyles();
    return (
        <>  
            <Grid container>
                <Box bgcolor="success.main" className={classes.colorSpacingLearning}></Box>
                <Grid item className={classes.paintGrid}>
                </Grid>
                <Grid item >
                    <Typography variant="body2" className={classes.activitySpacing}> Aprendizaje </Typography>
                </Grid>
                <Grid item className={classes.trashIcon}>
                    <Tooltip title="Delete"> 
                        <IconButton onClick={handleDeleteActivity}>
                            <DeleteForeverIcon fontSize="small"/>
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        </>
    )
}
