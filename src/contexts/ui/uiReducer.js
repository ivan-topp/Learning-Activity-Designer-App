import { types } from "../../types/types";


export const uiReducer = ( state, action ) => {
    switch (action.type) {
        case types.ui.toggleLoginModal:
            return {
                ...state,
                isLoginModalOpen: !state.isLoginModalOpen,
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
        default:
            return state;
    }
}