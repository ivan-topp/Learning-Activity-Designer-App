import React from 'react';
import { Button, ButtonGroup, Divider, Grid, makeStyles, Typography } from '@material-ui/core';
import { useDesignState } from 'contexts/design/DesignContext';
import { StackedBar } from 'components/StackedBar';
import { PieGraphic } from 'components/PieGraphic';
import { itemsLearningType, itemsFormat, itemsModality, itemsLearningTypePie } from 'assets/resource/items'
import { LearningActivityReader } from './LearningActivityReader';
import { useAuthState } from 'contexts/AuthContext';
import { duplicateDesign } from 'services/DesignService';
import { useMutation, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
import { useHistory, useParams } from 'react-router';


const useStyles = makeStyles((theme) => ({
    leftPanel: {
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    workspace: {
        paddingLeft: 15,
        paddingRight: 15,
        background: theme.palette.background.workSpace,
        paddingBottom: theme.spacing(3),
        height: 'auto',
        [theme.breakpoints.up('md')]: {
            height: 'calc(100vh - 177px)',
            overflow: 'auto'
        },
    },
    rightPanel: {
        display: 'flex',
        flexDirection: 'column',
        borderLeft: `1px solid ${theme.palette.divider}`,
        background: theme.palette.background.paper,
    },
    textLefPanel:{
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    spaceData:{
        marginBottom: theme.spacing(1),
        borderBottom: `2px solid ${theme.palette.divider}`
    },
    LeftPanelMetadata:{
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2)
    },
    textLefPanelMetadata:{
        marginTop: theme.spacing(3)
    },
    graphicsSpacing:{
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
    },
    betweenGraphics:{
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    workSpaceUnits: {
        height: 'auto',
        [theme.breakpoints.up('md')]: {
            height: '90%',
            overflow: 'auto',
            overflowX: 'hidden',
        },
    },
    buttonGroupWorkSpace: {
        height: 'auto',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    '@global': {
        //Ancho del scrollbar    
        '*::-webkit-scrollbar': {
            width: '0.4em'
        },
        //Sombra del scrollbar
        '*::-webkit-scrollbar-track': {
            '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.2)'
            
        },
        //Scrollbar
        '*::-webkit-scrollbar-thumb': {
            '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.2)',
            borderRadius: '15px',
            backgroundColor: 'rgba(0,0,0,.1)',
        }
    },
      
}));

export const DesignReader = ({ type }) => {
    const classes = useStyles();
    const { designState } = useDesignState();
    const { authState } = useAuthState();
    const urlparams = useParams();
    const history = useHistory();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const { design } = designState;
    const { metadata } = design;
    
    let showGraphicLearningType = false;
    let showGraphicFormat = false;
    let showGraphicModality = false;

    const duplicateDesignMutation = useMutation(duplicateDesign, {
        onMutate: async () => {
            await queryClient.cancelQueries('recent-designs');
            await queryClient.cancelQueries(['designs', '/']);
            await queryClient.cancelQueries([authState.user.id, 'user-public-designs']);
        },
        onSettled: () => {
            queryClient.invalidateQueries('recent-designs');
            queryClient.invalidateQueries(['designs', '/']);
            queryClient.invalidateQueries([authState.user.id, 'user-public-designs']);
        },
        onError: (error) => {
            enqueueSnackbar(error.message,  {variant: 'error', autoHideDuration: 2000});
        },
        onSuccess: data => {
            history.push(`/designs/${data.newDesign._id}`);
        }
    });
    
    design.data.learningActivities.forEach((activities) => {
        if (activities.tasks !== undefined) {
            activities.tasks.forEach(task=>{
                if (task.learningType !== '' && task.learningType !== 'Seleccionar' ) {
                    showGraphicLearningType  = true;
                }
                if (task.format !== '' && task.format !== 'Seleccionar') {
                    showGraphicFormat = true;
                }
                if (task.modality !== '' && task.modality !== 'Seleccionar') {
                    showGraphicModality = true;
                }
            })
        }
    });    

    const resetItems = () =>{
        itemsLearningType.forEach((item) =>{
            item.value = 0;
        });
        itemsLearningTypePie.forEach((item) =>{
            item.value = 0;
        });
        
        itemsFormat.forEach((item) =>{
            item.value = 0;
        });
        itemsModality.forEach((item) =>{
            item.value = 0;
        });
    };

    const handleDuplicateDesign = async (e) => {
        await duplicateDesignMutation.mutate({ id: urlparams.id });
    };
    
    return (
        <>  
            <Grid container>
                <Grid item xs={12} md={3} lg={2} className={classes.leftPanel}>
                    <Grid container alignItems='center' justify='center'>
                        <Typography className={classes.textLefPanel}> INFORMACIÓN DISEÑO </Typography>
                    </Grid>
                    <Divider className={classes.spaceData}/>
                    <Grid className={classes.LeftPanelMetadata}>
                        <Grid>
                            { metadata && metadata.name &&(
                                    <>
                                        <Typography variant='body2' color='textSecondary'> Nombre </Typography>
                                        <Typography variant='body2'>{ metadata.name }</Typography>
                                        <Divider/>
                                    </>
                                )
                            }
                        </Grid>
                        <Grid>
                            { metadata && metadata.category &&(
                                <>
                                        <Typography variant='body2' color='textSecondary' className={classes.textLefPanelMetadata}>Tema</Typography>
                                        <Typography variant='body2'> { metadata.category.name } </Typography>
                                        <Divider/>
                                    </>
                                )
                            }
                        </Grid>
                        <Grid>
                            { metadata && metadata.workingTime &&(
                                    <>
                                        <Typography variant="body2" color='textSecondary' className={classes.textLefPanelMetadata}> Tiempo de trabajo </Typography>
                                        <Typography variant="body2"> { metadata.workingTime.hours } : {metadata.workingTime.minutes}</Typography>
                                        <Divider/>
                                    </>
                                )
                            }
                        </Grid>
                        <Grid>
                            { metadata && metadata.workingTimeDesign &&(
                                    <>
                                        <Typography variant="body2" color='textSecondary' className={classes.textLefPanelMetadata}>Tiempo de trabajo Diseño</Typography>
                                        <Typography variant="body2"> { metadata.workingTimeDesign }</Typography>
                                        <Divider/>
                                    </>
                                )
                            }
                        </Grid>
                        <Grid>
                            { metadata && metadata.name &&(
                                    <>
                                        <Typography variant='body2' color='textSecondary' className={classes.textLefPanelMetadata}> Modo de entrega </Typography>
                                        <Typography variant='body2' > { metadata.name } </Typography>
                                        <Divider/>
                                    </>
                                )
                            }
                        </Grid>
                            { metadata && metadata.classSize &&(
                                    <>
                                        <Typography variant='body2' color='textSecondary' className={classes.textLefPanelMetadata}> Tamaño de la clase </Typography>
                                        <Typography variant='body2'> { metadata.classSize } </Typography>
                                        <Divider/>
                                    </>
                                )
                            }
                        <Grid>
                            { metadata && metadata.priorKnowledge &&(
                                    <>
                                        <Typography variant='body2' color='textSecondary' className={classes.textLefPanelMetadata}> Conocimiento Previo </Typography>
                                        <Typography variant='body2' > { metadata.priorKnowledge } </Typography>
                                        <Divider/>
                                    </>
                                )
                            }
                        </Grid>
                        <Grid>
                            { metadata && metadata.description &&(
                                    <>
                                        <Typography variant='body2' color='textSecondary' className={classes.textLefPanelMetadata}> Descripción </Typography>
                                        <Typography variant='body2'> { metadata.description } </Typography>
                                        <Divider/>
                                    </>
                                )
                            }
                        </Grid>
                        <Grid>
                            { metadata && metadata.objective &&(
                                    <>
                                        <Typography color='textSecondary' className={classes.textLefPanelMetadata}> Objetivos </Typography>
                                        <Typography> { metadata.objective } </Typography>
                                        <Divider/>
                                    </>
                                )
                            }
                        </Grid>
                        <Grid>
                            { /*metadata && metadata.results &&(
                                    <>
                                        <Typography color='textSecondary' className={classes.textLefPanelMetadata}> Resultados </Typography>
                                        <Typography>{ metadata.results }</Typography>
                                        <Divider/>
                                    </>
                                )*/
                            }
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6} lg={8} className={classes.workspace}>
                    { (!!authState.token) 
                        ? <div className={classes.buttonZone}>
                            <ButtonGroup size='small' aria-label='outlined primary button group' className={classes.buttonGroupWorkSpace}>
                                <Button onClick={handleDuplicateDesign}> Duplicar </Button>
                            </ButtonGroup>
                        </div> 
                        : <div></div>}
                    <Grid className={classes.workSpaceUnits}>
                        <Grid >
                            {
                                design.data.learningActivities && design.data.learningActivities.map((learningActivity, index) => <LearningActivityReader key={`learningActivity-${index}`} index={index} learningActivity={learningActivity}/> )
                            }
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={3} lg={2} className={classes.rightPanel}>
                {resetItems()}
                    <Grid className={classes.graphicsSpacing}>
                        {   
                            design.data.learningActivities && design.data.learningActivities.map((learningActivity) => 
                                learningActivity.tasks && learningActivity.tasks.forEach((task) => {
                                    itemsLearningType.forEach((item) =>{
                                        if( item.title === task.learningType){
                                            item.value = item.value + 1;
                                        }
                                    });
                                    itemsLearningTypePie.forEach((item) =>{
                                        if( item.title === task.learningType){
                                            item.value = item.value + 1;
                                        }
                                    });
                                    itemsFormat.forEach((item) =>{ 
                                        if( item.title === task.format ){
                                            item.value = item.value + 1;
                                        }
                                    });
                                    itemsModality.forEach((item) =>{ 
                                        if( item.title === task.modality ){
                                            item.value = item.value + 1;
                                        }
                                    });
                                }))
                            }
                        { showGraphicLearningType && 
                            <div className={classes.betweenGraphics}>
                                <PieGraphic items = { itemsLearningTypePie} colorGraphicToPdf={true}></PieGraphic>
                            </div>
                        }
                        {   showGraphicFormat &&
                            <div className={classes.betweenGraphics}>
                                <Typography>Formato</Typography>
                                <StackedBar items = {itemsFormat} type={'Format'} legends={true} colorGraphicToPdf={true}></StackedBar>
                            </div>
                        }
                        {   showGraphicModality &&
                            <div className={classes.betweenGraphics}>
                                <Typography>Modalidad</Typography>
                                <StackedBar items = {itemsModality} type={'Modality'} legends={true} colorGraphicToPdf={true}></StackedBar>
                            </div>
                        }
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}
