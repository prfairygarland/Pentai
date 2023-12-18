import { combineReducers } from "redux";
import { testReducer } from "./test/testreducer";
import { sideBarState } from "./SideBar/sideBarReducer";

export const rootReducer = combineReducers({
    sideBarState,
    testReducer
})