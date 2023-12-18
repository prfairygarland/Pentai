import {
    TESTLOGIN,
    LOGOUT
} from "./testActionType";

const initialState = {}

export const testReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case TESTLOGIN:
            return {
                ...initialState,
                payload
            }
            case LOGOUT:
                return {
                    payload
                }

        default:
            return state
    }
}
