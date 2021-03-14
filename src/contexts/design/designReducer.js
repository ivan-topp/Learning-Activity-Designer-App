import types from "types";


export const designReducer = ( state, action ) => {
    switch (action.type) {
        case types.design.updateDesign:
            return {
                ...state,
                design: action.payload,
            };
        case types.design.setCurrentLearningResultField:
            return {
                ...state,
                currentLearningResult: {
                    ...state.currentLearningResult,
                    [action.payload.field]: action.payload.value,
                }
            }
        case types.design.clearCurrentLearningResult:
            return {
                ...state,
                currentLearningResult: {
                    category: null,
                    verb: null,
                    description: null,
                    editing: false,
                    index: null,
                }
            }
        case types.design.setCurrentLearningResult:
            return {
                ...state,
                currentLearningResult: action.payload
            }
        case types.design.setBloomCategories:
            return {
                ...state,
                bloomCategories: action.payload
            }
        case types.design.setBloomVerbs:
            return {
                ...state,
                bloomVerbs: action.payload
            }
        default:
            return state;
    }
}