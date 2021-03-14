import React from 'react';
import { Divider, makeStyles, Typography } from '@material-ui/core';
import { useQuery } from 'react-query';
import ScrollContainer from 'react-indiana-drag-scroll';
import { Design } from 'components/Design';
import { DesignSkeleton } from 'components/DesignSkeleton';
import { getRecentDesigns } from 'services/DesignService';

const useStyles = makeStyles({
    root:{
        paddingTop: 15,
        marginBottom: 15,
        //marginLeft: -10,
        //marginRight: -10,
    },
    recentDesigns: {
        width: '100%',
        display: 'flex',
        flexGrow: 1,
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        marginTop:15,
    },
    title: {
        //paddingLeft:10,
        //paddingRight:10,
    }
});

export const RecentDesigns = ({ width, height }) => {
    const classes = useStyles();
    const n = Math.trunc(width / 345);

    const { isLoading, isError, data } = useQuery("recent-designs", async () => {
        return getRecentDesigns();
    });
    

    if (isError) {
        return <div></div>;
    }
    
    const createSkeletons = () => {
        return Array.from(Array(n).keys()).map( i => {return(<DesignSkeleton key={`recent-design-skeleton-${ i }`}/>)});
    };

    const designList = () => {
        return data.map((design) => <Design key={'recent' + design._id} title={design.metadata.name} {...design} canDelete={ false } />);
    };

    return (
        <div className={classes.root}>
            {
                data && data.length !== 0 
                    ? <div className={classes.title}>
                    <Typography variant='h4'>
                        Diseños recientes
                    </Typography>
                    <Divider />
                </div>
                    : <div></div>
            }
            {
                data && data.length > 0 
                    ? data.length > n ?
                        <ScrollContainer className={classes.recentDesigns} style={{ cursor: 'grab' }}>
                            {
                                (isLoading) 
                                    ? createSkeletons()
                                    : designList()
                            }
                        </ScrollContainer>
                        :
                        <div className={classes.recentDesigns}>
                            {
                                (isLoading) 
                                    ? createSkeletons()
                                    : designList()
                            }
                        </div>
                    : <div></div>
            }
        </div>
    );
};
