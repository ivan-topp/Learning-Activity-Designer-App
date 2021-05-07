import React from 'react';
import { Button, Link, makeStyles } from '@material-ui/core';
import { Design } from 'components/Design';
import { Alert } from '@material-ui/lab';
import { useAuthState } from 'contexts/AuthContext';
import { DesignSkeleton } from './DesignSkeleton';

const useStyles = makeStyles({
    root: {
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
        marginTop: 15,
        marginBottom: 15,
    },
    error: {
        marginTop: 15,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'justify',
        alignItems: 'center',
    },
    loadMore: {
        marginBottom: 50,
    },
    clickHere: {
        textDecoration: 'none',
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'underline'
        }
    }
});

export const DesignsContainer = ({ data, status, isFetchingNextPage, fetchNextPage, hasNextPage, handleCreateDesign, label }) => {
    const classes = useStyles();
    const { authState } = useAuthState();

    const designList = () => {
        return data.pages.map((page, index) => {
            return page.designs.map((design, i) => <Design key={'my-design' + design._id} title={design.metadata.name} {...design} canDelete={label!=='public-repository'} />);
        });
    };

    const desingSkeletonsList = () => {
        return [...Array(10).keys()].map((index) => {
            return <DesignSkeleton key={`design-skeleton-${index}`} />
        });
    };

    const alert = () => {
        if(label === 'shared-with-me'){
            return (
                <Alert severity="info" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    No se han encontrado diseños compartidos. Cuando otros usuarios compartan diseños contigo aparecerán aquí.
                </Alert>
            );
        } else if (label === 'user-profile'){
            if (data.pages[0].ownerId === authState.user.uid) {
                return (
                    <Alert severity="info" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        No cuentas con diseños públicos. Crea tu primer diseño público haciendo click {' '}
                        <Link className={classes.clickHere} onClick={handleCreateDesign}>aquí</Link>
                        !
                    </Alert>
                );
            } else {
                return (
                    <Alert severity="info" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        Este usuario no cuenta con diseños públicos.
                    </Alert>
                );
            }
        } else if(label === 'public-repository'){
            return (
                <Alert severity="info" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    No se han encontrado resultados para tu búsqueda.
                </Alert>
            );
        } else {
            return (
                <Alert severity="info" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    No se han encontrado diseños en este directorio. Crea tu primer diseño haciendo click {' '}
                    <Link className={classes.clickHere} onClick={handleCreateDesign}>aquí</Link>
                    !
                </Alert>
            );
        }
    };
    
    return status === 'loading' ? (
        <div className={classes.root}>
            <div className={classes.designsContainer}>
                { desingSkeletonsList() }
            </div>
        </div>
    ) : status === 'error' ? (
        <Alert severity='error' className={classes.error}>
            Ha ocurrido un problema al intentar obtener los diseños. Esto probablemente se deba a un problema de conexión, por favor revise que su equipo tenga conexión a internet e intente más tarde.
            Si el problema persiste, por favor comuníquese con el equipo de soporte.
        </Alert>
    ) : (
        <div className={classes.root}>
            <div className={classes.designsContainer}>
                {
                    data.pages[0].designs.length > 0
                        ? designList()
                        : alert()
                }
            </div>
            {
                data && data.pages[0].designs.length > 0 && hasNextPage &&
                <Button className={classes.loadMore} color='primary' onClick={() => fetchNextPage()}>
                    {
                        isFetchingNextPage
                            ? 'Cargando más...'
                            : 'Cargar Más'
                    }
            </Button>
            }
        </div>
    )
}
