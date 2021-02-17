import React from 'react';
import { Avatar, Card, CardActions, CardContent, makeStyles, Typography } from '@material-ui/core';
import { Delete, Description, Star } from '@material-ui/icons';
import { useAuthState } from '../contexts/AuthContext';
import { formatName, getUserInitials } from '../utils/textFormatters';
import { deleteDesignById } from '../services/DesignService';
import { useMutation, useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        border: `1px solid ${theme.palette.divider}`,
        width: 325,
        minWidth: 325,
        margin: '10px 10px 10px 0px',
        borderRadius: 5,
        cursor: 'pointer',
        userSelect: 'none',
        backgroundColor: theme.palette.background.design,
        '&:hover': {
            zIndex: 0.5,
            background: theme.palette.background.designHover,
        },
    },
    ownerInfo: {
        borderTop: `1px solid ${theme.palette.divider}`,
        paddingLeft: 15,
        paddingRight: 15,
    },
    row: {
        display: 'flex',
    },
    rowJustified: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    col: {
        display: 'flex',
        flexDirection: 'column',
    },
    ellipsis: {
        width: 220,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    designIcon: {
        marginLeft: -12,
        fontSize: 50,
        alignSelf: 'center',
        justifySelf: 'start',
        width: '20%',
    },
    deleteDesign: {
        width: '10%',
        alignSelf: 'center',
    }
}));


export const Design = ({ _id, title, updatedOn, metadata, folder, owner, canDelete = true }) => {
    const queryClient = useQueryClient();
    const { authState } = useAuthState();
    const history = useHistory();

    const deleteMutation = useMutation(deleteDesignById, {
        onMutate: async () => {
            // Cancela consultas con la key especificada
            await queryClient.cancelQueries('recent-designs');
            await queryClient.cancelQueries(['designs', folder.path]);
            await queryClient.cancelQueries([ owner._id, 'user-public-designs' ]);
            // Guarda los datos antes de la eliminación por si algo sale mal
            const previousDesigns = queryClient.getQueryData(['designs', folder.path]);
            const previousPublicDesigns = queryClient.getQueryData([ owner, 'user-public-designs' ]);
            // Actualiza de manera optimista (Suponiendo que el servidor responde correctamente)
            let keys = ['designs', folder.path];
            if(history.location.pathname !== '/my-designs') keys = [ owner._id, 'user-public-designs' ];
            queryClient.setQueryData(keys, oldData => {
                const oldPage = oldData.pages.find( page => page.designs.find(design => design._id === _id));
                const newDesigns = oldPage.designs.filter((design) => design._id !== _id);
                const newPage = Object.assign({}, { ...oldPage, designs: newDesigns });
                let newPages = oldData.pages;
                newPages[oldData.pages.indexOf(oldPage)] = newPage;
                return Object.assign({}, { ...oldData, pages: newPages });
            });
            if (folder.path === '/') {
                const previousRecentDesigns = queryClient.getQueryData('recent-designs');
                // Actualiza de manera optimista (Suponiendo que el servidor responde correctamente)
                queryClient.setQueryData('recent-designs', oldData => oldData.filter((design) => design._id !== _id));
                return { previousDesigns, previousPublicDesigns, previousRecentDesigns };
            }
            // Retorna un contexto con los datos previos a la eliminación para restaurar la consulta si es que algo sale mal
            return { previousDesigns, previousPublicDesigns };
        },
        // Si la mutación falla, usa los datos previos desde el contexto retornado en onMutate para restaurar los datos
        onError: (error, design, context) => {
            // TODO: Emitir notificación para retroalimentar
            console.log(error);
            queryClient.setQueryData(['designs', folder.path], context.previousDesigns);
            queryClient.setQueryData([ owner, 'user-public-designs' ], context.previousPublicDesigns);
            if (context.previousRecentDesigns) queryClient.setQueryData('recent-designs', context.previousRecentDesigns);
        },
        onSettled: () => {
            // Invalida las queries para que todas las queries con estas keys se actualicen por cambios
            queryClient.invalidateQueries('recent-designs');
            queryClient.invalidateQueries(['designs', folder.path]);
            queryClient.invalidateQueries([ owner._id, 'user-public-designs' ]);
        },
    });

    const classes = useStyles();

    const handleOpenDesign = (e) => {
        e.stopPropagation();
        history.push(`designs/${ _id }`);
        console.log('Open Design');
    };

    const handleDeleteDesign = async (e) => {
        e.stopPropagation();
        await deleteMutation.mutate({ id: _id });
    };

    const handleViewUser = (e, id) => {
        e.stopPropagation();
        history.push(`/profile/${id}`);
    };

    return (
        <Card className={classes.root} onClick={handleOpenDesign}>
            <CardContent>
                <div className={classes.row} style={{ width: '100%' }}>
                    <Description className={classes.designIcon} />
                    <div className={classes.col}>
                        <div className={classes.rowJustified}>
                            <Typography className={classes.ellipsis} variant='h5' component="h2" >{title}</Typography>
                            {canDelete && authState.user.uid === owner._id && <Delete className={classes.deleteDesign} onClick={handleDeleteDesign} />}
                        </div>
                        <div className={classes.row}>
                            <Typography className={classes.ellipsis} variant="body1" component="p">{metadata.category ?? 'Sin categoría'}</Typography>
                        </div>
                    </div>
                </div>
                <div className={classes.rowJustified}>
                    <Typography variant="body1" component="p">Tiempo de diseño: {'100:30 Hrs'}</Typography>
                </div>
                <div className={classes.rowJustified} style={{ marginTop: 10, marginBottom: -5 }}>
                    <Typography color="textSecondary" variant='body2'>Última modificación: {new Date(updatedOn).toLocaleDateString()}</Typography>
                    <div className={classes.row} style={{ marginRight: 4 }}>
                        <Star fontSize='small' />
                        <Typography variant='body2'> 4.6</Typography>
                    </div>
                </div>
            </CardContent>
            <CardActions className={classes.ownerInfo} onClick={(e) => handleViewUser(e, owner._id)}>
                <Avatar
                    alt={formatName(owner.name, owner.lastname)}
                //src='https://i.pinimg.com/400x300/d6/e6/28/d6e6281bb90621d9be0a9e53d882c2c6.jpg'
                >
                    {getUserInitials(owner.name, owner.lastname)}
                </Avatar>
                <div>
                    <Typography color='textPrimary'>{formatName(owner.name, owner.lastname)}</Typography>
                    <Typography color="textSecondary">{owner.occupation ?? 'Sin ocupación'}</Typography>
                </div>
            </CardActions>
        </Card>
    );
};
