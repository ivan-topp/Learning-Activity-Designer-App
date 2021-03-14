import { createContext, useContext, useEffect } from "react";
import { useSocket } from "hooks/useSocket";
import { useAuthState } from "./AuthContext";

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
    const { socket, online, connectSocket, disconnectSocket } = useSocket('http://localhost:4000');
    
    useEffect(() => {
        const logged = !!authState.token;
        if( logged ) connectSocket();
    }, [ authState.token, connectSocket ]);

    useEffect(()=>{
        const logged = !!authState.token;
        if( !logged ) disconnectSocket();
    }, [ authState.token, disconnectSocket ]);

    return (
        <SocketContext.Provider value={{ socket, online }}>
            { children }
        </SocketContext.Provider>
    );
};