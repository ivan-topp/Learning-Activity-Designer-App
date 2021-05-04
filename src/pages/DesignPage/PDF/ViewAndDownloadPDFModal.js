import React, { useEffect, useState } from 'react'
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { DocumentPDF } from './DocumentPDF';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles, Tab, Tabs } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useUiState } from 'contexts/ui/UiContext';
import types from 'types';
import { useDesignState } from 'contexts/design/DesignContext';
import html2canvas from 'html2canvas';
import { TabPanel } from 'components/TabPanel';
import { ConfigurationData } from './ConfigurationData';
import { useBetween } from 'use-between';
import { MiniContext } from './MiniContext';

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
    menu: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    tabBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    container: {
        display: "flex",
        height: "100%",
        width: "100%"
    },
    panel: {
        width: "100%"
    }
}));

const a11yProps = (index) => {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

export const ViewAndDownloadPDFModal = ({ imgGraphic, setPdfView }) => {
    const classes = useStyles();
    const { uiState, dispatch } = useUiState();
    const { typeUserPDF } = uiState.pdf;
    const { designState } = useDesignState();
    const { design } = designState;
    const [img, setImg] = useState(null);
    const [ tabIndex, setTabIndex ] = useState(0);
    const { setPrivileges } = useBetween(MiniContext);

    useEffect(() => {
        const privileges = [];
        design.privileges.forEach(privilege =>{
            const p = JSON.parse(JSON.stringify(privilege));
            p.selected = false;
            privileges.push(p);
        })
        setPrivileges(privileges);
        dispatch({
            type: types.ui.setPDFConfig,
            payload: {
                field: 'privileges',
                value: privileges
            }

        })
    }, [design.privileges, dispatch, setPrivileges]);

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

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    if (!img) {
       return <div> Cargando...</div>
    }
    
    return (
        <>  
            <Dialog onClose={handleClose} open={uiState.isPDFModalOpen} fullScreen>
                <DialogTitle className={classes.titleMargin} >
                    Exportar diseño
                    <Tabs
                        value={tabIndex}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        aria-label="full width tabs"
                        centered
                    >
                        <Tab label="CONFIGURACIÓN" {...a11yProps(0)} />
                        <Tab label="VISTA PREVIA" {...a11yProps(1)} />
                    </Tabs> 
                </DialogTitle>
                <IconButton aria-label='close' className={classes.closeButton} onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <Box className={classes.container}>
                        <TabPanel value={tabIndex} index={0} className={classes.panel}>
                            <ConfigurationData />
                        </TabPanel>
                        <TabPanel value={tabIndex} index={1} className={classes.panel} >
                            <PDFViewer width={'100%'} height ={'100%'} >
                                {(imgGraphic !== undefined ) &&
                                    <DocumentPDF design = {design} img = {img} typeUserPDF = {typeUserPDF}/>
                                }
                            </PDFViewer>
                        </TabPanel>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancelar
                    </Button>
                    <div className = {classes.spaceInit}>
                        <PDFDownloadLink document={<DocumentPDF design = {design} img= {img} typeUserPDF = {typeUserPDF} />} fileName="designdata.pdf">
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
