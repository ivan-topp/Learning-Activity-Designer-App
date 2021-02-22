import React, { useEffect } from 'react'
import { Chart } from 'chart.js'
import { Grid, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    spaceGraphic :{
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    }
}));

export const DesignGraphic = () => {

    const classes = useStyles();

    useEffect(() => {
        learningResultPie();
    }, []);

    useEffect(() => {
        activityBar();
    }, []);
    
    const learningResultPie = () =>{

        const ctx = document.getElementById('myPie');
        console.log(ctx)
        
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: 'Analisis',
                    data: [1, 1, 1, 1, 1, 1], 
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                animation: false,
            }
        });

        
    }

    const activityBar = () => {
        
        const ctx = document.getElementById('myBar');

        new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: ['Formato'],
                datasets: [{
                    label: 'Grupal',
                    data: [1],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.4)',
                        
                    ],
                },{
                    label: 'Individual',
                    data: [2],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.4)',
                        
                    ],
                }
            ]
            },
            options: {
                animation: false,
                scales: {
                    xAxes: [{
                        stacked: true,
                    }],
                    yAxes: [{
                        stacked: true
                    }]
                },
                indexAxis: 'y'
            }
        });
    }
    return (
        <>
        <Grid className={classes.spaceGraphic}>
            <Grid container alignItems='center' justify='center' >
                <Typography color="textSecondary"> Análisis</Typography>
            </Grid>
            <canvas id="myPie"></canvas>
        </Grid>
        <Grid className={classes.spaceGraphic}>
            <Grid container alignItems='center' justify='center' >
                <Typography color="textSecondary"> Actividades</Typography>
            </Grid>
            <canvas id="myBar"></canvas>
        </Grid>    
        </>
    )
}
