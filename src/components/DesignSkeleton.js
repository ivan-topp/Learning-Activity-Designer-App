import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { Card, CardActions, CardContent, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        border: `1px solid ${ theme.palette.divider }`,
        //paddingTop: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: 325,
        minWidth: 325,
        height: 198,
        margin: '10px 10px 10px 0px',
        borderRadius: 10,
        //backgroundColor: theme.palette.divider,
    },
    ownerInfo: {
        borderTop: `1px solid ${theme.palette.divider}`,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
    },
    row: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    col: {
        width: '80%',
        display: 'flex',
        flexDirection: 'column',
    }
}));

export const DesignSkeleton = () => {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardContent>
                <div className={ classes.row }>
                    <Skeleton variant="rect" width={35} height={43} />
                    <div className={ classes.col }>
                        <div className={ classes.row } style={{marginLeft: -5}}>
                            <Skeleton style={{marginTop: -3}} animation="wave" height={33} width={'80%'}/>
                            <Skeleton variant="circle" width={20} height={20} />
                        </div>
                        <div className={ classes.row } style={{marginLeft: -5}}>
                            <Skeleton style={{marginTop: -3}} animation="wave" height={23} width={'70%'}/>
                        </div>
                    </div>
                </div>
                <div className={ classes.row }>
                    <Skeleton animation="wave" height={20} width={'70%'}/>  
                </div>
                <div className={ classes.row } >
                    <div className={ classes.row } style={{marginTop:14, marginBottom:-5}}>
                        <Skeleton animation="wave" height={20} width={'70%'} />
                        <Skeleton variant="circle" width={13} height={13} style={{marginTop: 2, marginRight:5}}/>
                    </div>
                    <Skeleton animation="wave" height={20} width={'5%'} style={{marginTop:14, marginBottom:-5}}/>
                </div>
            </CardContent>
            <CardActions className={ classes.ownerInfo } >
                <Skeleton variant="circle" width={40} height={40} style={{marginBottom: 3}}/>
                <div className={ classes.col } style={{marginBottom: 3}}>
                    <Skeleton animation="wave" height={20} width={'100%'}/>
                    <Skeleton animation="wave" height={20} width={'80%'}/>
                </div>
            </CardActions>
        </Card>
    );
}