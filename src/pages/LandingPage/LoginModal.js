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
import Logo from 'assets/img/Logo.png';
import { useForm } from 'hooks/useForm';
import { useUiState } from 'contexts/ui/UiContext';
import { ModalFormWithImage } from 'components/ModalFormWithImage';
import { useAuthState } from 'contexts/AuthContext';
import { types } from 'types/types';
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
    const { uiState, dispatch } = useUiState();
    const { login } = useAuthState();
    const [formErrors, setFormErrors] = useState(initialErrors);
    const [errorFromServer, setErrorFromServer] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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
        if (password.length >= 8 && password.length <= 16) return true;
        setFormErrors((prevState) => ({
            ...prevState,
            passwordError: 'La contraseña debe tener entre 8 y 16 caracteres.',
        }));
        return false;
    };

    const handleInputFormChange = (e) => {
        setErrorFromServer(null);
        setFormErrors((prevState) => ({
            ...prevState,
            [e.target.name + 'Error']: null,
        }));
        handleInputChange(e);
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!isFormComplete()) return;
        if (!isEmailValid()) return;
        if (!isPasswordValid()) return;
        const resp = await login(email, password);
        if (!resp.ok) setErrorFromServer(resp.message);
    };

    const handleClose = () => {
        dispatch({
            type: types.ui.toggleLoginModal
        });
        reset();
    };

    const recoverPassword = (e) => {
        e.preventDefault();
        console.log('Redirigir a recuperar contraseña...');
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const toRegister = (e) => {
        e.preventDefault();
        handleClose();
        dispatch({
            type: types.ui.toggleRegisterModal
        });
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
                        {errorFromServer && <Alert severity="error"> {errorFromServer}</Alert>}
                        <TextField
                            error={!!emailError}
                            helperText={emailError}
                            margin="dense"
                            variant="outlined"
                            name="email"
                            value={email}
                            onChange={handleInputFormChange}
                            label="Email"
                            type="email"
                            fullWidth
                        />
                        <TextField
                            error={!!passwordError}
                            helperText={passwordError}
                            margin="dense"
                            variant="outlined"
                            name="password"
                            value={password}
                            onChange={handleInputFormChange}
                            label="Contraseña"
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            InputProps={{
                                endAdornment:
                                    <IconButton
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>

                            }}
                        />
                        <div className={classes.footer}>
                            <Button variant='outlined' type='submit' fullWidth>
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
