import types from "types";


export const uiReducer = ( state, action ) => {
    switch (action.type) {
        case types.ui.toggleModal:
            return {
                ...state,
                ['is' + action.payload + 'ModalOpen']: !state['is' + action.payload + 'ModalOpen'],
            };
        case types.ui.toggleRegisterModal:
            return {
                ...state,
                isRegisterModalOpen: !state.isRegisterModalOpen,
            };
        case types.ui.updateFolderPath:
            if (state.folderPath !== action.payload) {
                return {
                    ...state,
                    folderPath: action.payload,
                };
            } else return state;
        case types.ui.toggleWitchOpenModal:
            return {
                ...state,
                setWitchOpenModal: !state.setWitchOpenModal,
            };
        case types.ui.setFolder:
            return {
                ...state,
                folder: action.payload,
            };
        case types.ui.setConfirmData:
            return{
                ...state,
                confirmModalData: action.payload,
            };
        case types.ui.setPDF:
            return{
                ...state,
                pdf: {
                    ...state.pdf,
                    typeUserPDF: action.payload
                },
            };
        case types.ui.setResourceLink:
            return{
                ...state,
                resourceLink: action.payload,
            };
        case types.ui.setEvaluation:
            return{
                ...state,
                evaluationData: action.payload,
            };
        case types.ui.setPDFConfig:
            return{
                ...state,
                pdf: {
                    ...state.pdf,
                    [action.payload.field]: action.payload.value
                },
            };
        case types.ui.setUserSaveDesign:
            return {
                ...state,
                userSaveDesign: action.payload,
            };
        case types.ui.setHistoryInCheckSaveDesign:
            return{
                ...state,
                historyData: action.payload,
            };
        case types.ui.setScrollToNewActivity:
            return{
                ...state,
                newActivity: action.payload,
            };
        case types.ui.setScrollToNewTask:
            return{
                ...state,
                newTask: action.payload,
            };
        default:
            return state;
    }
}