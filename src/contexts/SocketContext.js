import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { useSocket } from "hooks/useSocket";
import { useAuthState } from "./AuthContext";
import { useSnackbar } from "notistack";

export const SocketContext = createContext();

export const useSocketState = () => {
	const context = useContext(SocketContext);
	if (context === undefined) {
		throw new Error('useSocketState must be used within a SocketProvider');
	}
	return context;
}

export const SocketProvider = ({ children }) => {

    const { authState } = useAuthState();
    const { socket, online, connectSocket, disconnectSocket } = useSocket(process.env.REACT_APP_SOCKET_URL);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const snackbarRef = useRef(null);
    useEffect(() => {
        if(!authState.checking && authState.user && !online) {
            if (snackbarRef.current === null) snackbarRef.current = enqueueSnackbar('Se ha perdido la conexión. Intentando reconectar...', { variant: 'warning', persist: true });
        } else {
            if (snackbarRef.current !== null) {
                closeSnackbar(snackbarRef.current);
                snackbarRef.current = null;
            }
        }
    }, [online, snackbarRef, closeSnackbar, enqueueSnackbar, authState.checking, authState.user]);
    
    useEffect(() => {
        const logged = !!authState.token;
        if( logged ) connectSocket();
    }, [ authState.token, connectSocket ]);

    useEffect(()=>{
        const logged = !!authState.token;
        if( !logged ) disconnectSocket();
    }, [ authState.token, disconnectSocket ]);

    const emitWithTimeout = useCallback(
        (onSuccess, onTimeout, timeout=20000) => {
            let called = false;

            const timer = setTimeout(() => {
                if (called) return;
                called = true;
                if(onTimeout) onTimeout();
            }, timeout);
            
            return (...args) => {
                if (called) return;
                called = true;
                clearTimeout(timer);
                if(onSuccess) onSuccess.apply(this, args);
            }
        },
        [],
    )

    return (
        <SocketContext.Provider value={{ socket, online, emitWithTimeout }}>
            { children }
        </SocketContext.Provider>
    );
};