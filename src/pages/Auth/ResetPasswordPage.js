import { Box, Button, Container, makeStyles, Step, StepLabel, Stepper, TextField, Typography } from '@material-ui/core';
import { Code, Email, VpnKey } from '@material-ui/icons';
import React, { useState } from 'react';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 128px)',
        height: 'auto',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: `1px solid ${theme.palette.divider}`,
        padding: 10,
        borderRadius: theme.shape.borderRadius,
        height: '100%',
        [theme.breakpoints.down('xs')]: {
            borderStyle: 'none',
        },
    },
    backButton: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    buttonZone: {
        display: 'flex',
        justifySelf: 'flex-end',
        justifyContent: 'flex-end',
        [theme.breakpoints.down('sm')]: {
            marginTop: 30,
        },
    },
    body: {
        maxWidth: 600,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        [theme.breakpoints.up('sm')]: {
            height: 450,
        },
    },
    content: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20,
        //backgroundColor: 'green',
    },
    input: {
        marginTop: 30,
    },
}));

export const ResetPasswordPage = () => {
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [email, setEmail] = useState({
        value: '',
        error: null
    });
    const [passwordForm, setPasswordForm] = useState({
        password: '',
        confirm: '',
        passwordError: null,
        confirmError: null
    });
    const steps = [
        { icon: Email, label: 'Buscar cuenta por email' },
        { icon: Code, label: 'Código de verificación' },
        { icon: VpnKey, label: 'Restablecer contraseña' },
    ];
    //console.log(email);

    const isEmailValid = () => {
        if (!/^[-\w.%+]{1,64}@(?:[A-Z0-9]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(email.value)) {
            setEmail((prevState) => ({
                ...prevState,
                error: 'El correo debe tener la siguiente estructura: example@example.com',
            }));
            return false;
        }
        return true;
    };

    const paswordsMatchs = () => {
        if(!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/.test(passwordForm.password)){
            setPasswordForm((prevState) => ({
                ...prevState,
                passwordError: 'La contraseña debe tener al menos un carácter en minúscula, uno en mayúscula, un número y debe tener entre 8 y 16 caractéres de longitud.',
            }));
            return false;
        }
        if (passwordForm.password !== passwordForm.confirm) {
            setPasswordForm((prevState) => ({
                ...prevState,
                passwordError: 'Las contraseñas no coinciden.',
                confirmError: 'Las contraseñas no coinciden.'
            }));
            return false;
        }
        return true;
    }

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleChangeEmail = ({ target }) => {
        setEmail({
            value: target.value,
            error: null,
        });
    };

    const handleSearchAccount = (e) => {
        e.preventDefault();
        if (!email.value.trim().length) return setEmail({
            ...email,
            error: 'Este campo es obligatorio',
        });
        if (!isEmailValid()) return;
        //TODO: Petición al backend para buscar cuenta de usuario.
        const resp = { ok: true };
        if (!resp.ok) return;
        handleNext();
        console.log(email);
    };

    const handleVerifyCode = (e) => {
        e.preventDefault();
        console.log('Verificar código');
        handleNext();
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        if (!passwordForm.password.trim().length) return setPasswordForm({
            ...passwordForm,
            passwordError: 'Este campo es obligatorio',
        });
        if (!passwordForm.confirm.trim().length) return setPasswordForm({
            ...passwordForm,
            confirmError: 'Este campo es obligatorio',
        });
        if(!paswordsMatchs()) return ;

        console.log('Resetear contraseña...');
    };

    const handleChangePassword = ({target}) => {
        setPasswordForm({
            ...passwordForm,
            [target.name]: target.value,
            passwordError: null,
            confirmError: null,
        });
    }

    const emailForm = () => {
        return (
            <Box className={classes.content}>
                <Typography variant='h5' align='center' gutterBottom>
                    Busca tu cuenta por correo electrónico
                </Typography>
                <Typography variant='body1' align='center' gutterBottom>
                    Introduce la dirección de correo electrónico asociada a tu cuenta para poder identificarte.
                </Typography>
                <TextField
                    className={classes.input}
                    label='Email'
                    type='email'
                    value={email.value}
                    error={!!email.error}
                    helperText={email.error}
                    onChange={handleChangeEmail}
                    placeholder='Ingresa correo electrónico'
                    variant='outlined'
                    fullWidth
                    autoFocus
                />
            </Box>
        );
    };

    const codeForm = () => {
        return (
            <Box className={classes.content}>
                <Typography variant='h5' align='center' gutterBottom>
                    Código de verificación
                </Typography>
                <Typography variant='body1' align='center' gutterBottom>
                    Introduce el código de verificación que hemos enviado a tu correo electrónico.
                    Si este no ha llegado a tu correo, puedes reenviar un código haciendo click en el botón "Reenviar".
                </Typography>
                <TextField
                    className={classes.input}
                    value=''
                    label='Código verificación'
                    type='text'
                    placeholder='Ingresa código verificación'
                    variant='outlined'
                    fullWidth
                />
            </Box>
        );
    };

    const resetPasswordForm = () => {
        return (
            <Box className={classes.content}>
                <Typography variant='h5' align='center' gutterBottom>
                    Reestablecer contraseña
                </Typography>
                <Typography variant='body1' align='center' gutterBottom>
                    Complete el siguiente formulario para reestablecer su contraseña.
                </Typography>
                <TextField
                    name='password'
                    className={classes.input}
                    value={passwordForm.password}
                    onChange={handleChangePassword}
                    error={!!passwordForm.passwordError}
                    helperText={passwordForm.passwordError}
                    label='Nueva contraseña'
                    type='password'
                    placeholder='Ingresa la nueva contraseña'
                    variant='outlined'
                    fullWidth
                />
                <TextField
                    name='confirm'
                    className={classes.input}
                    value={passwordForm.confirm}
                    onChange={handleChangePassword}
                    error={!!passwordForm.confirmError}
                    helperText={passwordForm.confirmError}
                    label='Confirmar contraseña'
                    type='password'
                    placeholder='Ingresa nuevamente la nueva contraseña'
                    variant='outlined'
                    fullWidth
                />
            </Box>
        );
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return emailForm();
            case 1:
                return codeForm();
            case 2:
                return resetPasswordForm();
            default:
                return 'Unknown step';
        }
    }

    return (
        <Container className={classes.root}>
            <Box className={classes.container}>
                <Stepper style={{width:'100%'}} activeStep={activeStep} alternativeLabel>
                    {steps.map((step) => (
                        <Step key={step.label}>
                            <StepLabel>{step.label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <form className={classes.body} onSubmit={activeStep === 0 ? handleSearchAccount : activeStep === 1 ? handleVerifyCode : handleResetPassword } noValidate>
                    {getStepContent(activeStep)}
                        <Box className={classes.buttonZone}>
                            {activeStep === 1 && (<Button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                className={classes.backButton}
                                >
                                Volver
                            </Button>)}
                            <Button disableElevation variant="contained" type='submit' color="primary">
                                {activeStep === steps.length - 1 ? 'Finalizar': 'Siguiente'}
                            </Button>
                        </Box>
                </form>
            </Box>
        </Container>
    );
};
