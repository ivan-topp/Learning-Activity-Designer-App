import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Checkbox, FormControl, FormControlLabel, Grid, Typography, makeStyles } from '@material-ui/core'
import React from 'react'
import { useBetween } from 'use-between';
import { MiniContext } from './MiniContext';
import { MuiPickersUtilsProvider, KeyboardDatePicker, } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { formatName, getUserInitials } from 'utils/textFormatters';
import { useUiState } from 'contexts/ui/UiContext';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import types from 'types';
  
const useStyles = makeStyles((theme) => ({
    author: {
        padding: '15px 10px 15px 20px',
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        textDecoration: 'none',
    },
}));

export const ConfigurationData = () => {
    const classes = useStyles();
    const { uiState, dispatch } = useUiState();
    const {
        selectedDate, 
        setSelectedDate, 
        privileges,
        setPrivileges,
        expanded, 
        setExpanded,
    } = useBetween(MiniContext);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleChangeSelectAuthor = (event, index) => {
        const newState = JSON.parse(JSON.stringify(privileges));
        newState[index].selected = !newState[index].selected;
        setPrivileges(newState);
        dispatch({
            type: types.ui.setPDFConfig,
            payload: {
                field: 'privileges',
                value: newState
            }
        })
    };

    const handleChangePanel = (panel, /*isChecked*/) =>(event, isExpanded) =>{
        setExpanded(isExpanded ? panel : false);
        //if (panel === 'panel1') {
            //if(isChecked){
            //    setDateConfiguration(event.target.checked);
            //} else {
            //    if(!confirmDateConfiguration){
            //        setDateConfiguration(true)
            //    }else if(confirmDateConfiguration){
            //        setDateConfiguration(false)
            //    }
            //}
        //    dispatch({
        //        type: types.ui.setPDFConfig,
        //        payload: {
        //            field: 'confirmDateConfiguration',
        //            value: confirmDateConfiguration
        //        }
        //    })
            //dispatch({
            //    type: types.ui.setPDFConfig,
            //    payload: {
            //        field: 'expanded',
            //        value: isExpanded
            //    }
            //})
        //}
    }

    return (
        <>
            <Box>
                <Accordion expanded={expanded === 'panel1'} onChange={handleChangePanel('panel1', false)}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    >
                    <Typography >Definir fecha que se mostrará en el documento PDF generado.</Typography>
                    {/*<FormControlLabel
                        aria-label="Acknowledge"
                        onClick={(event) => event.stopPropagation()}
                        onFocus={(event) => event.stopPropagation()}
                        control={<Switch
                            checked = {confirmDateConfiguration}
                           onChange={ handleChangePanel('panel1', true) }
                        />}
                        label="Desea la fecha en su PDF?"
                        />*/
                    }
                    </AccordionSummary>
                    <AccordionDetails>
                        <div>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Grid container>
                                    <KeyboardDatePicker
                                    disableToolbar
                                    variant="inline"
                                    format="dd/MM/yyyy"
                                    margin="normal"
                                    id="date-picker-inline"
                                    label="Definir fecha"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    />
                                </Grid>
                            </MuiPickersUtilsProvider>
                        </div>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel2'} onChange={handleChangePanel('panel2')}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                    >
                    <Typography >Definir autores en el documento</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div style={{marginTop: 10}}>
                            <FormControl component="fieldset">
                                    { uiState.pdf.privileges.map((author, i) => 
                                        <div key = {`authors-${i}`} style={{marginTop: 10}}>
                                        {(author.type === 0) &&
                                            <div>
                                                <div className={classes.author}>
                                                    <FormControlLabel 
                                                        control={
                                                        <Checkbox
                                                            checked = {author.selected}
                                                            onChange={(e) => handleChangeSelectAuthor(e, i)}
                                                            />
                                                        } 
                                                    />
                                                    <Avatar
                                                        alt={formatName(author.user.name, author.user.lastname)}
                                                        src={author.user.img ?? ''}
                                                    >
                                                        {getUserInitials(author.user.name, author.user.lastname)}
                                                    </Avatar>
                                                    <Typography style ={{marginLeft: 10, marginRight: 10}}>{author.user.name + ' ' + author.user.lastname}</Typography>
                                                    
                                                </div>
                                            </div>    
                                        }
                                    </div>
                                    )
                                }
                            </FormControl>
                        </div>
                    </AccordionDetails>
                </Accordion>
            </Box>    
        </>
    )
}
