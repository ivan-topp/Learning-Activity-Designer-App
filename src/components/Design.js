import React from 'react';
import { Avatar, Card, CardActionArea, CardActions, CardContent, IconButton, makeStyles, Typography } from '@material-ui/core';
import { Delete, Description, Star } from '@material-ui/icons';
import { useAuthState } from 'contexts/AuthContext';
import { formatName, getUserInitials } from 'utils/textFormatters';
import { deleteDesignById } from 'services/DesignService';
import { useMutation, useQueryClient } from 'react-query';
import { Link, useHistory } from 'react-router-dom';


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
            boxShadow: '0px 0px 10px 0 #bcc3d6',
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
        width: 200,
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
    deleteIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
    }
}));


export const Design = ({ _id, title, updatedAt, metadata, folder, owner, canDelete = true }) => {
    const queryClient = useQueryClient();
    const { authState } = useAuthState();
    const history = useHistory();
    //const [hours, minutes] = TimeFormatter.toHoursAndMinutes(metadata.workingTime ?? 0);

    const deleteMutation = useMutation(deleteDesignById, {
        onMutate: async () => {
            // Cancela consultas con la key especificada
            await queryClient.cancelQueries('recent-designs');
            await queryClient.cancelQueries(['designs', folder.path]);
            await queryClient.cancelQueries([owner._id, 'user-public-designs']);
            // Guarda los datos antes de la eliminación por si algo sale mal
            const previousDesigns = queryClient.getQueryData(['designs', folder.path]);
            const previousPublicDesigns = queryClient.getQueryData([owner, 'user-public-designs']);
            // Actualiza de manera optimista (Suponiendo que el servidor responde correctamente)
            let keys = ['designs', folder.path];
            if (!history.location.pathname.includes('/my-designs')) keys = [owner._id, 'user-public-designs'];
            queryClient.setQueryData(keys, oldData => {
                const oldPage = oldData.pages.find(page => page.designs.find(design => design._id === _id));
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
            queryClient.setQueryData([owner, 'user-public-designs'], context.previousPublicDesigns);
            if (context.previousRecentDesigns) queryClient.setQueryData('recent-designs', context.previousRecentDesigns);
        },
        onSettled: () => {
            // Invalida las queries para que todas las queries con estas keys se actualicen por cambios
            queryClient.invalidateQueries('recent-designs');
            queryClient.invalidateQueries(['designs', folder.path]);
            queryClient.invalidateQueries([owner._id, 'user-public-designs']);
        },
    });

    const classes = useStyles();

    const handleDeleteDesign = async (e) => {
        e.stopPropagation();
        await deleteMutation.mutate({ id: _id });
    };

    return (
        <Card className={classes.root} elevation={0}>
            <CardActionArea component={Link} to={`/designs/${_id}`}>
                <CardContent>
                    <div className={classes.row} style={{ width: '100%' }}>
                        <Description className={classes.designIcon} />
                        <div className={classes.col}>
                            <div className={classes.row}>
                                <Typography className={classes.ellipsis} variant='h5' component="h2" >{title}</Typography>
                            </div>
                            <div className={classes.row}>
                                <Typography className={classes.ellipsis} variant="body1" component="p">{metadata.category ? metadata.category.name : 'Sin categoría'}</Typography>
                            </div>
                        </div>
                    </div>
                    <div className={classes.rowJustified}>
                        <Typography variant="body1" component="p">Tiempo de diseño: {`${metadata.workingTime.hours ?? 0}:${metadata.workingTime.minutes ?? 0}`} Hrs</Typography>
                    </div>
                    <div className={classes.rowJustified} style={{ marginTop: 10, marginBottom: -5 }}>
                        <Typography color="textSecondary" variant='body2'>Última modificación: {new Date(updatedAt).toLocaleDateString()}</Typography>
                        <div className={classes.row} style={{ marginRight: 4 }}>
                            <Star fontSize='small' />
                            <Typography variant='body2'> 4.6</Typography>
                        </div>
                    </div>
                </CardContent>
            </CardActionArea>
            {
                canDelete && authState.user.uid === owner._id && (<IconButton className={classes.deleteIcon} onClick={handleDeleteDesign}>
                    <Delete />
                </IconButton>)
            }
            <CardActionArea component={Link} to={`/profile/${owner._id}`}>

                <CardActions className={classes.ownerInfo}>
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
            </CardActionArea>
        </Card>
    );
};
