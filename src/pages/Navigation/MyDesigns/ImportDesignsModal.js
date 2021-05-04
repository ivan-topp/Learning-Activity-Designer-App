import React, { useState } from 'react';
import { Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles, Typography } from '@material-ui/core';
import { useUiState } from 'contexts/ui/UiContext';
import types from 'types';
import { Close } from '@material-ui/icons';
import { DropzoneArea } from 'material-ui-dropzone';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from 'react-query';
import { importDesign } from 'services/DesignService';

const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    previewChip: {
        maxWidth: 210
    },
    backdrop: {
        display: 'flex',
        flexDirection: 'column',
        zIndex: theme.zIndex.modal + 1,
        color: '#fff',
    },
}));

// ImportDesigns

export const ImportDesignsModal = () => {
    const classes = useStyles();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const { uiState, dispatch } = useUiState();
    const [designs, setDesigns] = useState([]);
    const [loading, setLoading] = useState(false);
    const path = uiState.folderPath;
    const maxFileSize = 3145728;

    const importDesignsMutation = useMutation(importDesign, {
        onMutate: async () => {
            await queryClient.cancelQueries('recent-designs');
            await queryClient.cancelQueries(['designs', path]);
        },
        onSettled: () => {
            queryClient.invalidateQueries('recent-designs');
            queryClient.invalidateQueries(['designs', path]);
        },
        onError: (error, args) => {
            if(args.last) {
                setLoading(false);
                handleClose();
            }
            enqueueSnackbar(error.message,  {variant: 'error', autoHideDuration: 2000});
        },
        onSuccess: (data, args) => {
            if(args.last) {
                setLoading(false);
                handleClose();
            }
            enqueueSnackbar(data.message,  {variant: 'success', autoHideDuration: 2000});

        }
    });

    const handleClose = ( e ) => {
        dispatch({
            type: types.ui.toggleModal,
            payload: 'ImportDesigns',
        });
    };

    const rejectFile = (file, accepteds, maxSize) => {
        let message = `El archivo "${file.name}" fue rechazado. `;
        if(!accepteds.includes(file.type)) message += `El tipo de archivo no es compatible. `;
        if(file.size > maxSize) message += `El archivo es demasiado grande. El límite de tamaño es ${maxSize/1024/1024} MB.`;
        return message;
    };

    const readFile = (file) => {
        return (e) => {
            try {
                const json = JSON.parse(e.target.result);
                setDesigns((prevDesigns) => [...prevDesigns, {filename: file.name, design: json}]);
            } catch (ex) {
                enqueueSnackbar(`Ha ocurrido un error al cargar el diseño "${file.name}". El archivo está corrupto.`, { variant: 'error', anchorOrigin: { vertical: 'bottom', horizontal: 'left' }, autoHideDuration: 2000 });
            }
        };
    }; 

    const loadFiles = (files) => {
        setDesigns([]);
        for (const file of files) {
            try {
                const fr = new FileReader();
                fr.onload = readFile(file);
                fr.readAsText(file);
            } catch (error) {
                console.log(error);
                enqueueSnackbar(`Ha ocurrido un error al cargar el diseño "${file.name}". El archivo está corrupto.`, { variant: 'error', anchorOrigin: { vertical: 'bottom', horizontal: 'left' }, autoHideDuration: 2000 });
            }
        }
    }

    const handleImportDesigns = async (e) => {
        setLoading(true);
        for (let index = 0; index < designs.length; index++) {
            const designFile = designs[index];
            await importDesignsMutation.mutate({ filename: designFile.filename, path, design: designFile.design, last: index === designs.length -1 });
        }
    };
    
    return (
        <>
        <Dialog
            open={uiState.isImportDesignsModalOpen}
            maxWidth={'sm'}
            fullWidth
        >
            <DialogTitle >
                Importar Diseños de Aprendizaje
            </DialogTitle>
            <IconButton aria-label='close' className={classes.closeButton} onClick={handleClose}>
                <Close />
            </IconButton>
            <DialogContent dividers >
                <Typography style={{ marginBottom: 20 }}>
                    Para importar diseños en su cuenta haga click o arrastre sus archivos a la zona indicada.
                </Typography>
                <DropzoneArea
                    getFileLimitExceedMessage={(limit) => `Se superó el número máximo de archivos. Solo se permiten ${limit}. `}
                    previewGridProps={{ container: { spacing: 1, direction: 'row' } }}
                    dropzoneText='Arrastra y suelta tus archivos o haz click aquí'
                    previewChipProps={{ classes: { root: classes.previewChip } }}
                    acceptedFiles={['application/json']}
                    previewText="Archivos Seleccionados"
                    getDropRejectMessage={rejectFile}
                    showPreviewsInDropzone={false}
                    maxFileSize={maxFileSize}
                    showAlerts={['error']}
                    onChange={loadFiles}
                    showPreviews={true}
                    filesLimit={5}
                    useChipsForPreview
                    clearOnUnmount
                />
                <div style={{ marginTop: 20 }}>
                    <Typography variant='caption'>
                        IMPORTANTE: Solo se admiten archivos con extensión "json", por ejemplo "Diseño de Ejemplo.json".
                    </Typography>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    Cancelar
                </Button>
                <Button 
                    variant='contained' 
                    color='primary' 
                    onClick={handleImportDesigns}
                    disabled={designs.length === 0}
                >
                    Importar
                </Button>
            </DialogActions>
        </Dialog>
        <Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color="inherit" />
            <Typography>Subiendo archivos...</Typography>
        </Backdrop>
    </>
)
}
