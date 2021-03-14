import React, { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { fetchWithoutToken, fetchWithToken } from 'utils/fetch';

const AuthContext = createContext();

export function useAuthState() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuthState must be used within a AuthProvider');
	}

	return context;
}

const initialState = {
    checking: true,
	user: null,
	token: null,
};

export const AuthProvider = ({ children }) => {
	const [authState, setAuthState] = useState(initialState);

	const login = async ( email, password ) => {
        const resp = await fetchWithoutToken('auth/login', { email, password }, 'POST');
        if(resp.ok){
            const { user, token } = resp.data;
            setAuthState({
                user: user,
                token: token,
                checking: false,
            });
        }
        return resp;
    };

	const register = async (userData) => {
        const resp = await fetchWithoutToken('auth/register', userData, 'POST');
        if(resp.ok){
            const { user, token } = resp.data;
            setAuthState({
                user: user,
                token: token,
                checking: false,
            });
        }
        return resp;
    };

	const logout = () => {
        setAuthState({
            checking: false,
            user: null,
			token: null,
        });
    };

	const verifyToken = useCallback( async () => {
        const token = localStorage.getItem('token');
        if(!token){
            setAuthState({
				user: null,
                token: null,
                checking: false,
            });
            return false;
        }
        const resp = await fetchWithToken('auth/renew');
        if(resp.ok){
            const { user, token } = resp.data;
            localStorage.setItem('token', token);
            setAuthState({
                user: user,
                token: token,
                checking: false,
            });
            return true;
        } else {
            setAuthState({
                user: null,
                token: null,
                checking: false,
            });
            return false;
        }
    }, []);

	useEffect(() => {
		if (authState.token === null) {
			localStorage.removeItem('token');
		} else {
			localStorage.setItem('token', authState.token);
		}
	}, [authState.token]);

	return (
		<AuthContext.Provider value={{ 
			authState,
			login,
			register,
			logout,
			verifyToken,
			setAuthState 
		}}>
			{children}
		</AuthContext.Provider>
	);
};
