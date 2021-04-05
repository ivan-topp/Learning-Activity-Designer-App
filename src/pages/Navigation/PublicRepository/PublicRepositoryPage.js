import React, { useState } from 'react';
import { Button, Checkbox, Chip, Divider, FormControlLabel, Grid, makeStyles, Paper, TextField, Typography } from '@material-ui/core';
import { LeftPanel } from 'pages/Navigation/LeftPanel';
import { useQuery } from 'react-query';
import { getCategories } from 'services/CategoryService';
import { useHorizontalScroll } from 'hooks/useHorizontalScroll';

const useStyles = makeStyles((theme) => ({
    leftPanel: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'stretch',
        borderRight: `1px solid ${theme.palette.divider}`,
        position: 'relative',
        [theme.breakpoints.up('sm')]: {
            height: 'calc(100vh - 128px)',
        },
    },
    workspace: {
        paddingLeft: 30,
        paddingRight: 30,
        background: theme.palette.background.workSpace,
        minHeight: 'calc(100vh - 128px)',
    },
    rightPanel: {
        display: 'flex',
        flexDirection: 'column',
        borderLeft: `1px solid ${theme.palette.divider}`,
    },
    icon: {
        marginRight: 10,
    },
    sectionTitle: {
        marginTop: 20,
        marginBottom: 20,
    },
    category: {
        width: '100%',
        paddingLeft: 20,
    },
    categoriesContainer: {
        [theme.breakpoints.up('sm')]: {
            overflow: 'auto',
            overflowX: 'hidden',
        },
    },
    keywordList: {
        display: 'flex',
        justifyContent: 'flex-start',
        height: 48,
        mouseWheel: 'horizontal',
        overflowX: 'auto',
        overflowY: 'hidden',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: 0,
    },
    keyword: {
        margin: theme.spacing(0.5),
    },
    form: {
        display: 'flex',
        alignItems: 'center',
        marginTop: 20,
    },
    keywordInput: {
        height: 40,
        '& fieldset': {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
        }
    },
    addKeyword: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        height: 40,
    },
}));

export const PublicRepositoryPage = () => {
    const classes = useStyles();
    const [search, setSearch] = useState('');
    const [keyword, setKeyword] = useState('');
    const [categoriesFilter, setCategoriesFilter] = useState([]);
    const [keywords, setKeywords] = useState(['keyword 1']);
    const scrollRef = useHorizontalScroll();
    const { isLoading, isError, error } = useQuery('categories', async () => {
        const resp = await getCategories();
        const categories = resp.categories.slice(1);
        setCategoriesFilter(categories.map(category => ({ ...category, selected: false })));
        return resp;
    }, { refetchOnWindowFocus: false });

    if (isError) {
        return (<Typography>{error.message}</Typography>);
    }

    if (isLoading) {
        return (<Typography>Cargando...</Typography>);
    }

    const handleToggleCategory = (index) => {
        const categories = [...categoriesFilter];
        categories[index].selected = !categories[index].selected;
        setCategoriesFilter(categories);
    };

    const handleAddKeyword = (e) => {
        e.preventDefault();
        if(keyword.trim().length) setKeywords([...keywords, keyword]);
        setKeyword('');
    };

    const handleRemoveKeyword = (index) => {
        if(index === keywords.length - 1) setKeywords([...keywords.slice(0, index)]);
        else setKeywords([...keywords.slice(0, index), ...keywords.slice(index + 1, keywords.length)]);
    };

    return (
        <>
            <Grid container>
                <Grid item xs={12} md={3} lg={2} className={classes.leftPanel}>
                    <LeftPanel />
                    <Typography style={{ marginTop: 20, marginLeft: 20 }}>Categorías</Typography>
                    <div className={classes.categoriesContainer}>
                        {
                            categoriesFilter.map((category, index) => (
                                    <FormControlLabel
                                        className={classes.category}
                                        key={category._id}
                                        control={
                                            <Checkbox
                                                checked={category.selected}
                                                onChange={(e) => handleToggleCategory(index)}
                                            />
                                        }
                                        label={category.name}
                                    />
                                )
                            )
                        }
                    </div>
                </Grid>
                <Grid item xs={12} md={6} lg={8} className={classes.workspace}>
                    <div className={classes.sectionTitle}>
                        <Typography variant='h4'>Buscar Diseño</Typography>
                        <Divider />
                    </div>
                    <TextField
                        margin='dense'
                        variant='outlined'
                        value={search}
                        onChange={({ target }) => setSearch(target.value)}
                        label='Nombre/Propietario'
                        placeholder='Ingresa el nombre o propietario para buscar diseños'
                        fullWidth
                    />
                    <form onSubmit={handleAddKeyword} className={classes.form}>
                        <TextField
                            className={classes.keywordInput}
                            size='small'
                            variant='outlined'
                            value={keyword}
                            onChange={({ target }) => setKeyword(target.value)}
                            label='Palabra Clave'
                            placeholder='Ingresa el nombre o propietario para buscar diseños'
                            fullWidth
                        />
                        <Button variant='contained' disableElevation color='primary' type='submit' className={classes.addKeyword} >
                            Agregar
                        </Button>
                    </form>
                    <Paper ref={scrollRef} component='ul' className={classes.keywordList}>
                        {
                            keywords.map((keyword, index) => {
                                return (
                                    <li key={`keyword-${index}`}>
                                    <Chip
                                        label={keyword}
                                        onDelete={(e) => handleRemoveKeyword(index)}
                                        className={classes.keyword}
                                        />
                                    </li>
                                );
                            })
                        }
                    </Paper>
                    <div className={classes.sectionTitle}>
                        <Typography variant='h4'>Repositorio Público</Typography>
                        <Divider />
                    </div>
                </Grid>
                <Grid item xs={12} md={3} lg={2} className={classes.rightPanel}></Grid>
            </Grid>
        </>
    );
};