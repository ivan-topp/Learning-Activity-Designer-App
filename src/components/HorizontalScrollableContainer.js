import { Box, makeStyles } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { useHorizontalScroll } from 'hooks/useHorizontalScroll';
import React, { useRef, useState } from 'react';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        width: `100%`,
        display: 'flex',
        justifyContent: 'flex-start',
        mouseWheel: 'horizontal',
        overflowX: 'auto',
        overflowY: 'hidden',
        listStyle: 'none',
        paddingTop: theme.spacing(0.5),
        paddingBottom: theme.spacing(0.5),
        margin: 0,
        //scrollBehavior: 'smooth',
    },
    prev: {
        position: 'absolute',
        height: 'calc(100% - 0.6em)',
        width: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        left: 0,
        background: `linear-gradient(270deg, transparent, ${theme.palette.action.disabledBackground} 100%)`,
        '&:hover': {
            cursor: 'pointer',
            backgroundColor: theme.palette.action.hover,
        }
    },
    next: {
        position: 'absolute',
        height: 'calc(100% - 0.6em)',
        width: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        right: 0,
        background: `linear-gradient(90deg, transparent, ${theme.palette.action.disabledBackground} 100%)`,
        '&:hover': {
            cursor: 'pointer',
            backgroundColor: theme.palette.action.hover,
        },
    },
}));

export const HorizontalScrollableContainer = ({ children }) => {
    const classes = useStyles();
    const scrollRef = useHorizontalScroll();
    const [ref, setRef] = useState(null);
    const prevRef = useRef();
    const nextRef = useRef();

    const handlePrev = () => {
        if (ref){
            ref.scrollTo({
                left: ref.scrollLeft - 335,
                behavior: 'smooth',
            });
        }
    };

    const handleNext = () => {
        if (ref){
            ref.scrollTo({
                left: ref.scrollLeft + 335,
                behavior: 'smooth',
            });
        }
    };

    return (
        <Box position='relative'>
            <Box ref={prevRef} onClick={handlePrev} className={classes.prev}>
                <KeyboardArrowLeft style={{ fontSize: 40 }} />
            </Box>
            <Box ref={nextRef} onClick={handleNext} className={classes.next}>
                <KeyboardArrowRight style={{ fontSize: 40 }} />
            </Box>
            <Box ref={(r)=>{scrollRef(r);setRef(r)}} className={classes.root}>
                {children}
            </Box>
        </Box>
    )
}
