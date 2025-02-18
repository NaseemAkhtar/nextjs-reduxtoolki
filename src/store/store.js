import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import {rootReducer} from "./index"

export const store = configureStore({
    reducer:rootReducer,
    middleware: (getDefaultMiddleware)=> getDefaultMiddleware().concat(thunk)
})