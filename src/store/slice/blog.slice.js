const { createSlice } = require("@reduxjs/toolkit");
import axios from "axios";

const blogRepo = async (id)=>{
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/${id}`)
   return response
}

const blogListRepo = async (params)=>{
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs`,{params})
   return response
}

const allBlogListRepo = async ()=>{
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog`)
   return response
}

const initialState = {
    loading: false,
    blog: null,
    blogError: null,
    blogListLoading: false,
    blogList: null,
    blogListError: null,
    loadingAllBlogs: false,
    allBlogs: null,
    allBlogError: null
}
const userSlice = createSlice({
    name: "blogReducer",
    initialState,
    reducers: {
        loading(state, action){
            return {
                ...state,
                loading: true
            }
        },
        getBlogData(state, action){
            return{
                ...state,
                loading: false,
                blog: action.payload
            }
        },
        blogError(state, action){
            return{
                ...state,
                loading: false,
                blog: null,
                blogError: action.payload
            }
        },
        userBloglistLoading(state, action){
            return{
                ...state,
                blogListLoading: true
            }
        },
        userBloglistData(state, action){
            return{
                ...state,
                blogListLoading: false,
                blogList: action.payload
            }
        },
        userBloglistError(state, action){
            return {
                ...state,
                blogList: null,
                blogListError: action.payload
            }
        },
        allBlogLoading(state, action){
            return {
                ...state,
                loadingAllBlogs: true
            }
        },
        allBlogs(state, action){
            return {
                ...state,
                loadingAllBlogs: false,
                allBlogs: action.payload
            }
        },
        allBlogError(state, action){
            return {
                ...state,
                loadingAllBlogs: false,
                allBlogError: action.payload 
            }
        }
    }
})

export const {
    loading, getBlogData, blogError,
    userBloglistLoading, userBloglistData, userBlog,
    allBlogLoading, allBlogs, allBlogError
} = userSlice.actions

export const fetchblog = (id)=>{
    return async (dispatch)=>{
        dispatch(loading(false))
        console.log('ljbsfvjhjdfhfd', id)
        await blogRepo(id)
       .then(response=>{
        dispatch(getBlogData(response?.data?.data))
       })
       .catch(err=>{
            dispatch(blogError(err.message))
       })
    }
}

export const fetchblogList = (params)=>{
    return async (dispatch)=>{
        dispatch(userBloglistLoading(false))
        console.log('Blog list params', params)
        await blogListRepo(params)
       .then(response=>{
        dispatch(userBloglistData(response?.data?.data))
       })
       .catch(err=>{
            dispatch(userBlog(err.message))
       })
    }
}

export const fetchAllBlogList = ()=>{
    return async (dispatch)=>{
        dispatch(allBlogLoading(false))
        await allBlogListRepo()
       .then(response=>{
        dispatch(allBlogs(response?.data?.data))
       })
       .catch(err=>{
            dispatch(allBlogError(err.message))
       })
    }
}

export default userSlice.reducer