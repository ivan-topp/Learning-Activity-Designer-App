import React, { useState } from 'react';
import {
    Button,
    makeStyles,
    //IconButton,
    //InputAdornment,
    //InputLabel,
    //Input,
    //Tooltip,
    TextField,
    Link
} from '@material-ui/core';
//import {
//    Visibility,
//    VisibilityOff,
//    CheckCircleOutlineIcon,
//    HighlightOffIcon,
//
//} from '@material-ui/icons/Visibility';
//import { green } from '@material-ui/core/colors';
import Alert from '@material-ui/lab/Alert';

import Logo from '../../assets/img/Logo.png';
import './styles.css'
import { useForm } from '../../hooks/useForm';
import { useUiState } from '../../contexts/UiContext';
import { ModalFormWithImage } from '../../components/ModalFormWithImage';
import { login } from '../../services/AuthService';
import { useAuthState } from '../../contexts/AuthContext';
const useStyles = makeStyles((theme) => ({
    formcontrol: {
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        width: 'fit-content',
    },
    margin: {
        margin: theme.spacing(1),
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '10%',
        marginRight: '10%',
        width: '80%',
    },
    logo: {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 250,
        marginTop: 15,
        marginBottom: 15,
    },
    footer: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        paddingBottom: 30,
    },
    link: {
        marginTop: 10,
        marginBottom: 10,
    }

}));


export const LoginModal = () => {

    const classes = useStyles();
    const { uiState, setUiState } = useUiState();
    const { setAuthState } = useAuthState();

    const [error, setError] = useState(false);
    //const [values, setValues] = useState({
    //    password: '',
    //});
    const [formLoginValues, handleInputChange, reset] = useForm({
        email: 'aguzman2016@alu.uct.cl',
        password: '123'
    });

    const { email, password } = formLoginValues;

    const validateEmail = (email) => {
        if (/^[-\w.%+]{1,64}@(?:[A-Z0-9]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(email)) {
            return true;
        } else {
            return false;
        }
    };

    const validatePassword = (password) => {
        if (password.length >= 3) {
            return true;
        } else {
            return false;
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (validateEmail(email) && validatePassword(password)) {
            let response = await login(setAuthState, { email, password });
            if (!response.data) {
                setError(response.message);
            }else{
                handleClose();
            }
            
            /*const res = await fetchWithoutToken('auth/login', { email, password }, 'POST');
            const body = await res.json();
            console.log(body);
            if (body.ok) {
                setError(false);
                localStorage.setItem('user', JSON.stringify(body.data.user));
                localStorage.setItem('token', body.data.token);
                //localStorage.setItem('token-init-date', new Date().getTime());
            } else {
                setError(true);
            }*/
        }
    };

    const handleClose = () => {
        setUiState((prevState) => ({
            ...prevState,
            isLoginModalOpen: false,
        }));
        reset();
    };

    const recoverPassword = (e) => {
        e.preventDefault();
        console.log('Redirigir a recuperar contraseña...');
    }


    //const handleClickShowPassword = () => {
    //    setValues({ ...values, showPassword: !values.showPassword });
    //};
    //const handleMouseDownPassword = (event) => {
    //    event.preventDefault();
    //};

    const toRegister = (e) => {
        e.preventDefault();
        console.log('Redirijir al login...');
    };

    return (
        <>
            <ModalFormWithImage
                isOpen={ uiState.isLoginModalOpen }
                handleClose={ handleClose }
                title='¡Bienvenido!'
                subtitle='Completa los campos para registrar tu cuenta'
                image={<img className={classes.logo} src={Logo} alt="Logo" />}
                content={
                    <form className={classes.form} onSubmit={handleLogin} noValidate>
                        { error && <Alert severity="error"> Email o contraseña incorrectos</Alert> }
                        <TextField margin="dense" name="email" value={email} onChange={handleInputChange} label="Email" type="email" fullWidth />
                        <TextField margin="dense" name="password" value={password} onChange={handleInputChange} label="Contraseña" type='password' fullWidth />
                        {/*<InputLabel htmlFor="standard-adornment-password">Email</InputLabel>
                        <Input
                            type={values.showPassword ? 'text' : 'password'}
                            onChange={handleInputChange}
                            fullWidth
                            name="email"
                            value={email}
                            endAdornment={
                                <InputAdornment position="end">

                                    {ValidateEmail(email) ?
                                        <Tooltip title="El correo esta correctamente escrito" aria-label="good">
                                            <CheckCircleOutlineIcon style={{ color: green[500] }}></CheckCircleOutlineIcon>
                                        </Tooltip>
                                        :
                                        <Tooltip title="El correo no esta correctamente escrito" aria-label="bad">
                                            <HighlightOffIcon color="secondary"></HighlightOffIcon>
                                        </Tooltip>}

                                </InputAdornment>
                            }
                        />*/}
                        {/*<InputLabel htmlFor="standard-adornment-password">Contraseña</InputLabel>
                        <Input
                            type={values.showPassword ? 'text' : 'password'}
                            onChange={handleInputChange}
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
                        />*/}
                        
                        <Link className={classes.link} href='#' align='right' variant="body1" onClick={recoverPassword}>
                            ¿Olvidaste tu contraseña?
                        </Link>
                        <Link className={classes.link} href="#" align='right' variant="body1" onClick={ toRegister }>
                            ¿No tienes cuenta? Registrate
                        </Link>
                        <div className={classes.footer}>
                            <Button color="primary" variant='outlined' type='submit' fullWidth>
                                Iniciar Sesión
                            </Button>
                        </div>
                    </form>
                }
            />
        </>
    )
}
