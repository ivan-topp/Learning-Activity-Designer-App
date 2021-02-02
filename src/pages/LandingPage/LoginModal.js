import React, { useState } from 'react';
import {
    Button,
    makeStyles,
    IconButton,
    TextField,
    Link
} from '@material-ui/core';

import { Visibility, VisibilityOff } from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import Logo from '../../assets/img/Logo.png';
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
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 30,
        paddingBottom: 15,
    },

    link: {
        marginTop: 10,
        marginBottom: 10,
    }

}));
const initialErrors = {
    emailError: null,
    passwordError: null,
};

export const LoginModal = () => {

    const classes = useStyles();
    const { uiState, setUiState } = useUiState();
    const { setAuthState } = useAuthState();
    const [formErrors, setFormErrors] = useState(initialErrors);
    const [error, setError] = useState(false);
    const [values, setValues] = useState({
        password: '',
    });
    const [formLoginValues, handleInputChange, reset] = useForm({
        email: 'aguzman2016@alu.uct.cl',
        password: 'Mameluco123'
    });

    const { email, password } = formLoginValues;

    const { emailError, passwordError } = formErrors;
    const isFormComplete = () => {
        return Object.keys(formLoginValues).map((key, index) => {
            if (formLoginValues[key].trim() === '') {
                setFormErrors((prevState) => ({
                    ...prevState,
                    [key + 'Error']: 'Este campo es requerido.',
                }));
                return false;
            } else {
                setFormErrors((prevState) => ({
                    ...prevState,
                    [key + 'Error']: null,
                }));
            }
            return true;
        }).reduce((a, b) => a && b);
    };


    const isEmailValid = () => {
        if (!/^[-\w.%+]{1,64}@(?:[A-Z0-9]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(email)) {
            setFormErrors((prevState) => ({
                ...prevState,
                emailError: 'El correo debe tener la siguiente estructura: example@example.com',
            }));
            return false;
        }
        return true;
    };

    const isPasswordValid = () => {
        if (!password.length >= 8 && !password.length <= 16) {
            setFormErrors((prevState) => ({
                ...prevState,
                passwordError: 'La contraseña debe tener entre 8 y 16 caracteres.',
            }));
            return false;
        }
        return true;
    };



    const handleLogin = async (e) => {
        e.preventDefault();
        if (!isFormComplete()) return;
        if (!isEmailValid()) return;
        if (!isPasswordValid()) return;

        let response = await login(setAuthState, { email, password });
        if (!response.data) {
            setError(response.message);
        } else {
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


    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const toRegister = (e) => {
        e.preventDefault();
        console.log('Redirijir al login...');
    };

    return (
        <>
            <ModalFormWithImage
                isOpen={uiState.isLoginModalOpen}
                handleClose={handleClose}
                title='¡Bienvenido!'
                subtitle='Completa los campos para ingresar con tu cuenta'
                image={<img className={classes.logo} src={Logo} alt="Logo" />}
                content={
                    <form className={classes.form} onSubmit={handleLogin} noValidate>
                        {error && <Alert severity="error"> Email o contraseña incorrectos</Alert>}


                        <TextField
                            error={!!emailError}
                            helperText={emailError}
                            margin="dense"
                            variant="outlined"
                            name="email"
                            value={email}
                            onChange={handleInputChange}
                            label="Email"
                            type="email"
                            fullWidth />

                        <TextField
                            error={!!passwordError}
                            helperText={passwordError}
                            margin="dense"
                            variant="outlined"
                            name="password"
                            value={password}
                            onChange={handleInputChange}
                            label="Contraseña"
                            type={values.showPassword ? 'text' : 'password'}
                            fullWidth
                            InputProps={{
                                endAdornment:
                                    <IconButton
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>

                            }} />


                        <div className={classes.footer}>
                            <Button color="primary" variant='outlined' type='submit' fullWidth>
                                Iniciar Sesión
                            </Button>
                            <div style={{ paddingTop: 20 }}>
                                <Link href='#' align='center' variant="body1" onClick={recoverPassword}>
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                            <div style={{ paddingBottom: 15, paddingTop: 10 }}>
                                <Link href="#" variant="body1" onClick={toRegister}>
                                    ¿No tienes cuenta? Registrate
                                </Link>
                            </div>

                        </div>



                    </form>
                }
            />
        </>
    )
}
