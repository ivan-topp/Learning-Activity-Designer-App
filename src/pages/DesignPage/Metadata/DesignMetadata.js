import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
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
import { KeywordManager } from 'components/KeywordManager';

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
        isPublic: metadata.isPublic,
        keywords: design.keywords ?? [],
    });

    useImperativeHandle(
        ref,
        () => ({
            clearEditors: () => {
                nameRef?.current?.clearText();
                classSizeRef?.current?.clearText();
                hoursRef?.current?.clearText();
                minutesRef?.current?.clearText();
                priorKnowledgeRef?.current?.clearText();
                descriptionRef?.current?.clearText();
                objectiveRef?.current?.clearText();
            }
        }),
    );

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const setKeywords = useCallback(
        (keywords) => {
            handleInputChange({ target: { name: 'keywords', value: keywords } });
        },
        [handleInputChange],
    );

    useEffect(() => {
        if (isMounted.current) {
            if (JSON.stringify(form.keywords) !== JSON.stringify(design.keywords)) {
                setKeywords([...design.keywords]);
            }
        }
    }, [design.keywords, form.keywords, setKeywords]);

    useEffect(() => {
        if (isMounted.current) {
            if (form.category !== metadata.category.name) {
                handleInputChange({target: {name: 'category', value: metadata.category.name ?? 'Sin categoría'}});
            }
        }
    }, [metadata.category, form.category, setValues, handleInputChange]);

    useEffect(() => {
        if (isMounted.current) {
            if (form.name !== metadata.name) {
                handleInputChange({target: {name: 'name', value: metadata.name}});
            }
        }
    }, [metadata.name, form.name, setValues, handleInputChange]);

    useEffect(() => {
        if (isMounted.current) {
            if (form.classSize !== metadata.classSize) {
                handleInputChange({target: {name: 'classSize', value: metadata.classSize}});
            }
        }
    }, [metadata.classSize, form.classSize, setValues, handleInputChange]);

    useEffect(() => {
        if (isMounted.current) {
            if (form.description !== metadata.description) {
                handleInputChange({target: {name: 'description', value: metadata.description}});
            }
        }
    }, [metadata.description, form.description, setValues, handleInputChange]);

    useEffect(() => {
        if (isMounted.current) {
            if (form.workingTimeDesignHours !== TimeFormatter.toHoursAndMinutes(metadata.workingTimeDesign)[0]) {
                handleInputChange({target: {name: 'workingTimeDesignHours', value: TimeFormatter.toHoursAndMinutes(metadata.workingTimeDesign)[0]}});
            }
        }
    }, [metadata.workingTimeDesign, form.workingTimeDesignHours, setValues, handleInputChange]);

    useEffect(() => {
        if (isMounted.current) {
            if (form.workingTimeDesignMinutes !== TimeFormatter.toHoursAndMinutes(metadata.workingTimeDesign)[1]) {
                handleInputChange({target: {name: 'workingTimeDesignMinutes', value: TimeFormatter.toHoursAndMinutes(metadata.workingTimeDesign)[1]}});
            }
        }
    }, [metadata.workingTimeDesign, form.workingTimeDesignMinutes, setValues, handleInputChange]);

    useEffect(() => {
        if (isMounted.current) {
            if (form.workingTimeHours !== metadata.workingTime.hours) {
                handleInputChange({target: {name: 'workingTimeHours', value: metadata.workingTime.hours ?? 0}});
            }
        }
    }, [metadata.workingTime.hours, form.workingTimeHours, setValues, handleInputChange]);

    useEffect(() => {
        if (isMounted.current) {
            if (form.workingTimeMinutes !== metadata.workingTime.minutes) {
                handleInputChange({target: {name: 'workingTimeMinutes', value: metadata.workingTime.minutes ?? 0}});
            }
        }
    }, [metadata.workingTime.minutes, form.workingTimeMinutes, setValues, handleInputChange]);

    useEffect(() => {
        if (isMounted.current) {
            if (form.priorKnowledge !== metadata.priorKnowledge) {
                handleInputChange({target: {name: 'priorKnowledge', value: metadata.priorKnowledge}});
            }
        }
    }, [metadata.priorKnowledge, form.priorKnowledge, setValues, handleInputChange]);

    useEffect(() => {
        if (isMounted.current) {
            if (form.objective !== metadata.objective) {
                handleInputChange({target: {name: 'objective', value: metadata.objective}});
            }
        }
    }, [metadata.objective, form.objective, setValues, handleInputChange]);

    useEffect(() => {
        if (isMounted.current) {
            if (form.isPublic !== metadata.isPublic) {
                handleInputChange({target: {name: 'isPublic', value: metadata.isPublic}});
            }
        }
    }, [metadata.isPublic, form.isPublic, setValues, handleInputChange]);

    const { name, category, classSize, workingTimeDesignHours, workingTimeDesignMinutes, workingTimeHours, workingTimeMinutes, priorKnowledge, description, objective, isPublic, keywords } = form;

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

    const handleChangeMetadataField = ({ target }) => {
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
        if(subfield){
            if (design.metadata[field][subfield].toString() !== value.toString()) handleInputChange(e);
        } else {
            if (design.metadata[field].toString() !== value.toString()) handleInputChange(e);
        }
        
    };

    const handleSaveDesign = (e) => {
        socket.emit('save-design', { designId: design._id });
        enqueueSnackbar('Su diseño se ha guardado correctamente', { variant: 'success', autoHideDuration: 2000 });
    };

    const handleOpenLearningResultmodal = () => dispatch({
        type: types.ui.toggleModal,
        payload: 'LearningResult',
    });

    const handleChangeKeywords = (keywords, type, targetKeyword) => {
        if (type === 'add') socket.emit('add-design-keyword', { designId: design._id, keyword: targetKeyword });
        else if (type === 'remove') socket.emit('remove-design-keyword', { designId: design._id, keyword: targetKeyword });
    };

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
                            <TextField
                                label='Nombre'
                                fullWidth
                                margin='none'
                                variant='outlined'
                                color='primary'
                                InputProps={{
                                    inputComponent: SharedTextFieldTipTapEditor,
                                    inputProps: {
                                        ref: nameRef,
                                        name: 'name',
                                        placeholder: 'Nombre',
                                        initialvalue: name,
                                        onChange: handleChangeMetadataField,
                                    }
                                }}
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
                            <TextField
                                label='Tamaño de la clase'
                                fullWidth
                                margin='none'
                                variant='outlined'
                                color='primary'
                                InputProps={{
                                    inputComponent: SharedTextFieldTipTapEditor,
                                    inputProps: {
                                        ref: classSizeRef,
                                        name: 'classSize',
                                        placeholder: 'Tamaño de la clase',
                                        initialvalue: classSize ?? 0,
                                        type: "number",
                                        min: 0,
                                        onChange: handleChangeMetadataField,
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item className={classes.grid} xs={12} md={12} lg={6}>
                            <div style={{ width: '100%' }}>
                                <Typography > Tiempo de trabajo </Typography>
                                <div className={classes.timeField}>
                                    <TextField
                                        label='Horas'
                                        fullWidth
                                        margin='none'
                                        variant='outlined'
                                        color='primary'
                                        InputProps={{
                                            inputComponent: SharedTextFieldTipTapEditor,
                                            inputProps: {
                                                ref: hoursRef,
                                                name: 'workingTimeHours',
                                                placeholder: 'Horas',
                                                initialvalue: workingTimeHours,
                                                type: "number",
                                                min: 0,
                                                onChange: handleChangeMetadataField,
                                            }
                                        }}
                                    />
                                    <Typography style={{ marginLeft: 10, marginRight: 10 }}> : </Typography>
                                    <TextField
                                        label='Minutos'
                                        fullWidth
                                        margin='none'
                                        variant='outlined'
                                        color='primary'
                                        InputProps={{
                                            inputComponent: SharedTextFieldTipTapEditor,
                                            inputProps: {
                                                ref: minutesRef,
                                                name: 'workingTimeMinutes',
                                                placeholder: 'Minutos',
                                                initialvalue: workingTimeMinutes,
                                                type: "number",
                                                min: 0,
                                                max: 59,
                                                onChange: handleChangeMetadataField,
                                            }
                                        }}
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
                            <TextField
                                label='Descripción'
                                fullWidth
                                margin='none'
                                variant='outlined'
                                color='primary'
                                InputProps={{
                                    inputComponent: SharedTextFieldTipTapEditor,
                                    inputProps: {
                                        ref: descriptionRef,
                                        name: 'description',
                                        placeholder: 'Descripción',
                                        initialvalue: description ?? '',
                                        rowMax: 5,
                                        onChange: handleChangeMetadataField,
                                        multiline: true,
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item className={classes.grid} xs={12} md={12} lg={6}>
                            <TextField
                                label='Conocimiento previo'
                                fullWidth
                                margin='none'
                                variant='outlined'
                                color='primary'
                                InputProps={{
                                    inputComponent: SharedTextFieldTipTapEditor,
                                    inputProps: {
                                        ref: priorKnowledgeRef,
                                        name: 'priorKnowledge',
                                        placeholder: 'Conocimiento previo',
                                        initialvalue: priorKnowledge ?? '',
                                        rowMax: 5,
                                        onChange: handleChangeMetadataField,
                                        multiline: true,
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item className={classes.grid} xs={12} md={12} lg={6}>
                            <TextField
                                label='Objetivos'
                                fullWidth
                                margin='none'
                                variant='outlined'
                                color='primary'
                                InputProps={{
                                    inputComponent: SharedTextFieldTipTapEditor,
                                    inputProps: {
                                        ref: objectiveRef,
                                        name: 'objective',
                                        placeholder: 'Objetivos',
                                        initialvalue: objective ?? '',
                                        rowMax: 5,
                                        onChange: handleChangeMetadataField,
                                        multiline: true,
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                    <KeywordManager keywords={keywords} onChangeKeywords={handleChangeKeywords} />
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
            <LearningResultModal design={design} isOpen={uiState.isLearningResultModalOpen} />
        </>
    )
})
