import React from 'react';
import { Button, Divider, makeStyles, Typography } from '@material-ui/core';
import { DesignSkeleton } from './DesignSkeleton';
import { Design } from './Design';
import { DesignsFolder } from './DesignsFolder';
import { FolderSkeleton } from './FolderSkeleton';
import { Alert } from '@material-ui/lab';
import { useAuthState } from '../contexts/AuthContext';

const useStyles = makeStyles({
    root:{
        paddingTop: 15,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    designsContainer: {
        width: '100%',
        display: 'flex',
        flexGrow: 1,
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginTop:15,
        marginBottom:15,
    },
    error: {
        marginTop: 15,
        width:'100%',
        display:'flex',
        justifyContent: 'center',
        textAlign: 'justify',
        alignItems:'center',
    },
    loadMore: {
        marginBottom: 50,
    }
});

export const DesignsContainer = ({ title, data, isError, isLoading, error, onLoadMore }) => {
    const classes = useStyles();
    const { authState } = useAuthState();

    
    if (isError) {
        return (<Alert severity='error' className={ classes.error }>
            Ha ocurrido un problema al intentar obtener los diseños. Esto probablemente se deba a un problema de conexión, por favor revise que su equipo tenga conexión a internet e intente más tarde.
            Si el problema persiste, por favor comuníquese con el equipo de soporte.
        </Alert>);
    }

    const createDesignSkeletons = () => {
        return Array.from(Array(8).keys()).map( i => {return(<DesignSkeleton key={`my-design-skeleton-${ i }`}/>)});
    };

    const createFolderSkeletons = () => {
        return Array.from(Array(8).keys()).map( i => {return(<FolderSkeleton key={`my-folder-skeleton-${ i }`}/>)});
    };
    
    const folderList = () => {
        return data.folders.map((folder) => <DesignsFolder key={'my-folder' + folder._id} { ...folder } />);
    };

    const designList = () => {
        return data.designs.map((design) => <Design key={'my-design' + design._id} title={design.metadata.name} {...design} />);
    };

    return (
        <div className={ classes.root }>
            <Typography variant='h4'>
                { title }
            </Typography>
            <Divider />
            {
                (
                        <div className={classes.designsContainer}>
                            {
                                (isLoading) 
                                ? createFolderSkeletons()
                                : (!data.folders)
                                    ? <div></div>
                                    : folderList()
                            }
                            <div className={classes.designsContainer}>
                                {
                                    (isLoading) 
                                        ? createDesignSkeletons()
                                        : data.designs.length > 0 
                                            ? designList()
                                            : (data.ownerId === authState.user.uid)
                                                ? <Alert severity="info" style={{ width:'100%', display:'flex', justifyContent: 'center' }}>
                                                    No se han encontrado diseños. Crea tu primer diseños haciendo click aquí!
                                                </Alert>
                                                : <Alert severity="info" style={{ width:'100%', display:'flex', justifyContent: 'center' }}>
                                                    Este usuario no cuenta con diseños públicos.
                                                </Alert>
                                }
                            </div>
                        </div>
                    )
            }
            { 
                data && data.designs.length > 0 && data.canFetchMore && 
                    <Button className={ classes.loadMore } color='primary' onClick={ onLoadMore }> 
                        Cargar Más 
                    </Button>
            }
        </div>
    )
}
