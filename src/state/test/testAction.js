import {
    TESTLOGIN,
    LOGOUT
} from "./testActionType";

const testLogin = (payload) => {
    return {
        type: TESTLOGIN,
        payload : payload
    }
}

const testLogout = (payload) => {
    return {
        type: LOGOUT,
        payload : payload
    }
}

export {
    testLogin,
    testLogout
}
