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
            workspace: isDarkActive? '#36393F': '#FFFFFF',
            sidePanels: isDarkActive? '#2F3136': '#F4F4F4',
            navbar: isDarkActive? '#202225': '#DCDCDC'

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
            paper: isDarkActive? '#202225': '#DCDCDC',
            default: isDarkActive? '#202225': '#DCDCDC'
            }
        }
    });
    return theme;
}