import React, { useContext, createContext, useReducer } from 'react';
import { designReducer } from 'contexts/design/designReducer';

const DesignContext = createContext();

export function useDesignState() {
	const context = useContext(DesignContext);
	if (context === undefined) {
		throw new Error('useDesignState must be used within a DesignProvider');
	}

	return context;
}

const initialState = {
	design: null,
	currentLearningResult: {
		category: null,
		verb: null,
		description: null,
	},
};

export const DesignProvider = ({ children }) => {

	const [ designState, dispatch ] = useReducer(designReducer, initialState);

	return (
		<DesignContext.Provider value={ { designState, dispatch } }>
			{ children }
		</DesignContext.Provider>
	);
};
