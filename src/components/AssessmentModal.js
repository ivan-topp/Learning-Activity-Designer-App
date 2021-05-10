import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles, Typography } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { useUiState } from 'contexts/ui/UiContext';
import types from 'types';
import { useDesignState } from 'contexts/design/DesignContext';
import { useSocketState } from 'contexts/SocketContext';
import { Rating } from '@material-ui/lab';
import { useAuthState } from 'contexts/AuthContext';

const useStyles = makeStyles((theme) => ({
    closeButton: {
        color: theme.palette.grey[500],
    },
    title: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ellipsis: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    bodyMargin: {
        marginLeft: theme.spacing(5),
        marginRight: theme.spacing(5)
    },
    ratingRoot: {
        fontSize: 90,
        [theme.breakpoints.down('xs')]: {
            fontSize: 40,
        },
    },
}));

const labels = {
    0.5: 'Pésimo',
    1:   'Muy malo',
    1.5: 'Malo',
    2:   'Menos que bueno',
    2.5: 'Bueno',
    3:   'Más que bueno',
    3.5: 'Muy bueno',
    4:   'Extraordinario',
    4.5: 'Casi excelente',
    5:   'Excelente',
};

const getInitialScore = (assessments, uid) => {
    const existentAssesment = assessments.find((a) => a.user === uid);
    if(existentAssesment) return existentAssesment.score;
    return null;
};

export const AssessmentModal = () => {
    const classes = useStyles();
    const { socket } = useSocketState();
    const { authState } = useAuthState();
    const { uiState, dispatch } = useUiState();
    const { designState } = useDesignState();
    const { design } = designState;
    let initialScore = getInitialScore(design.assessments, authState.user.uid);
    const [ assessment, setAssessment] = useState(initialScore);
    const [hover, setHover] = useState(-1);

    useEffect(() => {
        setAssessment(getInitialScore(design.assessments, authState.user.uid));
    }, [design.assessments, setAssessment, authState.user.uid]);

    const handleClose = () => {
        setAssessment(initialScore);
        setHover(-1);
        dispatch({
            type: types.ui.toggleModal,
            payload: 'Assessment',
        });
    };

    const handleRate = () => {
        if(assessment){
            if (assessment === initialScore) return handleClose();
            socket.emit('rate-design', {
                designId: design._id,
                rate: {
                    user: authState.user.uid,
                    score: assessment,
                },
            });
            handleClose();
        }
    };
    
    return (
        <Dialog style={{padding: 0}} open={uiState.isAssessmentModalOpen}>
            <DialogTitle style={{padding: '5px 5px 5px 16px'}}>
                <Box className={classes.title}>
                    <Box className={classes.ellipsis}>
                        Valorar diseño
                    </Box>
                    <IconButton aria-label='close' className={classes.closeButton} onClick={handleClose}>
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                <Typography align='center' style={{marginBottom: 20}}>
                    En esta ventana usted puede valorar o cambiar su valoración del diseño de aprendizaje que está visualizando
                    haciendo click en alguna de las estrellas a continuación:
                </Typography>
                <Box style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Rating
                        classes={{root: classes.ratingRoot}}
                        name="hover-feedback"
                        value={assessment}
                        precision={0.5}
                        onChange={(event, newValue) => {
                            setAssessment(newValue);
                        }}
                        onChangeActive={(event, newHover) => {
                            setHover(newHover);
                        }}
                    />
                    <Box style={{minHeight: 50, marginTop: 20}}>
                        <Typography>
                            { hover !== -1 ? labels[hover] : assessment ? labels[assessment] : 'No valorado' }
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}> Cancelar </Button>
                <Button variant='contained' color='primary' onClick={handleRate} disabled={!assessment}> Valorar </Button>
            </DialogActions>
        </Dialog>
    )
}
