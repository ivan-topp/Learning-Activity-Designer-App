import React, { useState, useEffect, useContext, createContext } from 'react';
import { checkingToken } from '../services/AuthService';

const AuthContext = createContext();

export function useAuthState() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuthState must be used within a AuthProvider');
	}

	return context;
}

export const AuthProvider = ({ children }) => {

	const [authState, setAuthState] = useState({
		checking: true,
		user: null,
		token: null,
	});

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem('user'));
		const token = localStorage.getItem('token');
		if(user !== null && token !== null){
			checkingToken(setAuthState);
		}else{
			setAuthState((prevState)=>({
				...prevState,
				checking: false,
			}));
		}
	  }, []);

	useEffect(() => {
		if(authState.user === null){
			localStorage.removeItem('user');
		}else{
			localStorage.setItem('user', JSON.stringify(authState.user));
		}
	}, [authState.user]);

	useEffect(() => {
		if(authState.token === null){
			localStorage.removeItem('token');
		}else{
			localStorage.setItem('token', authState.token);
		}
	}, [authState.token]);

	return (
		<AuthContext.Provider value={ { authState, setAuthState } }>
			{children}
		</AuthContext.Provider>
	);
};
