import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Button, Divider, FormControl, FormControlLabel, Grid, InputLabel, Link, makeStyles, MenuItem, Select, Switch, TextField, Typography } from '@material-ui/core'
import { useQuery } from 'react-query';
import { Alert } from '@material-ui/lab';
import { useForm } from 'hooks/useForm';
import { useSocketState } from 'contexts/SocketContext';
import TimeFormatter from 'utils/timeFormatters';
import { getCategories } from 'services/CategoryService';
import { LearningResult } from 'pages/DesignPage/Metadata/LearningResult';
import { LearningResultModal } from 'pages/DesignPage/Metadata/LearningResultModal';
import { useDesignState } from 'contexts/design/DesignContext';
import { useUiState } from 'contexts/ui/UiContext';
import types from 'types';
import { useAuthState } from 'contexts/AuthContext';
import { SharedTextFieldTipTapEditor } from 'components/SharedTextFieldTipTapEditor';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
    leftPanel: {
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    workspace: {
        paddingTop: 15,
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
    title: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    content: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 10,
    },
    grid: {
        display: 'flex',
        alignItems: 'center',
    },
    category: {
        width: '100%',
    },
    categoryPopOver: {
        maxHeight: 400,
    },
    timeField: {
        marginRight: 10,
        display: 'flex',
        alignItems: 'center',
    },
    clickHere: {
        textDecoration: 'none',
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'underline'
        }
    }
}));

