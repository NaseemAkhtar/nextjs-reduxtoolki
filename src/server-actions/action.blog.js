'use server'
import { connect } from "@/db";
import { verifyJwtToken } from "@/lib/jwt";
import { Blog } from "@/models/blog.model";
import { User } from "@/models/user.model";


export const createPost = async (body, accessToken)=>{
    await connect()

    const decodeToken = verifyJwtToken(accessToken)
    if(!accessToken || !decodeToken){
        return {
            message: "Unauthorized User",
            status: 401,
            success: false
        }
    }

    try{
        const newBlog = await Blog.create(body)

        return {
            success: true,
            message: "Blog create successfully",
            status: 201,
            data: newBlog.toObject()
        }
    } catch(err){
        console.error("Error creating blog:", err)
        return {
            error: err.message || "Something went wrong",
            status: 500,
            success: false
        }
    }
}

export async function getAllBlogs({page = 1, limit = 10} = {}) {
    await connect();
    try{    
        const skip = (page - 1) * limit;
        const total = await Blog.countDocuments({});
        const blogs = await Blog.find({})
            .select('title image slug createdAt authorId excerpt')
            .populate({
                path: "authorId",
                select: "name email designation avatar",
            })
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
            .lean();

            const serializedBlogs = blogs.map(blog => ({ //JSON.parse(JSON.stringify(blogs));
                ...blog,
                _id: blog._id.toString(),
                createdAt: blog.createdAt.toISOString(),
                authorId: {
                    ...blog.authorId,       
                    _id: blog.authorId._id.toString(),
                }
            }));
            return {
                success: true,
                message: "Fetched blogs successfully",
                data: serializedBlogs,
                status: 200,
                total,
                page,
                limit
            }
    } catch(err){
        return {
            error: err.message || "Something went wrong",
            status: 500
        }
    }
}

export const getBlogBySlug = async (slug) => {
    await connect() 

    try{
        if(!slug){
            return {
                message: "Blog slug required",
                status: 404,
                data: [],
                success: false
            }
        }
        

        let newSlug = {}
        if(slug.includes("-")){
            newSlug.slug = slug
        } else {
            newSlug._id = slug
        }
        
        let blog = await Blog.findOne(newSlug).populate({
            path: "authorId",
            select: "-password"
        })
        .populate({
            path: "comments.user",
            select: "-password"
        })

        let serializedBlog = JSON.parse(JSON.stringify(blog))

        if(!blog){
            return {
                message: "Blog does not exist",
                status: 404,
                success: false,
                data: []
            }
        }

        return {
            message: "Blog fetched successfully",
            success: true,
            status: 200,
            data: serializedBlog
        }

    } catch(err){
        console.error("Error fetching blog:", err)
        return {
            error: err.message || "Something went wrong",
            success: false,
            status: 500
        }
    }
}

export const updateBlog = async (slug, body, accessToken) => {
    await connect()

    const decodeToken = verifyJwtToken(accessToken)
    if(!accessToken || !decodeToken){
        return {
            message: "Unauthorized User",
            status: 401,
            success: false
        }
    }

    try{
        let newSlug = {}
        if(slug.includes("-")){
            newSlug.slug = slug
        } else {
            newSlug._id = slug
        }

        let blog = await Blog.findOne(newSlug).populate("authorId")
        if(!blog){
            return {
                message: "Blog not found",
                status: 404,
                success: false
            }
        }
        if(blog.authorId._id.toString() !== decodeToken._id.toString()){
            return {
                message: "You are not authorized to update this blog",
                status: 403,
                success: false
            }
        }

        let updatedBlog = await Blog.findOneAndUpdate(newSlug, {$set: {...body}}, {new: true})
        if(!updatedBlog){
            return {
                message: "Blog update failed",
                status: 500,
                success: false
            }
        }
        return {
            success: true,
            message: "Blog updated successfully",
            status: 200,
            data: JSON.parse(JSON.stringify(updatedBlog))
        }   
    } catch(err){
        console.error("Error updating blog:", err)
        return {
            error: err.message || "Something went wrong",
            status: 500,
            success: false
        }
    }
}

