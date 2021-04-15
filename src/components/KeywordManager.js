import React, { useState } from 'react';
import { Box, Button, Chip, makeStyles, TextField } from '@material-ui/core';
import { useHorizontalScroll } from 'hooks/useHorizontalScroll';

const useStyles = makeStyles((theme) => ({
    keywordList: {
        width: '100%',
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

export const KeywordManager = ({ keywords, onChangeKeywords }) => {
    const classes = useStyles();
    const [keyword, setKeyword] = useState('');
    const [keywordError, setKeywordError] = useState(null);
    const scrollRef = useHorizontalScroll();

    const handleAddKeyword = (e) => {
        e.preventDefault();
        if(keyword.trim().length && !keywords.includes(keyword.toLowerCase())){
            onChangeKeywords([...keywords, keyword.toLowerCase()], 'add', keyword.toLowerCase());
            setKeyword('');
        } else if (keywords.includes(keyword.toLowerCase())){
            setKeywordError('La palabra clave ya se encuentra agregada al filtro.');
        }
    };

    const handleRemoveKeyword = (index) => {
        if(index === keywords.length - 1) onChangeKeywords([...keywords.slice(0, index)], 'remove', keywords[index]);
        else onChangeKeywords([...keywords.slice(0, index), ...keywords.slice(index + 1, keywords.length)], 'remove', keywords[index]);
    };

    const handleKeywordInputChange = ({ target }) => {
        setKeyword(target.value);
        if(keywordError) setKeywordError(null);
    };

    return (
        <Box ref={scrollRef} component='ul' className={classes.keywordFilter}>
            <form onSubmit={handleAddKeyword} className={classes.searchContainer}>
                <TextField
                    className={classes.input}
                    size='small'
                    variant='outlined'
                    value={keyword}
                    onChange={handleKeywordInputChange}
                    label='Palabra Clave'
                    error={!!keywordError}
                    helperText={keywordError}
                    fullWidth
                />
                <Button variant='contained' disableElevation color='primary' type='submit' className={classes.button} >
                    Agregar
                </Button>
            </form>
            <div className={classes.keywordList}>
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
            </div>
        </Box>
    )
}
