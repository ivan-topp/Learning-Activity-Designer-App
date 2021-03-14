import { useAuthState } from "contexts/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const useSocket = (serverPath) => {
    const [socket, setSocket] = useState(null);
    const [online, setOnline] = useState(false);
    const { authState } = useAuthState();

    const connectSocket = useCallback(() => {
        const token = authState.token;
        const tempSocket = io.connect( serverPath, {
            transports: ['websocket'],
            autoConnect: true,
            forceNew: true,
            query: {
                'x-token': token,
            },
        });
        setSocket(tempSocket);
    }, [serverPath, authState.token]);

    const disconnectSocket = useCallback(() => {
        socket?.disconnect();
    }, [socket]);

    useEffect(() => {
        setOnline( socket?.connected );
    }, [socket])

    useEffect(() => {
        socket?.on('connect', () => setOnline(true));
        socket?.on('disconnect', () => setOnline(false));
    }, [socket]);


    return {
        socket,
        online,
        connectSocket,
        disconnectSocket
    };
};