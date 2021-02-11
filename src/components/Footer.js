import {  Typography, Toolbar, AppBar, Container, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    pos:{
        width: 'fit-content',
    }
    
  }));
export const Footer = () =>{
    const classes = useStyles();
    return (
        <AppBar position="static" color="default"> 
          <Container maxWidth="md" className={classes.pos}>
            <Toolbar>
              <Typography variant="body1">
                © 2021 Universidad Católica de Temuco
              </Typography>
            </Toolbar>
          </Container>
        </AppBar>
    )
};