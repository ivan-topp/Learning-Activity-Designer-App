import React, { useState, useContext, createContext } from 'react';

const UiContext = createContext();

export function useUiState() {
	const context = useContext(UiContext);
	if (context === undefined) {
		throw new Error('useUiState must be used within a AuthProvider');
	}

	return context;
}

export const UiProvider = ({ children }) => {

	const [uiState, setUiState] = useState({
		isLoginModalOpen: false,
		isRegisterModalOpen: false,
		isEditProfileModalOpen: false,
		isContactsModalOpen: false,
    });

	return (
		<UiContext.Provider value={ { uiState, setUiState } }>
			{ children }
		</UiContext.Provider>
	);
};