export const deleteBlog = async (slug, accessToken) => {
    await connect()

    const decodeToken = verifyJwtToken(accessToken)
    if(!accessToken || !decodeToken){
        return {
            message: "Unauthorized User",
            status: 401,
            success: false
        }
    }

    try{
        let newSlug = {}
        if(slug.includes("-")){
            newSlug.slug = slug
        } else {
            newSlug._id = slug
        }

        let blog = await Blog.findOne(newSlug).populate("authorId")
        if(!blog){
            return {
                message: "Blog not found",
                status: 404,
                success: false
            }
        }
        if(blog.authorId._id.toString() !== decodeToken._id.toString()){
            return {
                message: "You are not authorized to delete this blog",
                status: 403,
                success: false
            }
        }

        let deletedBlog = await Blog.findOneAndDelete(newSlug)
        if(!deletedBlog){
            return {
                message: "Blog delete failed",
                status: 500,
                success: false
            }
        }

        return {
            success: true,
            message: "Blog deleted successfully",
            status: 200,
        }
    } catch(err){
        console.error("Error deleting blog:", err)
        return {
            error: err.message || "Something went wrong",
            status: 500,
            success: false
        }
    }
}

export const addComment = async (slug, body, accessToken) => {
    await connect()
    if(!body?.text || !accessToken){
        return {
            message: "Comment and user are required",
            status: 400,
            success: false
        }
    }
    const decodeToken = verifyJwtToken(accessToken)
    if(!accessToken || !decodeToken){
        return {
            message: "Unauthorized User",
            status: 401,
            success: false
        }
    }

    try{
        let newSlug = {}
        if(slug.includes("-")){
            newSlug.slug = slug
        } else {
            newSlug._id = slug
        }

        const blog = await Blog.findOne(newSlug).populate("authorId")
        const user = await User.findById(decodeToken._id).select("-password")
        if(!blog){
            return {
                message: "Blog not found",
                status: 404,
                success: false
            }
        }

        const newComment = {
            text: body.text,
            user
        }   
        blog.comments.push(newComment)
        let comment = await blog.save()
        if(!comment){
            return {
                message: "Comment could not be added",
                status: 500,
                success: false
            }
        }   
        const serializedComment = JSON.parse(JSON.stringify(comment.comments.at(-1)))
        return {
            message: "Comment added successfully",
            status: 201,
            success: true,
            data: serializedComment
        }

    } catch(err){
        console.error("Error adding comment:", err)
        return {
            error: err.message || "Something went wrong",
            status: 500,
            success: false
        }
    }
}

export const deleteComment = async (slug, body, accessToken) => {
    await connect()
    if(!body?.postId || !body?.commentId || !accessToken){
        return {
            message: "Post ID, comment ID and user are required",
            status: 400,
            success: false
        }
    }
    const decodeToken = verifyJwtToken(accessToken)
    if(!accessToken || !decodeToken){
        return {
            message: "Unauthorized User",
            status: 401,
            success: false
        }
    }

    try{
        let newSlug = {}
        if(body.postId.includes("-")){
            newSlug.slug = body.postId
        } else {
            newSlug._id = body.postId
        }

        const blog = await Blog.findOne(newSlug).populate("authorId").populate("comments.user")
        
        const comment  = blog?.comments.find(comment=> comment?._id?.toString() === body.commentId?.toString())
        
        if(!comment){
            return {
                message: "Comment does not exist",
                status: 404,
                success: false
            }
        }

        if(comment.user._id.toString() !== decodeToken._id.toString()){
            return {
                message: "You are not authorized to delete this comment",
                status: 403,
                success: false
            }
        }

        blog.comments = blog.comments.filter(comment => comment._id.toString() !== body.commentId.toString())
        
        await blog.save()

        return {
            message: "Comment deleted successfully",
            status: 200,
            success: true
        }

    } catch(err){
        console.error("Error deleting comment:", err)
        return {
            error: err.message || "Something went wrong",
            status: 500,
            success: false
        }
    }
}

export const likeBlog = async (slug, accessToken) => {
    await connect()
    if(!slug || !accessToken){
        return {
            message: "Blog slug and user are required",
            status: 400,
            success: false
        }
    }
    const decodeToken = verifyJwtToken(accessToken)
    if(!accessToken || !decodeToken){
        return {
            message: "Unauthorized User",
            status: 401,
            success: false
        }
    }

    try{
        let newSlug = {}
        if(slug.includes("-")){
            newSlug.slug = slug
        } else {
            newSlug._id = slug
        }

        const blog = await Blog.findOne(newSlug).populate("authorId")
        if(!blog){
            return {
                message: "Blog not found",
                status: 404,
                success: false
            }
        }

        if(blog.likes.includes(decodeToken._id)){
            blog.likes = blog.likes.filter(like => like.toString() !== decodeToken._id.toString())
        } else {
            blog.likes.push(decodeToken._id)
        }

        await blog.save()

        return {
            message: "Blog liked/unliked successfully",
            status: 200,
            success: true,
            likes: JSON.parse(JSON.stringify(blog.likes))
        }

    } catch(err){
        console.error("Error liking/unliking blog:", err)
        return {
            error: err.message || "Something went wrong",
            status: 500,
            success: false
        }
    }
}