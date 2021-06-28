import { Grid, makeStyles, Typography, Button, Box, Avatar } from '@material-ui/core';
import { useUiState } from 'contexts/ui/UiContext';
import React from 'react';
import types from 'types';
import Document from 'assets/img/Document.png';
import GraphicPie from 'assets/img/GraphicPie.png';
import PyramidBloom from 'assets/img/PyramidBloom.png';
import Planning from 'assets/img/Planning.png';
import Collaborative from 'assets/img/Collaborative.png';
import Design from 'assets/img/Design.png';

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
        background: theme.palette.background.navbar
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
    },
    firstImgSize: {
        width: theme.spacing(30),
        height: theme.spacing(30),
    },
    imgSize: {
        width: theme.spacing(20),
        height: theme.spacing(20),
    },

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
        <Grid className={classes.root}>
            <Grid container className={classes.paper} style={{marginBottom: 100}}>
                <Grid item xs={2}/>
                <Grid item xs={8}>
                    <Grid container className={classes.informationPage}>
                        <Grid item xs = {12} lg = {6}>
                            <Box display="flex" justifyContent="center">
                                <Avatar variant="square" className={classes.firstImgSize} src={Design} alt="Design"/>
                            </Box>
                            <Typography variant='h4' className= {classes.row}>Diseña</Typography>
                            <Typography variant='body1' className= {classes.col}>
                                <li>Diseño basado en la evaluación.</li>
                                <li>Apoyo visual de la planificación.</li>
                                <li>Diseños coherentes con soporte pedagógico.</li>
                            </Typography>
                        </Grid>
                        <Grid item xs = {12} lg = {6}>
                            <Box display="flex" justifyContent="center">
                                <Avatar variant="square" className={classes.firstImgSize} src={Collaborative} alt="Collaborative"/>
                            </Box>
                            <Typography variant='h4' className= {classes.row}>Colabora</Typography>
                            <Typography variant='body1' className= {classes.col}>
                                <li>Crea diseños con tu equipo de trabajo.</li>
                                <li>Comparte tus diseños a otros.</li>
                                <li>Busca y utiliza diseños hechos por otros.</li>
                            </Typography>
                        </Grid>
                        <div style={{width: '100%', marginTop: 20}}>
                            <Box display="flex" justifyContent="center">
                                <Typography variant='body1' className= {classes.row}>No pienses en un curso como un depósito de información. Piensa qué necesitan hacer tus estudiantes con la información una vez que terminen el curso y diséñalo en torno a eso.</Typography>
                            </Box>
                            <Box display="flex" justifyContent="flex-end">
                                <Typography variant='caption' className= {classes.row}>~ Matthew Guyan</Typography>
                            </Box>
                        </div>
                    </Grid>
                    
                </Grid>
                <Grid item xs={2}/>
            </Grid>
            <Grid container>
                <Grid item xs={2} className={classes.leftPanel}/>
                <Grid item xs={8} className={classes.landingPage}>
                    <div>
                        <div className={classes.textMid}>
                            <Grid container style={{marginBottom: 100}}>
                                <Grid item xs = {12} sm = {4} md = {3} lg={2}>  
                                    <Avatar variant="square" className={classes.imgSize} src={PyramidBloom} alt="PyramidBloom"/>
                                </Grid>
                                <Grid item xs = {12} sm = {8} md = {9} lg={10}>
                                    <Typography >
                                        Tus diseños se definen en coherencia con la Taxonomía de Bloom. Esto te permitirá definir los niveles cognitivos esperados para tus estudiantes, y facilitar las labores de evaluación.
                                    </Typography>
                                </Grid>
                            </Grid>
                        </div>
                        <div className={classes.textMid}>
                            <Grid container style={{marginBottom: 100}}>
                                <Grid item xs = {12} sm = {4} md = {3} lg={2}>
                                    <Avatar variant="square" className={classes.imgSize} src={GraphicPie} alt="GraphicPie"/>
                                </Grid>
                                <Grid item xs = {12} sm = {8} md = {9} lg={10}>
                                    <Typography >
                                        Las tareas quedarán balanceadas acorde al Framework Conversacional. Diseñarás tareas de adquisición de conocimiento, investigación, discusión, colaboración, producción y práctica.
                                    </Typography>
                                </Grid>
                            </Grid>
                        </div>
                        <div className={classes.textMid}>
                            <Grid container style={{marginBottom: 100}}>
                                <Grid item xs = {12} sm = {4} md = {3} lg={2}>  
                                    <Avatar variant="square" className={classes.imgSize} src={Planning} alt="Planning"/>
                                </Grid>
                                <Grid item xs = {12} sm = {8} md = {9} lg={10}>
                                    <Typography className={classes.textMid}>
                                        Planifica las actividades de modo de asignar a los estudiantes una carga acorde a los créditos de la asignatura.
                                    </Typography>
                                </Grid>
                            </Grid>
                        </div>
                        <div className={classes.textMid}>
                            <Grid container style={{marginBottom: 100}}>
                                <Grid item xs = {12} sm = {4} md = {3} lg={2}>
                                    <Avatar variant="square" className={classes.imgSize} src={Document} alt="Document"/>
                                </Grid>
                                <Grid item xs = {12} sm = {8} md = {9} lg={10}>
                                    <Typography className={classes.textMid}>
                                        Tus diseños se gestarán desde la evaluación hacia el estudiante. Una evaluación coherente que dará origen a las actividades del módulo.
                                    </Typography>
                                </Grid>
                            </Grid>
                        </div>
                        
                    </div>
                    <div style={{marginTop: 200}}>
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
            
        </Grid>
    );
};
