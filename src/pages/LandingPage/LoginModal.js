import React,{useState} from 'react';
import Logo from '../../assets/img/Logo.png';
import './styles.css'
import { useForm } from '../../hooks/useForm';
import { 
    Button ,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    makeStyles,
    Typography,
    Avatar,
    IconButton,
    InputLabel ,
    Input,
    InputAdornment
    
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { Link } from 'react-router-dom';
import { fetchWithOutToken } from '../../utils/fetch';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { green } from '@material-ui/core/colors';
import Tooltip from '@material-ui/core/Tooltip';
import Alert from '@material-ui/lab/Alert';
const useStyles = makeStyles((theme) => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '25ch',
    },
    pos: {
        marginBottom: 12,
    },
    formcontrol:{
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        width: 'fit-content',
    },
    logo: {
        width: theme.spacing(20),
        height: theme.spacing(20),
        margin: 'auto',
    },
    margin: {
        margin: theme.spacing(1),
      },
    
    
}));


export const LoginModal = ({setOpenLogin, openlogin}) => {

    const [loginfail, setLoginFail] = useState(false);
    const classes = useStyles();
    const [values, setValues] = useState({
        password: '',
      });
    const [ formLoginValues, handleLoginInputChange] = useForm({
        email:'aguzman2016@alu.uct.cl',
        password: '123'
    });  

    const {email, password} = formLoginValues;

    const ValidateEmail = (validateEmail) =>{
        if (/^[-\w.%+]{1,64}@(?:[A-Z0-9]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(validateEmail)){
            return true;
        } else {
            return false;
        }
    };

    const ValidatePassword = (validatePassword)=>{
        if(validatePassword.length>=3){
            return true;
        }else{
            return false;
        }
    };
    
    const handleLogin=async(e)=>{
        e.preventDefault();
        if(ValidateEmail(email) && ValidatePassword(password)){
            const res = await fetchWithOutToken('auth/login', {email, password}, 'POST');
            const body = await res.json();
            console.log(body);
            if(body.ok){
                setLoginFail(false);
                localStorage.setItem('user', JSON.stringify(body.data.user));
                localStorage.setItem('token', body.data.token);
                //localStorage.setItem('token-init-date', new Date().getTime());
            }else{
                setLoginFail(true);
            }
        }
    };

    const handleCloseLogin = () => {
        setOpenLogin(false);
    };

    
    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };
    
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };
    
    return (
        <div>
            <Dialog
                open={openlogin}
                onClose={handleCloseLogin}
                aria-labelledby="max-width-dialog-title"
                fullWidth={true}
                maxWidth='sm'
            >   
                <DialogActions>
                <Button color="primary" onClick={handleCloseLogin}>
                        X
                    </Button>
                </DialogActions>
                <div className="FormCenter">
                    <DialogTitle id="max-width-dialog-title">
                        <Avatar className={classes.logo} src ={Logo} alt="Logo"/>
                        <Typography component = {"span"} >
                            ¡Bienvenido!
                        </Typography>
                        <br/>
                        <Typography component = {"span"} color="textSecondary">
                            Ingresa tu cuenta para continuar
                        </Typography> 
                    </DialogTitle>
                </div>  
                <DialogContent >
                    <form onSubmit ={handleLogin} className= {classes.root} noValidate autoComplete="off">
                        <div className={classes.formcontrol}>
                            <br/>   
                                <InputLabel htmlFor="standard-adornment-amount">Email</InputLabel>
                                <Input
                                    id="standard-adornment-amount"
                                    fullWidth
                                    name="email"
                                    value={email}
                                    onChange={handleLoginInputChange}
                                    endAdornment={
                                        <InputAdornment position="end">
                                              
                                            {ValidateEmail(email) ? 
                                                <Tooltip title="El correo esta correctamente escrito" aria-label="good">
                                                    <CheckCircleOutlineIcon style={{ color: green[500]}}></CheckCircleOutlineIcon>
                                                </Tooltip> 
                                                : 
                                                <Tooltip title="El correo no esta correctamente escrito" aria-label="bad">
                                                    <HighlightOffIcon color="secondary"></HighlightOffIcon>
                                                </Tooltip> }   
                                              
                                        </InputAdornment>
                                    }
                                />
                                <br/>
                                <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                                <Input
                                    id="standard-adornment-password"
                                    type={values.showPassword ? 'text' : 'password'}
                                    onChange={handleLoginInputChange}
                                    fullWidth
                                    name="password"
                                    value={password}
                                    endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            >
                                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                        {ValidatePassword(password)? 
                                                <Tooltip title="La contraseña tiene mmás de 3 caracteres" aria-label="good">
                                                    <CheckCircleOutlineIcon style={{ color: green[500]}}></CheckCircleOutlineIcon>
                                                </Tooltip> 
                                                : 
                                                <Tooltip title="La contraseña tiene menos de 3 caracteres" aria-label="bad">
                                                    <HighlightOffIcon color="secondary"></HighlightOffIcon>
                                                </Tooltip> 
                                        }
                                    </InputAdornment>
                                    }
                                />
                        </div>   
                        <div className="text-align">
                            <br/>
                            <Link to ="#">
                                <Typography component = {"span"} className={classes.pos} color="textSecondary">
                                    ¿Olvidaste tu contraseña?
                                </Typography>
                            </Link>
                            
                        </div>
                        <div >
                            {loginfail && <Alert severity="error"> Email o contraseña incorrectos</Alert>}
                        </div>
                        <br/>
                        <div className="FormCenter">
                            <Button variant="outlined" type="submit" className="btnSubmit" value="Login">
                                Iniciar Sesión
                            </Button>
                        </div>
                    </form>
                </DialogContent>
                <div className="FormCenter">
                    <Link to ="#">
                        <Typography component = {"span"} className={classes.pos} color="textSecondary">
                            ¿No tienes cuenta? Registrate
                        </Typography>
                    </Link>
                </div>
                <br/>
            </Dialog>
        </div>
    )
}
