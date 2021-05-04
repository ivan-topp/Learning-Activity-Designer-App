import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { Divider, Grid, makeStyles, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';
import { DesignsContainer } from 'components/DesignsContainer';
import { createDesign, getDesignsByFolder } from 'services/DesignService';
import { getfolderByPath } from 'services/FolderService';
import { FoldersContainer } from 'components/FoldersContainer';
import { useAuthState } from 'contexts/AuthContext';
import { useUiState } from 'contexts/ui/UiContext';
import types from 'types';
import { LeftPanel } from 'pages/Navigation/LeftPanel';
import { DesignsBreadcrumbs } from 'pages/Navigation/MyDesigns/DesignsBreadcrumbs';
import { RecentDesigns } from 'pages/Navigation/MyDesigns/RecentDesigns';
import { FolderModal } from './FolderModal';
import { useSnackbar } from 'notistack';
import { AddCircle, CreateNewFolder, NoteAdd, Publish } from '@material-ui/icons';
import { CustomMenu } from 'components/CustomMenu';
import { ImportDesignsModal } from './ImportDesignsModal';

const useStyles = makeStyles((theme) => ({
    leftPanel: {
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    workspace: {
        paddingLeft: 30,
        paddingRight: 30,
        background: theme.palette.background.workSpace,
        minHeight: 'calc(100vh - 128px)',
        [theme.breakpoints.down('xs')]: {
            paddingLeft: 10,
            paddingRight: 10,
        },
    },
    rightPanel: {
        display: 'flex',
        flexDirection: 'column',
        borderLeft: `1px solid ${theme.palette.divider}`,
    },
    icon: {
        marginRight: 10,
    },
    breadCrumbs: {
        marginTop: 20,
        marginBottom: 20,
        width: '100%',
        padding: '10px 15px 10px 15px',
        borderRadius: 3,
        backgroundColor: theme.palette.background.default
    },
    designsAndFoldersContainer: {
        paddingTop: 15,
    },
    link: {
        textDecoration: 'none',
    },
    sectionTitle: {
        width: '100%',
        display:'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between', 
        alignItems:'flex-end', 
        paddingBottom: 5,
    },
    button: {
        height: 35,
    }

}));

export const MyDesignsPage = () => {
    const classes = useStyles();
    const history = useHistory();
    const urlparams = useParams();
    const designsRef = useRef(null);
    const theme = useTheme();
    const isXSDevice = useMediaQuery(theme.breakpoints.down('xs'));
    const { uiState, dispatch } = useUiState();
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();
    const { authState } = useAuthState();
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useEffect(()=>{
        dispatch({
            type: types.ui.updateFolderPath,
            payload: urlparams.urlPath ? '/' + urlparams.urlPath : '/',
        });
    }, [dispatch, urlparams]);

    const path = uiState.folderPath;
    const folderName = !urlparams.urlPath ? 'Mis Diseños' : path.split('/')[path.split('/').length - 1];

    const designsQuery = useInfiniteQuery(['designs', path], async ({ pageParam = 0 }) => {
        return await getDesignsByFolder(path, pageParam);
    }, {
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage, pages) => {
            if(lastPage.nPages === pages.length) return undefined; 
            return lastPage.from;
        },
    });

    const foldersQuery = useQuery(['folders', path], async () => {
        return await getfolderByPath(path);
    }, { refetchOnWindowFocus: false });

    const createDesignMutation = useMutation(createDesign, {
        onMutate: async () => {
            await queryClient.cancelQueries('recent-designs');
            await queryClient.cancelQueries(['designs', path]);
            await queryClient.cancelQueries([authState.user.id, 'user-public-designs']);
        },
        onSettled: () => {
            queryClient.invalidateQueries('recent-designs');
            queryClient.invalidateQueries(['designs', path]);
            queryClient.invalidateQueries([authState.user.id, 'user-public-designs']);
        },
        onError: (error) => {
            enqueueSnackbar(error.message,  {variant: 'error', autoHideDuration: 2000});
        },
        onSuccess: data => {
            history.push(`/designs/${data.design._id}`);
        }
    });

    useEffect(() => {
        if (designsRef.current) {
            setHeight(designsRef.current.offsetHeight);
            setWidth(designsRef.current.offsetWidth);
        }
    }, [designsRef]);

    const handleCreateDesign = async ( e, path = '/' ) => {
        await createDesignMutation.mutate({path});
    };

    const handleOpenFolderModal = async (e) => {
        dispatch({
            type: types.ui.toggleModal,
            payload: 'Folder'
        });
    };

    const handleImportDesign = (e) => {
        dispatch({
            type: types.ui.toggleModal,
            payload: 'ImportDesigns',
        });
    };

    return (
        <>
            <Grid container>
                <Grid item xs={12} md={3} lg={2} className={classes.leftPanel}>
                    <LeftPanel />
                </Grid>
                <Grid item xs={12} md={6} lg={8} ref={designsRef} className={classes.workspace}>
                    <DesignsBreadcrumbs />
                    {
                        path === '/' && <RecentDesigns id='recent' width={width} height={height} />
                    }
                    <div className={ classes.designsAndFoldersContainer }>
                        <div className={classes.sectionTitle}>
                            <Typography variant='h4'>
                                {path === '/' ? 'Mis Diseños' : folderName}
                            </Typography>
                            <CustomMenu
                                Icon={<AddCircle />}
                                text='Nuevo'
                                fullWidth={isXSDevice}
                                options={[
                                    { icon: <NoteAdd  />, label: 'Nuevo Diseño', onSelect: (e)=>handleCreateDesign(e, path) },
                                    { icon: <CreateNewFolder  />, label: 'Nueva Carpeta', onSelect: handleOpenFolderModal },
                                    { icon: <Publish  />, label: 'Importar Diseños', onSelect: handleImportDesign },
                                ]} 
                            />
                        </div>
                        <Divider />
                        <FoldersContainer {...foldersQuery}/>
                        <DesignsContainer {...designsQuery} handleCreateDesign={(e)=>handleCreateDesign(e, path)}/>
                    </div>
                </Grid>
                <Grid item xs={12} md={3} lg={2} className={classes.rightPanel}></Grid>
            </Grid>
            <FolderModal />
            <ImportDesignsModal />
        </>
    );
};