import { createMuiTheme } from '@material-ui/core';
import {
  orange,
  lightBlue,
  deepOrange,
} from "@material-ui/core/colors";

export const getTheme = ( isDarkActive ) =>{
    const theme = createMuiTheme({
        palette: {
          type: isDarkActive ? 'dark': 'light',
          primary: {
            dark: isDarkActive ? '#c25e00': '#006db3',
            light: isDarkActive ? '#ffbd45': '#63ccff',
            main: isDarkActive ? orange[600] : lightBlue[600],
          },
          secondary: {
            dark: isDarkActive ? '#c66900': '#0077c2',
            light: isDarkActive ? '#ffc947': '#80d6ff', 
            main: isDarkActive ? deepOrange[500]: lightBlue[400], 
          },
          text:{
            primary: isDarkActive? '#F4F4F4': '#36393F',
          },
          background:{
            default: isDarkActive? '#36393F': '#F4F4F4', //SidePanels,
            paper: isDarkActive? '#36393F': '#F4F4F4', // Menu, Login and Register Modal
            workSpace: isDarkActive? '#2F3136': '#FEFEFE',
            navbar: isDarkActive? '#202225': '#DCDCDC',
            design: isDarkActive? '#36393F': '#F4F4F4',
            designHover: isDarkActive? '#393D46': '#F6F6F6',
          }
        },
    });
    return theme;
}