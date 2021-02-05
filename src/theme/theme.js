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
			main: lightBlue[500],
            dark: orange[500], 
			light: lightBlue[500]
          },
          secondary: {
			main: deepPurple[500],
            dark: deepOrange[900], 
			light: deepPurple[500] 
          }
        }
    });
    return theme;
}