import React, { useState } from 'react';
import { Button, Checkbox, Divider, FormControlLabel, Grid, IconButton, makeStyles, TextField, Typography } from '@material-ui/core';
import { LeftPanel } from 'pages/Navigation/LeftPanel';
import { useInfiniteQuery, useQuery } from 'react-query';
import { getCategories } from 'services/CategoryService';
import { getPublicFilteredDesigns } from 'services/DesignService';
import { DesignsContainer } from 'components/DesignsContainer';
import { Close } from '@material-ui/icons';
import { KeywordManager } from 'components/KeywordManager';
import { Skeleton } from '@material-ui/lab';

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
    searchContainer: {
        display: 'flex',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 15,
    },
    input: {
        height: 40,
        '& fieldset': {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
        }
    },
    button: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        height: 40,
    },
    keywordFilter: {
        paddingLeft: 0,
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
    }
}));

export const PublicRepositoryPage = () => {
    const classes = useStyles();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');
    const [categoriesFilter, setCategoriesFilter] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const categoriesQuery = useQuery('categories', async () => {
        const resp = await getCategories();
        setCategoriesFilter(resp.categories.map(category => ({ ...category, selected: false })));
        return resp;
    }, { refetchOnWindowFocus: false });

    const designsQuery = useInfiniteQuery(['filtered-designs', filter, ...keywords, ...categoriesFilter], async ({ pageParam = 0 }) => {
        const resp = await getPublicFilteredDesigns(search, keywords, categoriesFilter.filter(c => c.selected), pageParam);
        return resp;
    }, {
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage, pages) => {
            if(lastPage.nPages === pages.length) return undefined; 
            return lastPage.from;
        },
    });

    const handleChangeKeywords = (keywords, type, targetKeyword) => {
        setKeywords(keywords);
    };

    const handleSearch = () => {
        setFilter(search);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSearch();
    };

    const handleToggleCategory = (index) => {
        const categories = [...categoriesFilter];
        categories[index].selected = !categories[index].selected;
        setCategoriesFilter(categories);
        handleSearch();
    };

    const handleClearSearch = () => {
        setSearch('');
        setFilter('');
    };

    const categoriesSkeletonsList = () => {
        return [...Array(10).keys()].map((index) => (
            <div key={`category-skeleton-${index}`} style={{margin: 10, display: 'flex', alignItems: 'center'}}>
                <Skeleton style={{borderRadius: 4, marginRight: 5 }} variant="rect" height={20} width={20} animation='wave'/>
                <div style={{width: '100%'}}>
                    <Skeleton style={{borderRadius: 4}} variant="rect" height={20} animation='wave'/>
                </div>
            </div>
        ));
    };

    return (
        <>
            <Grid container>
                <Grid item xs={12} md={3} lg={2} className={classes.leftPanel}>
                    <LeftPanel />
                    <Typography style={{ marginTop: 20, marginLeft: 20 }}>Categorías</Typography>
                    <div className={classes.categoriesContainer}>
                        {
                            categoriesQuery.isLoading
                                ? categoriesSkeletonsList()
                                : categoriesFilter && categoriesFilter.map((category, index) => (
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
                    <form onSubmit={handleSubmit} className={classes.searchContainer}>
                        <TextField
                            className={classes.input}
                            size='small'
                            variant='outlined'
                            value={search}
                            onChange={({ target }) => setSearch(target.value)}
                            label='Nombre/Propietario'
                            onBlur={handleSearch}
                            placeholder='Ingresa el nombre o propietario para buscar diseños'
                            InputProps={{
                                endAdornment:
                                    search.trim().length ?(<IconButton
                                        size='small'
                                        onClick={handleClearSearch}
                                        onMouseDown={(e)=>e.preventDefault()}
                                    >
                                        {<Close /> }
                                    </IconButton>) : (<div></div>)

                            }}
                            fullWidth
                        />
                        <Button
                            className={classes.button}
                            variant='contained' 
                            color='primary'
                            type='submit'
                            disableElevation
                        >
                            Buscar
                        </Button>
                    </form>
                    <KeywordManager keywords={keywords} onChangeKeywords={handleChangeKeywords}/>
                    <div className={classes.sectionTitle}>
                        <Typography variant='h4'>Repositorio Público</Typography>
                        <Divider />
                        {
                            (categoriesQuery.isError) 
                                ? <Typography>{categoriesQuery.error.message}</Typography>
                                : (designsQuery.isError) 
                                    ? <Typography>{designsQuery.error.message}</Typography>
                                    : <DesignsContainer {...designsQuery} label='public-repository'/>
                        }                        
                    </div>
                </Grid>
                <Grid item xs={12} md={3} lg={2} className={classes.rightPanel}></Grid>
            </Grid>
        </>
    );
};