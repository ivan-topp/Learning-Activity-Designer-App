import React, { useState } from 'react'
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { DocumentPDF } from './DocumentPDF';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useUiState } from 'contexts/ui/UiContext';
import types from 'types';
import { useDesignState } from 'contexts/design/DesignContext';
import html2canvas from 'html2canvas';

const useStyles = makeStyles((theme) => ({
    spaceInit:{
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}));

export const ViewAndDownloadPDFModal = ({ imgGraphic, setPdfView }) => {
    const classes = useStyles();
    const { uiState, dispatch } = useUiState();
    const { typeUserPDF } = uiState.pdf;
    const { designState } = useDesignState();
    const { design } = designState;
    
    const [img, setImg] = useState(null);

    const defineImage = async() =>{
        const canvas = await html2canvas(imgGraphic.current, {
            width: 800,
            height: 700,
            scrollX: 279
        })
        setImg(canvas.toDataURL('image/jpeg'));
    }
    if (!img) {
        defineImage()
    }
    
    const handleClose = () => {
        dispatch({
            type: types.ui.setPDF,
            payload: null
        });
        dispatch({
            type: types.ui.toggleModal,
            payload: 'PDF',
        });
        setPdfView(false);
    };

    if (!img) {
       return <div> Cargando...</div>
    }
    
    return (
        <>  
            <Dialog onClose={handleClose} open={uiState.isPDFModalOpen} fullScreen>
                <DialogTitle className={classes.titleMargin} >
                    Exportar diseño 
                </DialogTitle>
                <IconButton aria-label='close' className={classes.closeButton} onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <PDFViewer width={'100%'} height ={'100%'} >
                        {(imgGraphic !== undefined ) &&
                            <DocumentPDF design = {design} img = {img} typeUserPDF = {typeUserPDF}/>
                        }
                    </PDFViewer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancelar
                    </Button>
                    <div className = {classes.spaceInit}>
                        <PDFDownloadLink document={<DocumentPDF design = {design} img= {img} typeUserPDF = {typeUserPDF}/>} fileName="designdata.pdf">
                            {({ blob, url, loading, error }) =>
                                loading ? 'Cargando documento...' : <Button variant={'contained'}> Descargar </Button>
                            }
                        </PDFDownloadLink>
                    </div> 
                </DialogActions>
            </Dialog>
        </>
    )
}
