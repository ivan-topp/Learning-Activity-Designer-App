import React from 'react';
import { Avatar, Box, Button, ButtonGroup, Card, CardActionArea, Divider, Grid, makeStyles, Typography } from '@material-ui/core';
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
import { Description } from '@material-ui/icons';
import { formatName, getUserInitials } from 'utils/textFormatters';


const useStyles = makeStyles((theme) => ({
    root:{
        background: theme.palette.background.workSpace,
        minHeight: 'calc(100vh - 112px)',
    },
    leftPanel: {
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${theme.palette.divider}`,
        height: 'auto',
    },
    workspace: {
        paddingLeft: 15,
        paddingRight: 15,
        background: theme.palette.background.workSpace,
        height: 'auto',
        paddingBottom: theme.spacing(1),
        [theme.breakpoints.up('md')]: {
            height: 'calc(100vh - 112px)',
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
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        height: 'auto',
        paddingBottom: theme.spacing(1),
        [theme.breakpoints.up('xs')]: {
            height: 'calc(100vh - 200px)',
            overflow: 'auto'
        },
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
    origin: {
        marginTop: 10,
        marginBottom: 10,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 4,
        cursor: 'pointer',
        userSelect: 'none',
        backgroundColor: theme.palette.background.design,
        '&:hover': {
            boxShadow: '0px 0px 10px 0 #bcc3d6',
            background: theme.palette.background.designHover,
        },
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

    const handleOpenDesign = (design) =>{
        if(!authState.user) return enqueueSnackbar('Debe ingresar sesión para poder realizar esta acción.', { variant: 'error', autoHideDuration: 2000 });
        const inDesign = design.privileges.find(privilege => authState.user.uid === privilege.user._id);
        if (inDesign) {
            const typePrivilegeEditor = design.privileges.find(privilege => authState.user.uid === privilege.user._id && privilege.type === 0);
            if (typePrivilegeEditor) {
                history.push(`/designs/${design._id}`);
            } else {
                history.push(`/designs/reader/${design._id}`);
            }
        } else if(design.metadata.isPublic){
            history.push(`/designs/reader/${design._id}`);
        } else {
            enqueueSnackbar('Usted no tiene acceso a este diseño.', { variant: 'error', autoHideDuration: 2000 });
        }
    };

    const handleOpenUserProfile = (design) => {
        if(!authState.user) return enqueueSnackbar('Debe ingresar sesión para poder realizar esta acción.', { variant: 'error', autoHideDuration: 2000 });
        history.push(`/profile/${design.owner._id}`);
    };
    
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
            <Grid container className={classes.root}>
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
                                        <Typography variant="body2"> { metadata.workingTime.hours } (hrs) : {metadata.workingTime.minutes} (min)</Typography>
                                        <Divider/>
                                    </>
                                )
                            }
                        </Grid>
                        <Grid>
                            { metadata && metadata.workingTimeDesign &&(
                                    <>
                                        <Typography variant="body2" color='textSecondary' className={classes.textLefPanelMetadata}>Tiempo de trabajo Diseño</Typography>
                                        <Typography variant="body2"> {metadata.workingTimeDesign.hours} (hrs) : {metadata.workingTimeDesign.minutes} (min)</Typography>
                                        <Divider/>
                                    </>
                                )
                            }
                        </Grid>
                        <Grid>
                            { metadata && metadata.classSize &&(
                                    <>
                                        <Typography variant='body2' color='textSecondary' className={classes.textLefPanelMetadata}> Tamaño de la clase </Typography>
                                        <Typography variant='body2'> { metadata.classSize } </Typography>
                                        <Divider/>
                                    </>
                                )
                            }
                        </Grid>
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
                            {metadata && metadata.scoreMean !== null && (
                                <>
                                    <Typography variant='body2' color='textSecondary' className={classes.textLefPanelMetadata}> Valoración media (0 - 5) </Typography>
                                    <Box display='flex' justifyContent='flex-start' alignItems='center'>
                                        { metadata.scoreMean }
                                    </Box>
                                    <Divider />
                                </>
                            )
                            }
                        </Grid>
                        <Grid>
                            { metadata && metadata.results &&(
                                    <>
                                        { metadata.results.map((result, i) => 
                                            <div key={`learning-result-${i}`}> 
                                                <Typography color={'textSecondary'}>Resultado de aprendizaje {i + 1}</Typography>
                                                <Typography>{result.description}</Typography>
                                            </div>
                                        )}
                                        <Divider/>
                                    </>
                                )
                            }
                        </Grid>
                        <Grid>
                            {design.origin && (
                                <>
                                    <Typography variant='body2' color='textSecondary' className={classes.textLeftPanelMetadata}> Derivado del diseño: </Typography>
                                    <Card className={classes.origin} elevation={0}>
                                        <CardActionArea onClick={()=>handleOpenDesign(design.origin)}>
                                            <Box style={{ display: 'flex', alignItems: 'center', padding: 5 }}>
                                                <Description style={{ marginBottom: 5 }} />
                                                <Typography style={{ marginLeft: 10 }} variant='body2'>{design.origin.metadata.name}</Typography>
                                            </Box>
                                        </CardActionArea>
                                        <Divider />
                                        <CardActionArea onClick={()=>handleOpenUserProfile(design.origin)}>
                                            <Box style={{ display: 'flex', alignItems: 'center', padding: 5 }}>
                                                <Avatar
                                                    style={{ width: 25, height: 25, fontSize: 15 }}
                                                    alt={formatName(design.origin.owner.name, design.origin.owner.lastname)}
                                                    src={design.origin.owner.img && design.origin.owner.img.length > 0 ? `${process.env.REACT_APP_URL}uploads/users/${design.origin.owner.img}` : ''}
                                                >
                                                    {getUserInitials(design.origin.owner.name, design.origin.owner.lastname)}
                                                </Avatar>
                                                <Typography style={{ marginLeft: 10 }} variant='body2'>{formatName(design.origin.owner.name, design.origin.owner.lastname)}</Typography>
                                            </Box>
                                        </CardActionArea>

                                    </Card>
                                </>
                            )
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
