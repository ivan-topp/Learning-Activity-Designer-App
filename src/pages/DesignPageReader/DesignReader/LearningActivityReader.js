import React, {  useRef } from 'react';
import { Divider, Grid, makeStyles, Paper, Tooltip, Typography } from '@material-ui/core'
import { TaskReader } from 'pages/DesignPageReader/DesignReader/TaskReader';
import { StackedBar } from 'components/StackedBar';
import { useDesignState } from 'contexts/design/DesignContext';
import { itemsLearningType } from 'assets/resource/items'

const useStyles = makeStyles((theme) => ({
    unitSpacing: {
        marginTop: theme.spacing(3),
    },
    titleUnitSpacing: {
        display: 'flex',
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: theme.spacing(1),
    },
    graphicUnitSpacing: {
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing(1),
    },
    trashIcon: {
        marginLeft: "auto",
    },
    spacingDescriptionlearningActivity: {
        marginTop: theme.spacing(1),
    },
    spacingDescription: {
        marginRight: theme.spacing(2)
    },
    spacingLinkedResults: {
        marginTop: theme.spacing(2),
    },
    buttonPos: {
        marginTop: theme.spacing(1),
        marginLeft: "auto",
    },
    gridTask: {
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(1),
    },
    descriptionContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(1),
    },
    learningResultList: {
        display: 'flex',
        flexWrap: 'nowrap',
        flexDirection: 'column',
        paddingLeft: 15,
        maxHeight: 200,
        overflow: 'auto',
        overflowX: true,
    },
    taskContainer: {
        position: 'relative',
    },
}));

export const LearningActivityReader = ({ index, learningActivity }) => {
    const classes = useStyles();
    const { designState } = useDesignState();
    const { design } = designState;
    const taskRefs = useRef([]);

    const resetItems = () =>{
        itemsLearningType.forEach((item) =>{
            item.value = 0;
        });
    };

    const listLearningActivityArray = () => {
        return (
            <Grid key={index}>
                <Paper className={classes.unitSpacing}>
                    <Grid container>
                        <Grid item xs={12} sm={5} className={classes.titleUnitSpacing}>
                            <Typography>{learningActivity.title}</Typography>
                        </Grid>
                        {resetItems()}
                        <Grid item xs={12} sm={7} className={classes.graphicUnitSpacing}>
                            {   
                                design.data.learningActivities[index] && design.data.learningActivities[index].tasks && design.data.learningActivities[index].tasks.forEach((task)=>
                                {   
                                    itemsLearningType.forEach((item) =>{ 
                                        if( item.title === task.learningType ){
                                            item.value = item.value + 1;
                                        }
                                    });
                                } 
                                )
                            }
                            <StackedBar items = {itemsLearningType} type = {'Activity'}/>
                        </Grid>
                    </Grid>
                    <Divider />
                    <Grid container spacing={2} >
                        <Grid item xs={12} sm={8} className={classes.taskContainer}>
                            <Grid className={classes.gridTask}>
                                {
                                    design.data.learningActivities[index] && design.data.learningActivities[index].tasks && design.data.learningActivities[index].tasks.map((task, i)=> <TaskReader ref={(ref) => taskRefs.current.push(ref)} key={`task-${i}-learningActivity-${index}`} index={i} task={task} learningActivityIndex={index}/> ) 
                                }
                            </Grid>
                            <Grid container>
                                <Grid item />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={4} >
                            <div className={classes.descriptionContainer}>
                                <Typography variant="body2" className={classes.spacingDescriptionlearningActivity} color="textSecondary"> Descripción Unidad de aprendizaje </Typography>
                                <Grid className={classes.spacingDescription}>
                                    <Typography>{learningActivity.description}</Typography>
                                </Grid>
                                <Typography variant="body2" className={classes.spacingLinkedResults} color="textSecondary"> Resultados Vinculados </Typography>
                                <div className={classes.learningResultList}>
                                    {
                                        design.metadata.results.map(result => {
                                            if(!!learningActivity.learningResults.find(lr=> lr.verb === result.verb)) return (
                                                <Tooltip key={`learning-result-${result.verb}`} title={result.description}>
                                                    <Typography>{result.verb}</Typography>
                                                </Tooltip>
                                            );
                                            else return (<div key={`learning-result-${result.verb}`}></div>);
                                        })
                                    }
                                </div>

                            </div>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        )
    }

    return (
        <>
            {
                listLearningActivityArray()
            }
        </>
    )
}
