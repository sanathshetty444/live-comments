import { combineReducers } from "@reduxjs/toolkit";
import homeReducer from "./home/slice";

const rootReducer = combineReducers({
    home: homeReducer.reducer,
});

export default rootReducer;
