import { Grid, makeStyles, Typography, Button, Paper } from '@material-ui/core';
import { useUiState } from 'contexts/ui/UiContext';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ChangeHistoryIcon from '@material-ui/icons/ChangeHistory';
import PieChartIcon from '@material-ui/icons/PieChart';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import React from 'react';
import types from 'types';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: 'calc(100vh - 64px)',
    },
    leftPanel: {
        display: 'flex',
        flexDirection: 'column',
        background: theme.palette.background.paper
    },
    landingPage: {
        paddingLeft: 15,
        paddingRight: 15,
        position: 'relative',
        height: 'auto',
        paddingBottom: theme.spacing(2),
        background: theme.palette.background.paper
    },
    rightPanel: {
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        background: theme.palette.background.paper
    },
    paper:{
        background: theme.palette.background.workSpace
    },
    inviteUser:{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: theme.spacing(2)
    },
    informationPage:{
        margin: theme.spacing(2),
    },
    row:{
        marginTop: theme.spacing(2),
    },
    col:{
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(2),
    },
    textMid:{
        marginBottom: theme.spacing(3)
    },
    sizeIcon:{
        fontSize: 80
    }

}));

export const LandingPage = () => {
    const classes = useStyles();
    const { dispatch } = useUiState();
    
    const handleOpenRegisterModal = () => {
        dispatch({
            type: types.ui.openModal,
            payload: 'Register',
        });
    };

    return (
        <Grid container className={classes.root}>
            <Grid item xs={2}  className={classes.leftPanel}/>
            <Grid item xs={8}  className={classes.landingPage}>
                <Paper className={classes.paper}>
                    <Grid container className={classes.informationPage}>
                        <Grid item xs = {12} lg = {6}>
                            <Typography variant='h5' className= {classes.row}>Diseña</Typography>
                            <Typography className= {classes.col}>
                                <li>Diseño basado en la evaluación.</li>
                                <li>Apoyo visual de la planificación.</li>
                                <li>Diseños coherentes con soporte pedagógico.</li>
                            </Typography>
                        </Grid>
                        <Grid item xs = {12} lg = {6}>
                            <Typography variant='h5' className= {classes.row}>Colabora</Typography>
                            <Typography className= {classes.col}>
                                <li>Crea diseños con tu equipo de trabajo.</li>
                                <li>Comparte tus diseños a otros.</li>
                                <li>Busca y utiliza diseños hechos por otros.</li>
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
                <div>
                    <div className={classes.textMid}>
                        <Grid container>
                            <Grid item xs = {12} sm = {3} md = {2} lg={1}>
                            <ChangeHistoryIcon className={classes.sizeIcon}/>
                            </Grid>
                            <Grid item xs = {12} sm = {9} md = {10} lg={11}>
                                <Typography >
                                    Tus diseños se definen en coherencia con la Taxonomía de Bloom. Esto te permitirá definir los niveles cognitivos esperados para tus estudiantes, y facilitar las labores de evaluación.
                                </Typography>
                            </Grid>
                        </Grid>
                    </div>
                    <div className={classes.textMid}>
                        <Grid container>
                            <Grid item xs = {12} sm = {3} md = {2} lg={1}>
                            <PieChartIcon className={classes.sizeIcon}/>
                            </Grid>
                            <Grid item xs = {12} sm = {9} md = {10} lg={11}>
                                <Typography >
                                    Las tareas quedarán balanceadas acorde al Framework Conversacional. Diseñarás tareas de adquisición de conocimiento, investigación, discusión, colaboración, producción y práctica.
                                </Typography>
                            </Grid>
                        </Grid>
                    </div>
                    <div className={classes.textMid}>
                        <Grid container>
                            <Grid item xs = {12} sm = {3} md = {2} lg={1}>
                            <AccountTreeIcon className={classes.sizeIcon}/>
                            </Grid>
                            <Grid item xs = {12} sm = {9} md = {10} lg={11}>
                                <Typography className={classes.textMid}>
                                    Planifica las actividades de modo de asignar a los estudiantes una carga acorde a los créditos de la asignatura.
                                </Typography>
                            </Grid>
                        </Grid>
                    </div>
                    <div className={classes.textMid}>
                        <Grid container>
                            <Grid item xs = {12} sm = {3} md = {2} lg={1}>
                                <AssignmentIcon className={classes.sizeIcon}/>
                            </Grid>
                            <Grid item xs = {12} sm = {9} md = {10} lg={11}>
                                <Typography className={classes.textMid}>
                                    Tus diseños se gestarán desde la evaluación hacia el estudiante. Una evaluación coherente que dará origen a las actividades del módulo.
                                </Typography>
                            </Grid>
                        </Grid>
                    </div>
                    
                </div>
                <div style={{marginTop: 30}}>
                    <div className={classes.inviteUser}>
                        <Typography variant="h5">¿Estás listo para iniciar esta aventura?</Typography>
                    </div>
                    <div className={classes.inviteUser}>
                        <Button onClick={handleOpenRegisterModal} variant='contained'>
                            Registrarme
                        </Button>
                    </div>
                </div>
            </Grid>

            <Grid item xs={2}  className={classes.rightPanel}/>
            
        </Grid>
    );
};
