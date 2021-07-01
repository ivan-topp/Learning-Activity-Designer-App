import { Typography, Toolbar, AppBar, Container, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  pos: {
    width: 'fit-content',
  },
  footerColor: {
    background: theme.palette.background.navbar,
  },

}));
export const Footer = () => {
  const classes = useStyles();
  return (
    <AppBar position="static" className={classes.footerColor}>
      <Container maxWidth="md" className={classes.pos}>
        <Toolbar>
          <Typography variant="body1" color='textPrimary'>
            © 2021 Universidad Católica de Temuco
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  )
};