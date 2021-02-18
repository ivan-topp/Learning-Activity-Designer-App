import { Button, ButtonGroup, Divider, Grid, makeStyles, Typography } from '@material-ui/core'
import React from 'react'

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
        marginTop: theme.spacing(1)
    },
    textLefPanel:{
        marginTop: theme.spacing(1)
    },
    spaceData:{
        marginBottom: theme.spacing(2),
        borderBottom: `2px solid ${theme.palette.divider}`
    },  
}));

export const DesignWorkspace = () => {
    const classes = useStyles();
    return (
        <>
            <Grid container>
                <Grid item xs={12} md={3} lg={2} className={classes.leftPanel}>
                    <Grid container alignItems='center' justify='center'>
                        <Typography className={classes.textLefPanel}> INFORMACIÓN DISEÑO </Typography>
                    </Grid>
                    <Divider className={classes.spaceData}/>
                </Grid>
                <Grid item xs={12} md={6} lg={8} className={classes.workspace}>
                    <ButtonGroup size="small" aria-label="outlined primary button group" className={classes.buttonGroupWorkSpace}>
                        <Button>Nuevo</Button>
                        <Button>Compartir</Button>
                        <Button>Guardar</Button>
                    </ButtonGroup>
                </Grid>
                <Grid item xs={12} md={3} lg={2} className={classes.rightPanel}></Grid>
            </Grid>   
        </>
    )
}
