import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

export const useSocket = (serverPath) => {
    const socket = useMemo(() => io.connect(serverPath, {
        transports: ['websocket']
    }), [serverPath]);
    const [online, setOnline] = useState(false);

    useEffect(() => {
        socket.on('connect', () => setOnline(true));
        socket.on('disconnect', () => setOnline(false));
    }, [socket]);


    return {
        socket,
        online
    };
};