const { createSlice } = require("@reduxjs/toolkit");
import axios from "axios";

const userRepo = async (data)=>{
    console.log('user slice data????', data)
    return await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/user`, {
        headers :{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data?.user?.accessToken}`
        }
    })
}

const initialState = {
    loading: false,
    user: null,
    userError: null
}
const userSlice = createSlice({
    name: "userReducer",
    initialState,
    reducers: {
        loading(state, action){
            return {
                ...state,
                loading: true
            }
        },
        getUserData(state, action){
            return{
                ...state,
                loading: false,
                user: action.payload
            }
        },
        userError(state, action){
            return{
                ...state,
                loading: false,
                user: null,
                userError: action.payload
            }
        }
    }
})

export const {loading, getUserData, userError} = userSlice.actions

export const fetchUser = (data)=>{
    return async (dispatch)=>{
        dispatch(loading(false))
        await userRepo(data)
       .then(response=>{
        console.log('slice data???new', response?.data?.data)
        dispatch(getUserData(response.data?.data))
       })
       .catch(err=>{
            dispatch(userError("User not authenticated"))
       })
    }
}

export default userSlice.reducer