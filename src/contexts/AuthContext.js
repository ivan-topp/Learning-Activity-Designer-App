import React, { useEffect } from 'react';
import { checkingToken } from '../services/AuthService';

const AuthStateContext = React.createContext();

export function useAuthState() {
	const context = React.useContext(AuthStateContext);
	if (context === undefined) {
		throw new Error('useAuthState must be used within a AuthProvider');
	}

	return context;
}

export const AuthProvider = ({ children }) => {

	const [authState, setAuthState] = React.useState({
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
		<AuthStateContext.Provider value={ { authState, setAuthState } }>
				{children}
		</AuthStateContext.Provider>
	);
};
