import { createMuiTheme } from '@material-ui/core';
import {
  blue, green, orange, red,
} from "@material-ui/core/colors";

export const getTheme = ( isDarkActive ) =>{
    const theme = createMuiTheme({
        palette: {
          type: isDarkActive ? 'dark': 'light',
          primary: {
            main: isDarkActive ? blue[200] : blue[500],
            dark: isDarkActive ? '#5d99c6': '#0069c0',
            light: isDarkActive ? '#c3fdff': '#6ec6ff',
          },
          secondary: {
            main: isDarkActive ? blue[300]: blue[400], 
            dark: isDarkActive ? '#2286c3': '#0077c2',
            light: isDarkActive ? '#9be7ff': '#80d6ff', 
          },
          text:{
            primary: isDarkActive? '#F4F4F4': '#0a1319',
          },
          background:{
            default: isDarkActive? '#0a1319': '#f0f7ff', //SidePanels,
            paper: isDarkActive? '#0a1319': '#f0f7ff', // Menu, Login and Register Modal
            workSpace: isDarkActive? '#060e16': '#e8eff7',
            navbar: isDarkActive? '#0f1c26': '#dce7f4',
            design: isDarkActive? '#0a1319': '#f0f7ff',
            designHover: isDarkActive? '#091421': '#e8eff7',
          },
          error: {
            main: isDarkActive? red[400]: red[500],
          },
          info: {
            main: isDarkActive? blue[300]: blue[300],
          },
          warning: {
            main: isDarkActive? orange[700]: orange[900],
          },
          success: {
            main: isDarkActive? green[300]: green[400],
          }
        },
    });
    return theme;
}