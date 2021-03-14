import React, { useEffect } from 'react';
import { Chart } from 'chart.js';
import { Grid, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    spaceGraphic: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    spaceTasks: {
        marginBottom: theme.spacing(2),
    },
}));

export const DesignGraphic = ({ design }) => {
    
    const classes = useStyles();
    //const learningtasksArray = design.data.learningtasks
    //let tasksArrayNew = ""
    //let modality = ""

    const tasksModalityOA = 1;
    const tasksModalityOS= 2;
    const tasksModalityPA= 0;
    const tasksModalityPS= 0;
    
    //const tasksArray = learningtasksArray.forEach((learningActivity) => {
    //    if(learningActivity.tasks!==undefined){
    //        tasksArrayNew = learningActivity.tasks
    //    } 
    //});

    //const ModalityArray = tasksArrayNew.forEach((tasks) => {
    //    if(tasks.modality!==undefined){
    //        modality = tasks.modality
    //    } 
    //});


    //console.log(modality)

    //useEffect(() => {
    //    if( modality === "Online-Sincrono" ){
    //        tasksModalityOS = tasksModalityOS + 1
    //    }
    //}, [modality, tasksModalityOS])
    
    
    const tasksFormatGroup = 2
    const tasksFormatSingle = 1
    const tasksFormatAllClass = 0
    
    useEffect(() => {
        learningResultPie();
        //emit socket
    }, []);

    useEffect(() => {
        activityFormatBar();
        //emit socket
    }, []);

    useEffect(()=>{
        activityModalityBar();
        //emit socket
    }, []);
    
    const learningResultPie = () =>{

        const ctx = document.getElementById('analysisPie');
        
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Adquisición', 'Investigación', 'Colaboración', 'Discusión', 'Práctica', 'Producción'],
                datasets: [{
                    label: 'Análisis',
                    data: [1, 1, 1, 1, 1, 1], 
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                animation: false,
                legend: {
                    position: 'bottom',
                    labels:{
                        boxWidth: 20
                    }
                }
            }
        });
    }

    const activityFormatBar = () => {
        
        const ctx = document.getElementById('formatBar');

        new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: ['Formato'],
                datasets: [{
                    label: 'Grupal',
                    data: [tasksFormatGroup],
                    backgroundColor: [
                        'rgba(61, 156, 65, 0.8)',
                    ],
                },{
                    label: 'Individual',
                    data: [tasksFormatSingle],
                    backgroundColor: [
                        'rgba(224, 243, 225, 0.8)',
                    ],
                },{
                    label: 'Toda la clase',
                    data: [tasksFormatAllClass],
                    backgroundColor: [
                        'rgba(102, 242, 108, 0.75)',
                    ],
                }
            ]
            },
            options: {
                animation: false,
                scales: {
                    xAxes: [{
                        gridLines:{
                            display:false,
                        },
                        stacked: true,
                    }],
                    yAxes: [{
                        gridLines:{
                            display:false,
                        },
                        stacked: true
                    }]
                },
                legend: {
                    position: 'bottom',
                    labels:{
                        boxWidth: 20
                    }
                }
            }
        });
    }
    const activityModalityBar=()=>{
        
        const ctx = document.getElementById('modalityBar');

        new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: ['Modalidad'],
                datasets: [{
                    label: 'Online-Asincrono',
                    data: [tasksModalityOA],
                    backgroundColor: [
                        '#A6CAF6',
                    ],
                },{
                    label: 'Online-Sincrono',
                    data: [tasksModalityOS],
                    backgroundColor: [
                        '#6996CD',
                    ],
                },{
                    label: 'Presencial-Asincrono',
                    data: [tasksModalityPA],
                    backgroundColor: [
                        '#5FA2EF',
                    ],
                },{
                    label: 'Presencial-Sincrono',
                    data: [tasksModalityPS],
                    backgroundColor: [
                        '#135BB3',
                    ],
                }
            ]
            },
            options: {
                animation: false,
                scales: {
                    xAxes: [{
                        gridLines:{
                            display:false,
                        },
                        stacked: true,
                    }],
                    yAxes: [{
                        gridLines:{
                            display:false,
                        },
                        stacked: true
                    }]
                },
                legend: {
                    position: 'bottom',
                    align: 'center',
                    labels:{
                        boxWidth: 20,
                    }
                },
                layout:{
                    padding: {
                        left: 20,
                        right: 20,
                        top: 0,
                        bottom: 0
                    }
                },
            }
        });
    };

    return (
        <>
        <Grid className={classes.spaceGraphic}>
            <Grid container alignItems='center' justify='center' >
                <Typography color="textSecondary"> Análisis</Typography>
            </Grid>
            <canvas id="analysisPie"></canvas>
        </Grid>
        <Grid className={classes.spaceGraphic}>
            <Grid container alignItems='center' justify='center' >
                <Typography color="textSecondary">Actividades</Typography>
                
                <Grid className={classes.spaceTasks}>
                    <canvas id="formatBar"></canvas>
                </Grid>
                <canvas id="modalityBar"></canvas>
            </Grid>
        </Grid> 
        </>
    )
}
