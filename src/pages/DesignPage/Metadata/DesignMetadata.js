import React, { useEffect, useState } from 'react';
import { Button, Divider, FormControl, FormControlLabel, Grid, InputLabel, makeStyles, MenuItem, Select, Switch, TextField, Typography } from '@material-ui/core'
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
import { types } from 'types/types';

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
}));

export const DesignMetadata = () => {
    const classes = useStyles();
    const { socket/*, online*/ } = useSocketState();
    const { uiState, dispatch } = useUiState();
    const { designState } = useDesignState();
    const { design } = designState;
    const { metadata } = design;
    const [verb, setVerb] = useState('');
    const [_description, setDescription] = useState('');

    const [form, handleInputChange, , setValues] = useForm({
        name: metadata.name,
        category: metadata.category ? metadata.category.name : 'Sin categoría',
        classSize: metadata.classSize,
        workingTimeDesignHours: TimeFormatter.toHoursAndMinutes(metadata.workingTimeDesign)[0],
        workingTimeDesignMinutes: TimeFormatter.toHoursAndMinutes(metadata.workingTimeDesign)[1],
        workingTimeHours: TimeFormatter.toHoursAndMinutes(metadata.workingTime)[0],
        workingTimeMinutes: TimeFormatter.toHoursAndMinutes(metadata.workingTime)[1],
        priorKnowledge: metadata.priorKnowledge,
        description: metadata.description,
        objective: metadata.objective,
        isPublic: metadata.isPublic
    });

    useEffect(() => {
        setValues({
            name: metadata.name,
            category: metadata.category ? metadata.category.name : 'Sin categoría',
            classSize: metadata.classSize,
            workingTimeDesignHours: TimeFormatter.toHoursAndMinutes(metadata.workingTimeDesign)[0],
            workingTimeDesignMinutes: TimeFormatter.toHoursAndMinutes(metadata.workingTimeDesign)[1],
            workingTimeHours: TimeFormatter.toHoursAndMinutes(metadata.workingTime)[0],
            workingTimeMinutes: TimeFormatter.toHoursAndMinutes(metadata.workingTime)[1],
            priorKnowledge: metadata.priorKnowledge,
            description: metadata.description,
            objective: metadata.objective,
            isPublic: metadata.isPublic
        });
    }, [design, setValues, metadata]);
    
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

    const editDesign = ({ target }) => {
        if (target.name === 'workingTimeHours' || target.name === 'workingTimeMinutes') {
            socket.emit('edit-metadata-field', { designId: design._id, field: 'workingTime', value: TimeFormatter.toMinutes(workingTimeHours, workingTimeMinutes) });
        } else {
            socket.emit('edit-metadata-field', { designId: design._id, field: target.name, value: form[target.name] });
        }
    };
    const handleClose = (e) => {
        setVerb('');
        setDescription('');
        dispatch({
            type: types.ui.toggleModal,
            payload: 'LearningResult',
        });
    };

    const handleChangeCategory = (e) => {
        handleInputChange(e);
        socket.emit('edit-metadata-field', { designId: design._id, field: e.target.name, value: data.categories.find(c => c.name === e.target.value) });
    };

    const handleTogglePublic = (e) => {
        handleInputChange({ target: { value: e.target.checked, name: e.target.name } });
        socket.emit('edit-metadata-field', { designId: design._id, field: e.target.name, value: e.target.checked });
    };

    const handleSaveDesign = (e) => {
        socket.emit('save-design', { designId: design._id });
    };

    const handleEdit = (verb, description) => {
        setVerb(verb);
        setDescription(description);
        dispatch({
            type: types.ui.toggleModal,
            payload: 'LearningResult',
        });
    };

    const handleDelete = (verb, description) => {
        let index = 0;
        design.metadata.results.forEach((result, _index) => {
            if (result.verb === verb && result.description === description) index = _index;
        });
        socket.emit('delete-learning-result', { designId: design._id, index });
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
                                margin="dense"
                                variant="outlined"
                                name="name"
                                value={name}
                                onChange={handleInputChange}
                                label="Nombre"
                                type="text"
                                onBlur={editDesign}
                                fullWidth
                            />
                        </Grid>
                        <Grid item className={classes.grid} xs={12} sm={3}>
                            <div>
                                <Typography variant='body2'>Visibilidad</Typography>
                                <FormControlLabel
                                    control={<Switch name='isPublic' checked={isPublic} onChange={handleTogglePublic} />}
                                    label={isPublic ? 'Público' : 'Privado'}
                                />
                            </div>
                        </Grid>
                        <Grid item className={classes.grid} xs={12} md={12} lg={6}>
                            <FormControl className={classes.category} variant='outlined' size='small'>
                                <InputLabel id="category-label">Categoría</InputLabel>
                                <Select
                                    labelId="category-label"
                                    name='category'
                                    label='Categoría'
                                    value={category}
                                    onChange={handleChangeCategory}
                                    MenuProps={{ classes: { paper: classes.categoryPopOver } }}
                                >
                                    {createCategoryList()}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item className={classes.grid} xs={12} md={12} lg={6}>
                            <TextField
                                margin='dense'
                                variant="outlined"
                                name="classSize"
                                value={classSize ?? 0}
                                onChange={handleInputChange}
                                label="Tamaño de la clase"
                                onBlur={editDesign}
                                type="number"
                                inputProps={{
                                    min: 0
                                }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item className={classes.grid} xs={12} md={12} lg={6}>
                            <div style={{ width: '100%' }}>
                                <Typography > Tiempo de trabajo </Typography>
                                <div className={classes.timeField}>
                                    <TextField
                                        margin="dense"
                                        variant="outlined"
                                        name="workingTimeHours"
                                        value={workingTimeHours}
                                        onChange={handleInputChange}
                                        label="Horas"
                                        type="number"
                                        onBlur={editDesign}
                                        inputProps={{
                                            min: 0,
                                            max: 59
                                        }}
                                        fullWidth
                                    />
                                    <Typography style={{ marginLeft: 10, marginRight: 10 }}> : </Typography>
                                    <TextField
                                        margin="dense"
                                        variant="outlined"
                                        name="workingTimeMinutes"
                                        value={workingTimeMinutes}
                                        onChange={handleInputChange}
                                        label="Minutos"
                                        type="number"
                                        onBlur={editDesign}
                                        inputProps={{
                                            min: 0,
                                            max: 59
                                        }}
                                        fullWidth
                                    />
                                </div>
                            </div>
                        </Grid>
                        <Grid item className={classes.grid} xs={12} md={12} lg={6}>
                            <div style={{ width: '100%' }}>
                                <Typography > Tiempo diseñado </Typography>
                                <div className={classes.timeField}>
                                    <TextField
                                        margin="dense"
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
                                        margin="dense"
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
                                multiline
                                rows={6}
                                variant="outlined"
                                name="description"
                                value={description ?? ''}
                                onChange={handleInputChange}
                                label="Descripción"
                                onBlur={editDesign}
                                type="text"
                                fullWidth
                            />
                        </Grid>
                        <Grid item className={classes.grid} xs={12} md={12} lg={6}>
                            <TextField
                                label="Conocimiento previo"
                                multiline
                                rows={6}
                                name="priorKnowledge"
                                value={priorKnowledge ?? ''}
                                onChange={handleInputChange}
                                onBlur={editDesign}
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        <Grid item className={classes.grid} xs={12} md={12} lg={6}>
                            <TextField
                                multiline
                                rows={6}
                                variant="outlined"
                                name="objective"
                                value={objective ?? ''}
                                onChange={handleInputChange}
                                label="Objetivos"
                                onBlur={editDesign}
                                type="text"
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    <div className={classes.title}>
                        <Typography variant='h4'>Resultados de aprendizaje</Typography>
                        <Button variant='outlined' color='default' onClick={() => dispatch({
                                type: types.ui.toggleModal,
                                payload: 'LearningResult',
                            })}>Agregar</Button>
                    </div>
                    <Divider />
                    <div className={classes.content}>
                        {
                            metadata.results.length === 0
                                ? <Alert severity="info" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                    Este diseño aún no tiene resultados de aprendizaje. Agrega el primer resultado de aprendizaje haciendo click aquí!
                                </Alert>
                                : metadata.results.map((result, index) => (
                                    <LearningResult key={`learning-result-${index}`} {...result} handleEdit={handleEdit} handleDelete={handleDelete} />
                                ))

                        }
                    </div>
                </Grid>
                <Grid item xs={12} md={3} lg={2} className={classes.rightPanel}></Grid>
            </Grid>
            <LearningResultModal design={design} isOpen={uiState.isLearningResultModalOpen} handleClose={handleClose} _verb={verb} _description={_description} />
        </>
    )
}
