import React, { useContext, createContext, useReducer } from 'react';
import { uiReducer } from 'contexts/ui/uiReducer';

const UiContext = createContext();

export function useUiState() {
	const context = useContext(UiContext);
	if (context === undefined) {
		throw new Error('useUiState must be used within a UiProvider');
	}

	return context;
}

const initialState = {
	folderPath: '/',
	isLoginModalOpen: false,
	isRegisterModalOpen: false,
	isLearningResultModalOpen: false,
	isEditProfileModalOpen: false,
	isContactsModalOpen: false,
	isConfirmationModalOpen: false,
	isShareModalOpen: false,
	setWichOpenModal: false,
	isFolderModalOpen: false,
	isPDFModalOpen: false,
	isResourceModalOpen: false,
	isEvaluationModalOpen: false,
	isImportDesignsModalOpen: false,
	isCheckSaveDesignModalOpen: false,
	userSaveDesign: true,
	isAssessmentModalOpen: false,
	folder: {
		_id: null,
		name: '',
	},
	confirmModalData: {
		type: null,
		args: null,
		actionMutation: null,
	},
	pdf: {
		typeUserPDF: null,
	},
	resourceLink:{
		learningActivityIndex: null,
		taskIndex: null,
	},
	evaluationData:{
		learningActivityIndex: null,
	},
	historyData:{
		url: null,
	},
	newActivity: false,
	newTask: false,
};

export const UiProvider = ({ children }) => {

	const [ uiState, dispatch ] = useReducer(uiReducer, initialState);

	return (
		<UiContext.Provider value={ { uiState, dispatch } }>
			{ children }
		</UiContext.Provider>
	);
};
