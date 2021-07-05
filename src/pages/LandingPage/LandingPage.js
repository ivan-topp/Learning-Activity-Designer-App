import { useTheme, Grid, makeStyles, Typography, Button, Box, Avatar, Paper } from '@material-ui/core';
import { useUiState } from 'contexts/ui/UiContext';
import React from 'react';
import types from 'types';
import PyramidBloomLight from 'assets/img/PyramidBloomLight.png';
import PyramidBloomDark from 'assets/img/PyramidBloomDark.png';
import Design from 'assets/img/Design.png';
import { ReactComponent as Collaboration } from 'assets/img/collaboration.svg';
import { ReactComponent as TimeChart } from 'assets/img/time_chart.svg';
import { ReactComponent as Evaluation } from 'assets/img/evaluation.svg';
import { ReactComponent as ConversationalFramework } from 'assets/img/conversational_framework.svg';
//import { ReactComponent as LiveCollaborationLight } from 'assets/img/live_collaboration_light.svg';
//import { ReactComponent as LiveCollaborationDark } from 'assets/img/live_collaboration_dark.svg';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: 'calc(100vh - 64px)',
    },
    landingPage: {
        paddingLeft: 15,
        paddingRight: 15,
        position: 'relative',
        height: 'auto',
        paddingBottom: theme.spacing(2),
        background: theme.palette.background.paper
    },
    paper: {
        background: theme.palette.background.navbar
    },
    featureList: {
        display: 'flex',
        paddingTop: 25,
        paddingBottom: 100,
        // justifyContent: 'space-between',
        minHeight: 'calc(100vh - 64px)',
        paddingLeft: 200,
        paddingRight: 200,
        [theme.breakpoints.down('lg')]: {
            paddingLeft: 150,
            paddingRight: 150,
        },
        [theme.breakpoints.down('md')]: {
            paddingLeft: 100,
            paddingRight: 100,
        },
        [theme.breakpoints.down('sm')]: {
            paddingLeft: 50,
            paddingRight: 50,
        },
        [theme.breakpoints.down('xs')]: {
            paddingLeft: 10,
            paddingRight: 10,
        },
    },
    featureGrid: {
        padding: 10,
    },
    feature: {
        padding: theme.spacing(4),
        width: '100%',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: theme.palette.background.workSpace,
    },
    featureImage: {
        width: theme.spacing(20),
        height: theme.spacing(20),
        marginBottom: 20,
    },
    inviteUser: {
        background: theme.palette.background.workSpace,
        minHeight: 'calc(100vh - 50vh)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inviteUserButton: {
        marginTop: theme.spacing(3),
    },
    firstData:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column-reverse'
        },
    },
    banner: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)',
        width: '100%',
        background: theme.palette.background.workSpace,
        padding: theme.spacing(10),
        
    },
    bannerItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    row: {
        marginTop: theme.spacing(2),
    },
    sizeIcon: {
        fontSize: 80
    },
    firstImgSize: {
        width: theme.spacing(65),
        height: theme.spacing(65),
        [theme.breakpoints.down('md')]: {
            width: theme.spacing(40),
            height: theme.spacing(40),
        },
        [theme.breakpoints.down('xs')]: {
            width: theme.spacing(30),
            height: theme.spacing(30),
        },
        // [theme.breakpoints.down('xs')]: {
        //     width: theme.spacing(15),
        //     height: theme.spacing(15),
        // },
    },
    marginAutor:{
        [theme.breakpoints.down('xl')]: {
            marginRight: 150
        },
        [theme.breakpoints.down('md')]: {
            marginRight: 10
        },
    }
}));

