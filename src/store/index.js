import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slice/user.slice"
import blogReducer from "./slice/blog.slice"

export const rootReducer =  combineReducers({
    userData: userReducer,
    blogData: blogReducer
})
