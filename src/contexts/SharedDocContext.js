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

    const connectToDesign = useCallback(
        ( id ) => {
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
            const yDoc = new Y.Doc({guid: id});
            setDoc(yDoc);
            setProvider(new WebsocketProvider(process.env.REACT_APP_Y_WEBSOCKET_SERVER, id, yDoc));
            setUser({
                name: authState.user.name,
                color: colors[Math.floor(Math.random() * colors.length)],
            });
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
        }}>
            {children}
        </SharedDocContext.Provider>
    );
}