export const LandingPage = () => {
    const theme = useTheme();
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
            <Grid container className={classes.banner}>
                <Grid item>
                    <Box >
                        <Grid container className={classes.firstData}>
                            <Grid item xs={12} lg={6} className={classes.bannerItem}>
                                <div style ={{marginLeft: 100, marginRight: 100}}>
                                    <Typography variant = 'h3' style ={{ marginBottom: 25}}>Planifica tus clases mediante diseños</Typography>
                                    <Typography> Nuestra plataforma web te facilita la planificación de tus actividades de enseñanza, de tal manera de lograr y comprobar que los estudiantes utilicen los contenidos aprendidos. </Typography>
                                    <Typography style={{marginTop: 10}}>Tus diseños estarán basados en la evaluación, tendrás apoyo visual de la planificación y serán coherentes con un soporte pedagógico.</Typography>
                                    <Typography style={{marginTop: 10}}>Comparte tus diseños, de tal manera que puedas trabajar en equipo y compartir con la comunidad tus modelos de enseñanza.</Typography>
                                    <Button style ={{marginTop: 50, marginBottom: 20}} onClick={handleOpenRegisterModal} color='primary' variant='contained'>
                                        Comienza a diseñar
                                    </Button>
                                </div>
                            </Grid>
                            <Grid item xs={12} lg={6} className={classes.bannerItem}>
                                <Box display="flex" justifyContent="center">
                                    <Avatar variant="square" className={classes.firstImgSize} src={Design} alt="Design" />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    <div style={{ width: '100%'}} >
                        <Box display="flex" justifyContent="center">
                            <Typography variant='body1' align='center'>"No pienses en un curso como un depósito de información. Piensa qué necesitan hacer tus estudiantes con la información una vez que terminen el curso y diséñalo en torno a eso."</Typography>
                        </Box>
                        <Box display="flex" justifyContent="flex-end" className={classes.marginAutor}>
                            <Typography variant='caption' className={classes.row}>~ Matthew Guyan</Typography>
                        </Box>
                    </div>
                </Grid>
            </Grid>
            <Box display="flex" justifyContent="center">
                <Typography style={{paddingTop: 100}} variant='h6' >¿Que utilidades te otorga la plataforma?</Typography>
            </Box>
            <Grid container className={classes.featureList}>
                <Grid item xs={12} md={6} lg={4} className={classes.featureGrid}>
                    <Paper className={classes.feature}>
                        {
                            theme.palette.type === 'dark' ? <Avatar variant="square" className={classes.featureImage} src={PyramidBloomDark} alt="PyramidBloomDark"  /> : <Avatar variant="square" className={classes.featureImage} src={PyramidBloomLight} alt="PyramidBloomLight" /> 
                        }
                        <Typography align='center'>
                            Tus diseños se definen en coherencia con la Taxonomía de Bloom. Esto te permitirá definir los niveles cognitivos esperados para tus estudiantes, y facilitar las labores de evaluación.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} lg={4} className={classes.featureGrid}>
                    <Paper className={classes.feature}>
                        <ConversationalFramework className={classes.featureImage} />
                        <Typography align='center'>
                            Las tareas quedarán balanceadas acorde al Framework Conversacional. Diseñarás tareas de adquisición de conocimiento, investigación, discusión, colaboración, producción y práctica.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} lg={4} className={classes.featureGrid}>
                    <Paper className={classes.feature}>
                        <TimeChart className={classes.featureImage} />
                        <Typography align='center'>
                            Planifica las actividades de modo de asignar a los estudiantes una carga acorde a los créditos de la asignatura.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} lg={4} className={classes.featureGrid}>
                    <Paper className={classes.feature}>
                        <Evaluation className={classes.featureImage} />
                        <Typography align='center'>
                            Tus diseños se gestarán desde la evaluación hacia el estudiante. Una evaluación coherente que dará origen a las actividades del módulo.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} lg={4} className={classes.featureGrid}>
                    <Paper className={classes.feature}>
                        <Collaboration className={classes.featureImage} />
                        <Typography align='center'>
                            Puedes compartir tus diseños con tu equipo de trabajo, así como también explorar los diseños de otros usuarios y retroalimentar.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
            <div className={classes.inviteUser}>
                <div className={classes.inviteUserText}>
                    <Typography variant="h5">¿Estás listo para iniciar esta aventura?</Typography>
                </div>
                <div className={classes.inviteUserButton}>
                    <Button onClick={handleOpenRegisterModal} color='primary' variant='contained'>
                        Registrarme
                    </Button>
                </div>
            </div>
        </Grid>
    );
};
