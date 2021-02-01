import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Button,
    TextField,
    Link,
} from '@material-ui/core';
import Logo from '../../assets/img/Logo.png';
import Alert from '@material-ui/lab/Alert';
import { ModalFormWithImage } from '../../components/ModalFormWithImage';
import { useForm } from '../../hooks/useForm';
import { register } from '../../services/AuthService';
import { useAuthState } from '../../contexts/AuthContext';
import { useUiState } from '../../contexts/UiContext';


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
        width: '100%',
        justifyContent: 'center',
        paddingBottom: 30,
    },
    link: {
        marginTop: 10,
        marginBottom: 10,
    }
}));

export const RegisterModal = React.memo(() => {
    const classes = useStyles();
    const { uiState, setUiState } = useUiState(); // TODO: Probablemente haya que tener un context para aspectos de interfaz.
    const { setAuthState } = useAuthState();
    const [ error, setError ] = useState(null);
    const [ formData, handleInputChange, reset ] = useForm({
        name: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleClose = () => {
        setUiState((prevState) => ({
            ...prevState,
            isRegisterModalOpen: false,
        }));
        reset();
        setError(null);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword){
            console.log('Contraseñas no coinciden.');
            return;
        }
        let response = await register(setAuthState, formData);
        if (!response.data) {
            setError(response.message);
        } else {
            handleClose();
        }
        
    };

    const toLogin = (e) => {
        e.preventDefault();
        console.log('Redirijir al login...');
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
                    { error && <Alert severity="error">{ error }</Alert> }
                    <TextField margin="dense" name="name" value={formData.name} onChange={handleInputChange} label="Nombres" type="text" fullWidth />
                    <TextField margin="dense" name="lastname" value={formData.lastname} onChange={handleInputChange} label="Apellidos" type="text" fullWidth />
                    <TextField margin="dense" name="email" value={formData.email} onChange={handleInputChange} label="Email" type="email" fullWidth />
                    <TextField margin="dense" name="password" value={formData.password} onChange={handleInputChange} label="Contraseña" type='password' fullWidth />
                    <TextField margin="dense" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} label="Repetir contraseña" type='password' fullWidth />
                    <Link className={classes.link} href='#' align='right' variant="body1" onClick={toLogin}>
                        ¿Ya tienes cuenta?
                    </Link>
                    <div className={classes.footer}>
                        <Button color="primary" variant='outlined' type='submit' fullWidth>
                            Registrarme
                        </Button>
                    </div>
                </form>
            }
        />
    );
});