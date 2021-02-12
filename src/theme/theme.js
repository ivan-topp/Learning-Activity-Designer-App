import { createMuiTheme } from '@material-ui/core';
import {
  orange,
  lightBlue,
  deepPurple,
  deepOrange
} from "@material-ui/core/colors";

export const getTheme = ( isDarkActive ) =>{
    const theme = createMuiTheme({
        palette: {
          type: isDarkActive ? 'dark': 'light',
          primary: {
            dark: orange[500], 
            light: lightBlue[500],
            main: isDarkActive? orange[500] : lightBlue[500],
          },
          secondary: {
            dark: deepOrange[900],
            light: deepPurple[500], 
            main: isDarkActive? deepOrange[900]: deepPurple[500], 
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