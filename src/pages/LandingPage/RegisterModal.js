import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Button,
    TextField,
    Link,
} from '@material-ui/core';
import Logo from 'assets/img/Logo.png';
import Alert from '@material-ui/lab/Alert';
import { ModalFormWithImage } from 'components/ModalFormWithImage';
import { useForm } from 'hooks/useForm';
import { useAuthState } from 'contexts/AuthContext';
import { useUiState } from 'contexts/ui/UiContext';
import { types } from 'types/types';

const useStyles = makeStyles((theme) => ({
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
        flexDirection:'column',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 30,
        paddingBottom: 15,
    }
}));

const initialErrors = {
    nameError: null,
    lastnameError: null,
    emailError: null,
    passwordError: null,
    confirmPasswordError: null,
};

export const RegisterModal = React.memo(() => {
    const classes = useStyles();
    const { uiState, dispatch } = useUiState();
    const { register } = useAuthState();
    const [ errorFromServer, setErrorFromServer ] = useState(null);
    const [ formErrors, setFormErrors ] = useState(initialErrors);
    const [ formData, handleInputChange, reset ] = useForm({
        name: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const { name, lastname, email, password, confirmPassword } = formData;
    const { nameError, lastnameError, emailError, passwordError, confirmPasswordError } = formErrors;
    
    const handleClose = () => {
        dispatch({ type: types.ui.toggleRegisterModal});
        reset();
        setFormErrors(initialErrors);
        setErrorFromServer(null);
    };
    
    const isFormComplete = () => {
        return Object.keys( formData ).map((key, index) => {
            if(formData[key].trim() === ''){
                setFormErrors((prevState)=>({
                    ...prevState,
                    [ key + 'Error']: 'Este campo es requerido.',
                }));
                return false;
            } else {
                setFormErrors((prevState)=>({
                    ...prevState,
                    [ key + 'Error']: null,
                }));
            }
            return true;
        }).reduce((a, b) => a && b);
    }

    const paswordsMatchs = () => {
        if(!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/.test(password)){
            setFormErrors((prevState) => ({
                ...prevState,
                passwordError: 'La contraseña debe tener al menos un carácter en minúscula, uno en mayúscula, un número y debe tener entre 8 y 16 caractéres de longitud.',
            }));
            return false;
        }
        if (password.trim() !== confirmPassword.trim()) {
            setFormErrors((prevState) => ({
                ...prevState,
                passwordError: 'Las contraseñas no coinciden.',
                confirmPasswordError: 'Las contraseñas no coinciden.'
            }));
            return false;
        }
        return true;
    }

    const handleInputFormChange = (e) => {
        setErrorFromServer(null);
        setFormErrors((prevState)=>({
            ...prevState,
            [ e.target.name + 'Error']: null,
        }));
        handleInputChange(e);
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!isFormComplete()) return;
        if (!paswordsMatchs()) return;
        let resp = await register( formData );
        if (!resp.ok) setErrorFromServer(resp.message);
    };

    const toLogin = (e) => {
        e.preventDefault();
        handleClose();
        dispatch({ type: types.ui.toggleLoginModal});
    };

    return (
        <ModalFormWithImage
            isOpen={ uiState.isRegisterModalOpen }
            handleClose={ handleClose }
            title='¡Bienvenido!'
            subtitle='Completa los campos para registrar tu cuenta'
            image={<img className={classes.logo} src={Logo} alt="Logo" />}
            content={
                <form className={classes.form} onSubmit={handleRegister} noValidate>
                    { errorFromServer && <Alert severity="error">{ errorFromServer }</Alert> }
                    <TextField
                        variant='outlined'
                        error={!!nameError}
                        helperText={ nameError } 
                        margin="dense" 
                        name="name" 
                        value={ name } 
                        onChange={ handleInputFormChange } 
                        label="Nombres" 
                        type="text" 
                        fullWidth
                    />
                    <TextField
                        variant='outlined'
                        error={!!lastnameError}
                        helperText={ lastnameError } 
                        margin="dense" 
                        name="lastname" 
                        value={ lastname } 
                        onChange={ handleInputFormChange } 
                        label="Apellidos" 
                        type="text" 
                        fullWidth 
                    />
                    <TextField
                        variant='outlined'
                        error={!!emailError}
                        helperText={ emailError } 
                        margin="dense" 
                        name="email" 
                        value={ email } 
                        onChange={ handleInputFormChange } 
                        label="Email" 
                        type="email" 
                        fullWidth 
                    />
                    <TextField
                        variant='outlined'
                        error={!!passwordError}
                        helperText={ passwordError } 
                        margin="dense" 
                        name="password" 
                        value={ password } 
                        onChange={ handleInputFormChange } 
                        label="Contraseña" 
                        type='password' 
                        fullWidth 
                    />
                    <TextField
                        variant='outlined'
                        error={!!confirmPasswordError}
                        helperText={ confirmPasswordError } 
                        margin="dense" 
                        name="confirmPassword" 
                        value={ confirmPassword } 
                        onChange={ handleInputFormChange } 
                        label="Repetir contraseña" 
                        type='password' 
                        fullWidth 
                    />
                    
                    <div className={classes.footer}>
                        <Button color="primary" variant='outlined' type='submit' fullWidth>
                            Registrarme
                        </Button>
                        <Link href='#' style={{paddingTop:20, paddingBottom:15}} variant="body1" onClick={toLogin}>
                            ¿Ya tienes cuenta?
                        </Link>
                    </div>
                    
                </form>
            }
        />
    );
});