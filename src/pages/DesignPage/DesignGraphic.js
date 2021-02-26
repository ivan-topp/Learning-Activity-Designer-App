import React, { useEffect } from 'react'
import { Chart } from 'chart.js'
import { Grid, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    spaceGraphic: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    spaceActivities: {
        marginBottom: theme.spacing(2),
    },
}));

export const DesignGraphic = ({ design }) => {
    
    const classes = useStyles();
    //const tlaArray = design.data.tlas
    //let activitiesArrayNew = ""
    //let modality = ""

    const activitiesModalityOA = 1;
    const activitiesModalityOS= 2;
    const activitiesModalityPA= 0;
    const activitiesModalityPS= 0;
    
    //const activitiesArray = tlaArray.forEach((tla) => {
    //    if(tla.activities!==undefined){
    //        activitiesArrayNew = tla.activities
    //    } 
    //});

    //const ModalityArray = activitiesArrayNew.forEach((activities) => {
    //    if(activities.modality!==undefined){
    //        modality = activities.modality
    //    } 
    //});


    //console.log(modality)

    //useEffect(() => {
    //    if( modality === "Online-Sincrono" ){
    //        activitiesModalityOS = activitiesModalityOS + 1
    //    }
    //}, [modality, activitiesModalityOS])
    
    
    const activitiesFormatGroup = 2
    const activitiesFormatSingle = 1
    const activitiesFormatAllClass = 0
    
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
                    data: [activitiesFormatGroup],
                    backgroundColor: [
                        'rgba(61, 156, 65, 0.8)',
                    ],
                },{
                    label: 'Individual',
                    data: [activitiesFormatSingle],
                    backgroundColor: [
                        'rgba(224, 243, 225, 0.8)',
                    ],
                },{
                    label: 'Toda la clase',
                    data: [activitiesFormatAllClass],
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
                    data: [activitiesModalityOA],
                    backgroundColor: [
                        '#A6CAF6',
                    ],
                },{
                    label: 'Online-Sincrono',
                    data: [activitiesModalityOS],
                    backgroundColor: [
                        '#6996CD',
                    ],
                },{
                    label: 'Presencial-Asincrono',
                    data: [activitiesModalityPA],
                    backgroundColor: [
                        '#5FA2EF',
                    ],
                },{
                    label: 'Presencial-Sincrono',
                    data: [activitiesModalityPS],
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
                
                <Grid className={classes.spaceActivities}>
                    <canvas id="formatBar"></canvas>
                </Grid>
                <canvas id="modalityBar"></canvas>
            </Grid>
        </Grid> 
        </>
    )
}
