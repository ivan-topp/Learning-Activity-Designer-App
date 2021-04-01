import types from "types";


export const designReducer = ( state, action ) => {
    switch (action.type) {
        case types.design.updateDesign:
            return {
                ...state,
                design: action.payload,
            };
        case types.design.changeMetadataField:
            if(action.payload.subfield !== null){
                return {
                    ...state,
                    design: {
                        ...state.design,
                        metadata: {
                            ...state.design.metadata,
                            [action.payload.field]: {
                                ...state.design.metadata[action.payload.field],
                                [action.payload.subfield]: action.payload.value,
                            },
                        }
                    }
                }
            } else{
                return {
                    ...state,
                    design: {
                        ...state.design,
                        metadata: {
                            ...state.design.metadata,
                            [action.payload.field]: action.payload.value,
                        }
                    }
                }
            }
        case types.design.changeTaskField:
            const learningActivities = state.design.data.learningActivities;
            if (action.payload.subfield !== null) learningActivities[action.payload.learningActivityIndex].tasks[action.payload.index][action.payload.field][action.payload.subfield] = action.payload.value;
            else learningActivities[action.payload.learningActivityIndex].tasks[action.payload.index][action.payload.field] = action.payload.value;
            // learningActivities: [...learningActivities.slice(0, learningActivityIndex), learningActivities[learningActivityIndex].task[], ...learningActivities.slice(learningActivityIndex)] 
            return {
                ...state,
                design: {
                    ...state.design,
                    data: {
                        ...state.design.data,
                        learningActivities,
                    }
                }
            }
            /*if(action.payload.subfield !== null){
                return {
                    ...state,
                    design: {
                        ...state.design,
                        data: {
                            ...state.design.data,
                            learningActivities: state.design.data.learningActivities.map(((learningActivity, index) => {
                                if (index === action.payload.learningActivityIndex) {
                                    learningActivity.tasks = learningActivity.tasks.map((task, index) => {
                                        if (index === action.payload.index){
                                            task[action.payload.field][action.payload.subfield] = action.payload.value;
                                        }
                                        return task;
                                    })
                                }
                                return learningActivity;
                            }))
                        }
                    }
                }
            } else{
                return {
                    ...state,
                    design: {
                        ...state.design,
                        data: {
                            ...state.design.data,
                            learningActivities: state.design.data.learningActivities.map(((learningActivity, index) => {
                                if (index === action.payload.learningActivityIndex) {
                                    learningActivity.tasks.map((task, index) => {
                                        if (index === action.payload.index){
                                            task[action.payload.field] = action.payload.value;
                                        }
                                        return task;
                                    })
                                }
                                return learningActivity;
                            }))
                        }
                    }
                }
            }*/
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
        case types.design.setDesignPrivileges:
            return {
                ...state,
                design: {
                    ...state.design,
                    privileges: action.payload
                }
            }
        default:
            return state;
    }
}