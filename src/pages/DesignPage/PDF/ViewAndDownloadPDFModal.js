import React, { useEffect, useRef, useState } from 'react'
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { DocumentPDF } from './DocumentPDF';
import { Backdrop, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles, Tab, Tabs, Typography, useTheme } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useUiState } from 'contexts/ui/UiContext';
import types from 'types';
import { useDesignState } from 'contexts/design/DesignContext';
import html2canvas from 'html2canvas';
import { TabPanel } from 'components/TabPanel';
import { ConfigurationData } from './ConfigurationData';
import { useBetween } from 'use-between';
import { MiniContext } from './MiniContext';
import { PictureAsPdf } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    spaceInit: {
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
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    loadingFile: {
        '-webkit-backface-visibility': 'hidden',
        animation: `$scaleAnimation 1000ms ${theme.transitions.easing.easeInOut}`,
        animationIterationCount: 'infinite',
        animationDirection: 'alternate',
    },
    "@keyframes scaleAnimation": {
        from: {
            height: 300,
            width: 300,
            //transform: 'rotate(0deg)',
        },
        to: {
            height: 150,
            width: 150,
            //transform: 'rotate(360deg)',
        }
    },
}));

const a11yProps = (index) => {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

export const ViewAndDownloadPDFModal = ({ imgGraphic, setPdfView }) => {
    const classes = useStyles();
    const theme = useTheme();
    const { uiState, dispatch } = useUiState();
    const { typeUserPDF } = uiState.pdf;
    const { designState } = useDesignState();
    const { design } = designState;
    const [img, setImg] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);
    const { setPrivileges } = useBetween(MiniContext);
    const [pdfDocument, setPdfDocument] = useState(null);
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (isMounted.current){
            const privileges = [];
            design.privileges.forEach(privilege => {
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
        }
    }, [design.privileges, dispatch, setPrivileges]);

    useEffect(() => {
        if (isMounted.current){
            if(img && design && typeUserPDF) setPdfDocument(<DocumentPDF design={design} img={img} typeUserPDF={typeUserPDF} />);
        }
    }, [design, img, typeUserPDF, setPdfDocument]);

    const defineImage = async () => {
        if (isMounted.current){
            const canvas = await html2canvas(imgGraphic.current, {
                width: 800,
                height: 700,
                scrollX: 279
            })
            setImg(canvas.toDataURL('image/jpeg'));
        }
    }

    const handleClose = () => {
        dispatch({
            type: types.ui.closeModal,
            payload: 'PDF',
        });
        setTimeout(() => {
            dispatch({
                type: types.ui.setPDF,
                payload: null
            });
            setPdfView(false);
        }, theme.transitions.duration.enteringScreen);
    };

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    if (!img) {
        defineImage();
    }

    if (!img || !pdfDocument){
        return (
            <Backdrop className={classes.backdrop} open={true}>
                <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box width={300} height={300} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <PictureAsPdf className={classes.loadingFile} />
                    </Box>
                    <Typography>Generando archivo pdf...</Typography>
                </Box>
            </Backdrop>
        );
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
                            <PDFViewer width={'100%'} height={'100%'} >
                                {(imgGraphic && pdfDocument) &&
                                    pdfDocument
                                }
                            </PDFViewer>
                        </TabPanel>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancelar
                    </Button>
                    <div className={classes.spaceInit}>
                        <PDFDownloadLink style={{ textDecoration: 'none' }} document={pdfDocument} fileName="designdata.pdf">
                            {({ blob, url, loading, error }) =>
                                <Button variant={'contained'} disabled={loading}> Descargar </Button>
                            }
                        </PDFDownloadLink>
                    </div>
                </DialogActions>
            </Dialog>
        </>
    )
}
