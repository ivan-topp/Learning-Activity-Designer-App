import React, { createContext, useCallback, useContext, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { useAuthState } from './AuthContext';
import { formatName } from 'utils/textFormatters';

const SharedDocContext = createContext();

export function useSharedDocContext() {
    const context = useContext(SharedDocContext);
    if (context === undefined) {
        throw new Error('SharedDocContext must be used within a SharedDocProvider');
    }
    return context;
}

export const SharedDocProvider = ({ children }) => {
    const [doc, setDoc] = useState(null);
    const [provider, setProvider] = useState(null);
    const [user, setUser] = useState(null);
    const [connected, setConnected] = useState(false);
    const { authState } = useAuthState();

    const connectToDesign = useCallback(
        ( id ) => {
            if (provider) return false;
            if (!authState.user) return false;
            const yDoc = new Y.Doc({guid: id});
            setDoc(yDoc);
            const wsProvider = new WebsocketProvider(process.env.REACT_APP_Y_WEBSOCKET_SERVER, id, yDoc);
            const preparedUser = {
                name: formatName(authState.user.name, authState.user.lastname),
                color: authState.user.color,
            };
            wsProvider.awareness.setLocalStateField('user', preparedUser);
            wsProvider.on('status', event => {
                if(event.status === 'connected'){
                    setConnected(true);
                } else {
                    setConnected(false);
                }
            });
            setProvider(wsProvider);
            setUser(preparedUser);
        },
        [provider, authState.user],
    );

    const clearDoc = useCallback(
        () => {
            setDoc(null);
            setProvider(null);
            setUser(null);
        },
        [setDoc, setProvider, setUser],
    );

    return (
        <SharedDocContext.Provider value={{
            doc,
            provider,
            connectToDesign,
            clearDoc,
            user,
            connected,
        }}>
            {children}
        </SharedDocContext.Provider>
    );
}