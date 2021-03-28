import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { useAuthState } from './AuthContext';

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
    const { authState } = useAuthState();

    useEffect(() => {
        if(doc) return;
        setDoc(new Y.Doc());
    }, [setDoc, doc]);

    const connectToDesign = useCallback(
        ( id ) => {
            if (!doc) return false;
            if (provider) return false;
            if (!authState.user) return false;
            const colors = [
                '#30bced',
                '#6eeb83',
                '#ffbc42',
                '#ecd444',
                '#ee6352',
                '#9ac2c9',
                '#8acb88',
                '#1be7ff'
            ];
            setProvider(new WebsocketProvider(process.env.REACT_APP_Y_WEBSOCKET_SERVER, id, doc));
            setUser({
                name: authState.user.name,
                color: colors[Math.floor(Math.random() * colors.length)],
            });
        },
        [doc, provider, authState.user],
    );

    return (
        <SharedDocContext.Provider value={{
            doc,
            provider,
            connectToDesign,
            user,
        }}>
            {children}
        </SharedDocContext.Provider>
    );
}