import { createContext, useContext } from "react";
import { useSocket } from "../hooks/useSocket";

export const SocketContext = createContext();

export const useSocketState = () => {
	const context = useContext(SocketContext);
	if (context === undefined) {
		throw new Error('useSocketState must be used within a SocketProvider');
	}
	return context;
}

export const SocketProvider = ({ children }) => {

    const { socket, online } = useSocket('http://localhost:4000');

    return (
        <SocketContext.Provider value={{ socket, online }}>
            { children }
        </SocketContext.Provider>
    );
};