import { Backdrop, Box, Button, CircularProgress, Container, makeStyles, Step, StepLabel, Stepper, TextField, Typography } from '@material-ui/core';
import { Code, Done, Email, VpnKey } from '@material-ui/icons';
import React, { useState } from 'react';
import { changeUserPassword, getUserByEmail, resendVerificationCode } from 'services/UserService';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router';

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
            padding: 0,
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
            paddingRight: 20,
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
        [theme.breakpoints.down('sm')]: {
            padding: 40,
        },
    },
    input: {
        marginTop: 30,
    },
    codeForm: {
        width: '100%',
        display: 'flex',
        marginTop: 30,
    },
    codeButton: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
    },
    codeInput: {
        '& fieldset': {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
        }
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const emailInitialValue = {
    value: '',
    error: null
};

const codeInitialValue = {
    value: '',
    error: null
};

const passwordInitialValue = {
    password: '',
    confirm: '',
    passwordError: null,
    confirmError: null
};

export const ResetPasswordPage = () => {
    const classes = useStyles();
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [uid, setUid] = useState(null);
    const [verificationCode, setVerificationCode] = useState(null);
    const [codeForm, setCodeForm] = useState(codeInitialValue);
    const [email, setEmail] = useState(emailInitialValue);
    const [passwordForm, setPasswordForm] = useState(passwordInitialValue);
    const steps = [
        { icon: Email, label: 'Buscar cuenta por email' },
        { icon: Code, label: 'Código de verificación' },
        { icon: VpnKey, label: 'Restablecer contraseña' },
        { icon: Done, label: 'Contraseña restablecida' },
    ];

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
        if (!passwordForm.password.trim().length) return setPasswordForm({
            ...passwordForm,
            passwordError: 'Este campo es obligatorio',
        });
        if (!passwordForm.confirm.trim().length) return setPasswordForm({
            ...passwordForm,
            confirmError: 'Este campo es obligatorio',
        });
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
        setVerificationCode(null);
        setEmail(emailInitialValue);
    };

    const handleChangeEmail = ({ target }) => {
        setEmail({
            value: target.value,
            error: null,
        });
    };

    const handleSearchAccount = async (e) => {
        e.preventDefault();
        if (!email.value.trim().length) return setEmail({
            ...email,
            error: 'Este campo es obligatorio',
        });
        if (!isEmailValid()) return;
        setLoading(true);
        const resp = await getUserByEmail(email.value);
        setLoading(false);
        if (!resp.ok) return enqueueSnackbar(resp.message, { variant: 'error', autoHideDuration: 5000 });
        enqueueSnackbar('Se ha enviado un código de verificación a su correo electrónico.', { variant: 'success', autoHideDuration: 5000 });
        setVerificationCode(resp.data.randomCode);
        setUid(resp.data.user._id);
        handleNext();
    };

    const handleVerifyCode = (e) => {
        e.preventDefault();
        if(codeForm.value.trim().toUpperCase() !== verificationCode.trim().toUpperCase()) return setCodeForm({
            ...codeForm,
            error: 'El código ingresado no coincide'
        });
        handleNext();
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if(!paswordsMatchs()) return;
        const resp = await changeUserPassword({ uid, newPassword: passwordForm.password });
        if (!resp.ok) return enqueueSnackbar(resp.message, { variant: 'error', autoHideDuration: 5000 });
        enqueueSnackbar(resp.message, { variant: 'success', autoHideDuration: 5000 });
        handleNext();
    };

    const handleChangePassword = ({target}) => {
        setPasswordForm({
            ...passwordForm,
            [target.name]: target.value,
            passwordError: null,
            confirmError: null,
        });
    }
    
    const handleChangeCode = ({target}) => {
        setCodeForm({
            ...codeForm,
            value: target.value,
            error: null,
        });
    }

    const handleResendCode = async (e) => {
        setLoading(true);
        setCodeForm(codeInitialValue);
        const resp = await resendVerificationCode(email.value);
        setLoading(false);
        if (!resp.ok) return enqueueSnackbar(resp.message, { variant: 'error', autoHideDuration: 5000 });
        enqueueSnackbar(resp.message, { variant: 'success', autoHideDuration: 2000 });
        setVerificationCode(resp.data.randomCode);
    }
    
    const handleFinish = (e) => {
        e.preventDefault();
        history.push('/');
    };

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
    
    const verificationCodeForm = () => {
        return (
            <Box className={classes.content}>
                <Typography variant='h5' align='center' gutterBottom>
                    Código de verificación
                </Typography>
                <Typography variant='body1' align='center' gutterBottom>
                    Introduce el código de verificación que hemos enviado a tu correo electrónico.
                    Si este no ha llegado a tu correo, puedes reenviar un código haciendo click en el botón "Reenviar Código".
                </Typography>
                <div className={classes.codeForm}>
                    <TextField
                        className={classes.codeInput}
                        value={codeForm.value}
                        error={!!codeForm.error}
                        helperText={codeForm.error}
                        onChange={handleChangeCode}
                        label='Código verificación'
                        type='text'
                        placeholder='Ingresa código verificación'
                        variant='outlined'
                        inputProps={{ style: { textTransform: "uppercase"} }}
                        fullWidth
                        />
                    <Button
                        className={classes.codeButton}
                        size='small'
                        variant="contained" 
                        color="primary"
                        disableElevation 
                        onClick={handleResendCode}
                    >
                        Reenviar Código
                    </Button>
                </div>
            </Box>
        );
    };

    const resetPasswordForm = () => {
        return (
            <Box className={classes.content}>
                <Typography variant='h5' align='center' gutterBottom>
                    Restablecer contraseña
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

    const finishStep = () => {
        return (
            <Box className={classes.content}>
                <Typography variant='h5' align='center' gutterBottom>
                    Contraseña restablecida
                </Typography>
                <Typography variant='body1' align='center' gutterBottom>
                    La contraseña de su cuenta se ha reestablecido con éxito.
                    Por favor haga click en el boton "Finalizar" para redirigirlo a la página de inicio.
                </Typography>
            </Box>
        );
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return emailForm();
            case 1:
                return verificationCodeForm();
            case 2:
                return resetPasswordForm();
            case 3:
                return finishStep();
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
                <form className={classes.body} onSubmit={activeStep === 0 ? handleSearchAccount : activeStep === 1 ? handleVerifyCode : activeStep === 2 ? handleResetPassword : handleFinish } noValidate>
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
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Container>
    );
};