export const DesignMetadata = forwardRef((props, ref) => {
    const classes = useStyles();
    const { socket/*, online*/ } = useSocketState();
    const { authState } = useAuthState();
    const isMounted = useRef(true);
    const { uiState, dispatch } = useUiState();
    const { designState } = useDesignState();
    const { design } = designState;
    const { metadata } = design;
    const { enqueueSnackbar } = useSnackbar();
    const nameRef = useRef();
    const classSizeRef = useRef();
    const hoursRef = useRef();
    const minutesRef = useRef();
    const priorKnowledgeRef = useRef();
    const descriptionRef = useRef();
    const objectiveRef = useRef();

    const [form, handleInputChange, , setValues] = useForm({
        name: metadata.name,
        category: metadata.category.name ?? 'Sin categoría',
        classSize: metadata.classSize,
        workingTimeDesignHours: TimeFormatter.toHoursAndMinutes(metadata.workingTimeDesign)[0],
        workingTimeDesignMinutes: TimeFormatter.toHoursAndMinutes(metadata.workingTimeDesign)[1],
        workingTimeHours: metadata.workingTime.hours ?? 0,
        workingTimeMinutes: metadata.workingTime.minutes ?? 0,
        priorKnowledge: metadata.priorKnowledge,
        description: metadata.description,
        objective: metadata.objective,
        isPublic: metadata.isPublic
    });



    useImperativeHandle(
        ref,
        () => ({
            clearEditors: () => {
                nameRef?.current.clearText();
                classSizeRef?.current.clearText();
                hoursRef?.current.clearText();
                minutesRef?.current.clearText();
                priorKnowledgeRef?.current.clearText();
                descriptionRef?.current.clearText();
                objectiveRef?.current.clearText();
            }
        }),
    );

    useEffect(()=>{
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (isMounted.current){
            if(form.category !== metadata.category.name){
                setValues((prevState)=>({
                    ...prevState,
                    category: metadata.category.name ?? 'Sin categoría',
                }));
            }
        }
    }, [metadata.category, form.category, setValues]);

    useEffect(() => {
        if(isMounted.current){
            if(form.name !== metadata.name){
                setValues((prevState)=>({
                    ...prevState,
                    name: metadata.name,
                }));
            }
        }
    }, [metadata.name, form.name, setValues]);

    useEffect(() => {
        if(isMounted.current){
            if(form.classSize !== metadata.classSize){
                setValues((prevState)=>({
                    ...prevState,
                    classSize: metadata.classSize,
                }));
            }
        }
    }, [metadata.classSize, form.classSize, setValues]);

    useEffect(() => {
        if(isMounted.current){
            if(form.description !== metadata.description){
                setValues((prevState)=>({
                    ...prevState,
                    description: metadata.description,
                }));
            }
        }
    }, [metadata.description, form.description, setValues]);

    useEffect(() => {
        if(isMounted.current){
            if(form.workingTimeDesignHours !== TimeFormatter.toHoursAndMinutes(metadata.workingTimeDesign)[0]){
                setValues((prevState)=>({
                    ...prevState,
                    workingTimeDesignHours: TimeFormatter.toHoursAndMinutes(metadata.workingTimeDesign)[0],
                }));
            }
        }
    }, [metadata.workingTimeDesign, form.workingTimeDesignHours, setValues]);

    useEffect(() => {
        if(isMounted.current){
            if(form.workingTimeDesignMinutes !== TimeFormatter.toHoursAndMinutes(metadata.workingTimeDesign)[1]){
                setValues((prevState)=>({
                    ...prevState,
                    workingTimeDesignMinutes: TimeFormatter.toHoursAndMinutes(metadata.workingTimeDesign)[1],
                }));
            }
        }
    }, [metadata.workingTimeDesign, form.workingTimeDesignMinutes, setValues]);

    useEffect(() => {
        if(isMounted.current){
            if(form.workingTimeHours !== metadata.workingTime.hours){
                setValues((prevState)=>({
                    ...prevState,
                    workingTimeHours: metadata.workingTime.hours ?? 0,
                }));
            }
        }
    }, [metadata.workingTime.hours, form.workingTimeHours, setValues]);

    useEffect(() => {
        if(isMounted.current){
            if(form.workingTimeMinutes !== metadata.workingTime.minutes){
                setValues((prevState)=>({
                    ...prevState,
                    workingTimeMinutes: metadata.workingTime.minutes ?? 0,
                }));
            }
        }
    }, [metadata.workingTime.minutes, form.workingTimeMinutes, setValues]);

    useEffect(() => {
        if(isMounted.current){
            if(form.priorKnowledge !== metadata.priorKnowledge){
                setValues((prevState)=>({
                    ...prevState,
                    priorKnowledge: metadata.priorKnowledge,
                }));
            }
        }
    }, [metadata.priorKnowledge, form.priorKnowledge, setValues]);

    useEffect(() => {
        if(isMounted.current){
            if(form.objective !== metadata.objective){
                setValues((prevState)=>({
                    ...prevState,
                    objective: metadata.objective,
                }));
            }
        }
    }, [metadata.objective, form.objective, setValues]);

    useEffect(() => {
        if(isMounted.current){
            if(form.isPublic !== metadata.isPublic){
                setValues((prevState)=>({
                    ...prevState,
                    isPublic: metadata.isPublic,
                }));
            }
        }
    }, [metadata.isPublic, form.isPublic, setValues]);
    
    const { name, category, classSize, workingTimeDesignHours, workingTimeDesignMinutes, workingTimeHours, workingTimeMinutes, priorKnowledge, description, objective, isPublic } = form;
    
    const { isLoading, isError, data, error } = useQuery('categories', async () => {
        return await getCategories();
    }, { refetchOnWindowFocus: false });

    if (isError) {
        return (<Typography>{error.message}</Typography>);
    }

    if (isLoading) {
        return (<Typography>Cargando...</Typography>);
    }

    const createCategoryList = () => {
        if (data == null || data.categories.length === 0) return (<MenuItem value='Sin categoría'>Sin categoría</MenuItem>);
        return data.categories.map(c => <MenuItem key={c._id} value={c.name}>{c.name}</MenuItem>);
    };

    const handleChangeMetadataField = ({target}) => {
        let { name: field, value } = target;
        value = (target.type === 'number' && !isNaN(target.value)) ? parseInt(target.value) : (target.type === 'checkbox') ? target.checked : target.value;
        let e = { target: { name: target.name, value } };
        let subfield = null;
        switch (field) {
            case 'workingTimeHours':
                field = 'workingTime';
                subfield = 'hours';
                value = isNaN(value) ? 0 : value;
                break;
            case 'workingTimeMinutes':
                field = 'workingTime';
                subfield = 'minutes';
                value = isNaN(value) ? 0 : value;
                break;
            case 'category':
                value = data.categories.find(c => c.name === value);
                break;
            default:
                break;
        }
        socket.emit('edit-metadata-field', { designId: design._id, field, value, subfield });
        handleInputChange(e);
    };

    const handleSaveDesign = (e) => {
        socket.emit('save-design', { designId: design._id });
        enqueueSnackbar('Su diseño se ha guardado correctamente',  {variant: 'success', autoHideDuration: 2000}); 
    };

    const handleOpenLearningResultmodal = () => dispatch({
        type: types.ui.toggleModal,
        payload: 'LearningResult',
    });

    return (
        <>
            <Grid container key={design._id}>
                <Grid item xs={12} md={3} lg={2} className={classes.leftPanel}></Grid>
                <Grid item xs={12} md={6} lg={8} className={classes.workspace}>
                    <div className={classes.title}>
                        <Typography variant='h4'>Información Diseño</Typography>
                        <Button variant='outlined' color='default' onClick={handleSaveDesign}>Guardar Información</Button>
                    </div>
                    <Divider />
                    <Grid container spacing={3} className={classes.content}>
                        
                        <Grid item className={classes.grid} xs={12} sm={9}  >
                            <SharedTextFieldTipTapEditor 
                                ref={nameRef}
                                name='name' 
                                placeholder='Nombre'
                                initialvalue={name}
                                onChange={handleChangeMetadataField}
                            />
                        </Grid>
                        <Grid item className={classes.grid} xs={12} sm={3}>
                            <div>
                                <Typography variant='body2'>Visibilidad</Typography>
                                <FormControlLabel
                                    control={<Switch 
                                        name='isPublic' 
                                        checked={isPublic} 
                                        onChange={handleChangeMetadataField} 
                                        disabled={!(design.owner === authState.user.uid)}
                                    />}
                                    label={isPublic ? 'Público' : 'Privado'}
                                />
                            </div>
                        </Grid>
                        <Grid item className={classes.grid} xs={12} md={12} lg={6}>
                            <FormControl className={classes.category} variant='outlined' >
                                <InputLabel id="category-label">Categoría</InputLabel>
                                <Select
                                    labelId="category-label"
                                    name='category'
                                    label='Categoría'
                                    value={category}
                                    onChange={handleChangeMetadataField}
                                    MenuProps={{ classes: { paper: classes.categoryPopOver } }}
                                >
                                    {createCategoryList()}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item className={classes.grid} xs={12} md={12} lg={6}>
                            <SharedTextFieldTipTapEditor 
                                ref={classSizeRef}
                                name='classSize' 
                                placeholder='Tamaño de la clase'
                                initialvalue={classSize ?? 0}
                                type="number"
                                min={0}
                                onChange={handleChangeMetadataField}
                            />
                        </Grid>
                        <Grid item className={classes.grid} xs={12} md={12} lg={6}>
                            <div style={{ width: '100%' }}>
                                <Typography > Tiempo de trabajo </Typography>
                                <div className={classes.timeField}>
                                    <SharedTextFieldTipTapEditor 
                                        ref={hoursRef}
                                        name='workingTimeHours' 
                                        placeholder='Horas'
                                        initialvalue={workingTimeHours}
                                        type="number"
                                        min={0}
                                        onChange={handleChangeMetadataField}
                                    />
                                    <Typography style={{ marginLeft: 10, marginRight: 10 }}> : </Typography>
                                    <SharedTextFieldTipTapEditor 
                                        ref={minutesRef}
                                        name='workingTimeMinutes' 
                                        placeholder='Minutos'
                                        initialvalue={workingTimeMinutes}
                                        type="number"
                                        min={0}
                                        max={59}
                                        onChange={handleChangeMetadataField}
                                    />
                                </div>
                            </div>
                        </Grid>
                        <Grid item className={classes.grid} xs={12} md={12} lg={6}>
                            <div style={{ width: '100%' }}>
                                <Typography > Tiempo diseñado </Typography>
                                <div className={classes.timeField}>
                                    <TextField
                                        //margin="dense"
                                        variant="outlined"
                                        name="workingTimeDesignHours"
                                        value={workingTimeDesignHours}
                                        label="Horas"
                                        type="number"
                                        disabled
                                        fullWidth
                                    />
                                    <Typography style={{ marginLeft: 10, marginRight: 10 }}> : </Typography>
                                    <TextField
                                        //margin="dense"
                                        variant="outlined"
                                        name="workingTimeDesignMinutes"
                                        value={workingTimeDesignMinutes}
                                        label="Minutos"
                                        type="number"
                                        disabled
                                        fullWidth
                                    />
                                </div>
                            </div>
                        </Grid>
                        <Grid item className={classes.grid} xs={12}>
                            <SharedTextFieldTipTapEditor 
                                ref={descriptionRef}
                                name='description' 
                                placeholder='Descripción'
                                initialvalue={description ?? ''}
                                onChange={handleChangeMetadataField}
                                rowMax={5}
                                multiline
                            />
                        </Grid>
                        <Grid item className={classes.grid} xs={12} md={12} lg={6}>
                            <SharedTextFieldTipTapEditor 
                                ref={priorKnowledgeRef}
                                name='priorKnowledge' 
                                placeholder='Conocimiento previo'
                                initialvalue={priorKnowledge ?? ''}
                                onChange={handleChangeMetadataField}
                                rowMax={5}
                                multiline
                            />
                        </Grid>
                        <Grid item className={classes.grid} xs={12} md={12} lg={6}>
                            <SharedTextFieldTipTapEditor 
                                ref={objectiveRef}
                                name='objective' 
                                placeholder='Objetivos'
                                initialvalue={objective ?? ''}
                                onChange={handleChangeMetadataField}
                                rowMax={5}
                                multiline
                            />
                        </Grid>
                    </Grid>
                    <div className={classes.title}>
                        <Typography variant='h4'>Resultados de aprendizaje</Typography>
                        <Button variant='outlined' color='default' onClick={handleOpenLearningResultmodal}>Agregar</Button>
                    </div>
                    <Divider />
                    <div className={classes.content}>
                        {
                            metadata.results.length === 0
                                ? <Alert severity="info" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                    Este diseño aún no tiene resultados de aprendizaje. Agrega el primer resultado de aprendizaje haciendo click {' '}
                                    {<Link className={classes.clickHere} onClick={handleOpenLearningResultmodal}>aquí</Link>}
                                    !
                                </Alert>
                                : metadata.results.map((result, index) => (
                                    <LearningResult key={`learning-result-${index}`} index={index} {...result} />
                                ))

                        }
                    </div>
                </Grid>
                <Grid item xs={12} md={3} lg={2} className={classes.rightPanel}></Grid>
            </Grid> 
            <LearningResultModal design={design} isOpen={uiState.isLearningResultModalOpen}/>
        </>
    )
})
