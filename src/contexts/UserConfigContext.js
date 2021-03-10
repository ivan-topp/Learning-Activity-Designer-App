import { ThemeProvider } from '@material-ui/core';
import React, { useState, useContext, createContext, useEffect } from 'react'
import { useAuthState } from '../contexts/AuthContext';
import { getTheme } from '../theme/theme';

const UserConfigContext = createContext();

export function useUserConfigState() {
	const context = useContext(UserConfigContext);
	if (context === undefined) {
		throw new Error('useUserConfigState must be used within a UserConfigProvider');
	}
	return context;
}

export const UserConfigProvider = ({ children })=>{
	const { authState } = useAuthState();
    const [userConfig, setUserConfig] = useState({
        darkTheme:false,
        modeAdvanced: false
	});
	
	useEffect(() => {
		const darkTheme = JSON.parse(localStorage.getItem('darkTheme'));
		if(darkTheme !== null ){
			setUserConfig((prevState)=>({
				...prevState,
				darkTheme,
			}));
		}
	}, []);

	useEffect(() => {
        if(authState.user !== null){
            localStorage.setItem('darkTheme', JSON.stringify(userConfig.darkTheme));
        }  
    }, [authState.user, userConfig.darkTheme]);

	const theme = getTheme(userConfig.darkTheme);

	return (
		<UserConfigContext.Provider value={ { userConfig, setUserConfig } }>
			<ThemeProvider theme = {theme}>
				{ children }
			</ThemeProvider>
		</UserConfigContext.Provider>
	);
}