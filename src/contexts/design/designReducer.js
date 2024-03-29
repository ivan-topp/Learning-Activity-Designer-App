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
            learningActivities.forEach((la, index) => {
                if(la.id === action.payload.learningActivityID){
                    la.tasks.forEach((t, i)=>{
                        if(t.id === action.payload.taskID){
                            if(action.payload.subfield !== null) learningActivities[index].tasks[i][action.payload.field][action.payload.subfield] = action.payload.value;
                            else learningActivities[index].tasks[i][action.payload.field] = action.payload.value;
                        }
                    });
                }
            });
            //if (action.payload.subfield !== null) learningActivities[action.payload.learningActivityIndex].tasks[action.payload.index][action.payload.field][action.payload.subfield] = action.payload.value;
            //else learningActivities[action.payload.learningActivityIndex].tasks[action.payload.index][action.payload.field] = action.payload.value;
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
                    category: {
                        _id: null,
                        name: null,
                    },
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
        case types.design.addDesignKeyword:
            return {
                ...state,
                design: {
                    ...state.design,
                    keywords: [...state.design.keywords, action.payload],
                }
            };
        case types.design.removeDesignKeyword:
            return {
                ...state,
                design: {
                    ...state.design,
                    keywords: [...state.design.keywords.filter(k => k !== action.payload)],
                }
            };

        case types.design.updateReadOnlyLink:
            return {
                ...state,
                design: {
                    ...state.design,
                    readOnlyLink: action.payload,
                }
            };
        case types.design.setAssessments:
            return {
                ...state,
                design: {
                    ...state.design,
                    assessments: action.payload,
                }
            };
        case types.design.setScoreMean:
            return {
                ...state,
                design: {
                    ...state.design,
                    metadata: {
                        ...state.design.metadata,
                        scoreMean: action.payload,
                    },
                }
            };
        case types.design.commentDesign:
            const comments = [...state.design.comments];
            const existentCommentary = comments.find(c => c._id.toString() === action.payload._id.toString());
            const index = comments.indexOf(existentCommentary);
            if(existentCommentary && index !== -1) comments[index] = action.payload;
            else comments.push(action.payload);
            return {
                ...state,
                design: {
                    ...state.design,
                    comments,
                }
            };
        case types.design.deleteComment:
            return {
                ...state,
                design: {
                    ...state.design,
                    comments: state.design.comments.filter(c => c._id.toString() !== action.payload.toString()),
                }
            };
        case types.design.reorderActivities:
            return  {
                ...state,
                design: {
                    ...state.design,
                    data: {
                        ...state.design.data,
                        learningActivities: state.design.data.learningActivities.sort((a, b) => {
                            if(action.payload.indexOf(a.id) === -1) return 1;
                            else if(action.payload.indexOf(b.id) === -1) return -1;
                            else return action.payload.indexOf(a.id) - action.payload.indexOf(b.id);
                        } )
                    },
                }
            };
        case types.design.reorderTasks:
            const newLearningActivities = state.design.data.learningActivities;
            newLearningActivities.forEach((la, index) => {
                if(la.id === action.payload.learningActivityId){
                    newLearningActivities[index].tasks.sort((a, b) => {
                        if(action.payload.newOrder.indexOf(a.id) === -1) return 1;
                        else if(action.payload.newOrder.indexOf(b.id) === -1) return -1;
                        else return action.payload.newOrder.indexOf(a.id) - action.payload.newOrder.indexOf(b.id);
                    } );
                }
            });
            return  {
                ...state,
                design: {
                    ...state.design,
                    data: {
                        ...state.design.data,
                        learningActivities: newLearningActivities,
                    },
                }
            };
        case types.design.setConnectedUsers:
            return {
                ...state,
                users: action.payload,
            };
        default:
            return state;
    }
}