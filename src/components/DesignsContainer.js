import React from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { Design } from './Design';
import { Alert } from '@material-ui/lab';
import { useAuthState } from '../contexts/AuthContext';

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
    }
});

export const DesignsContainer = ({ data, status, isFetchingNextPage, fetchNextPage, hasNextPage }) => {
    const classes = useStyles();
    const { authState } = useAuthState();

    const designList = () => {
        return data.pages.map((page, index) => {
            return page.designs.map((design, i) => <Design key={'my-design' + design._id} title={design.metadata.name} {...design} />);
        });
    };

    return status === 'loading' ? (
        <p>Loading...</p>
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
                        : (data.pages[0].ownerId === authState.user.uid)
                            ? <Alert severity="info" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                No se han encontrado diseños. Crea tu primer diseños haciendo click aquí!
                            </Alert>
                            : <Alert severity="info" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                Este usuario no cuenta con diseños públicos.
                            </Alert>
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