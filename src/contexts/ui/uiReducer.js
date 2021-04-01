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
        case types.ui.setConfirmData:
            return{
                ...state,
                confirmModalData: action.payload,
            };
        default:
            return state;
    }
}