import { connect } from "@/db";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/jwt";
import { Blog } from "@/models/blog.model";
import { User } from "@/models/user.model";

export async function POST(req, res){
    await connect()
    const id = res?.params?.id
    const accessToken = req.headers.get("authorization")
    const token = accessToken?.split(" ")[1]
    const verifyToken = verifyJwtToken(token)

    if(!accessToken || !verifyToken){
        return NextResponse.json({
            message: "Unauthorized (wrong or expired token)"
        },{status: 403})
    }
    try{
        const body = await req.json()
        const blog = await Blog.findById(id)
        const user = await User.findById(verifyToken?._id).select("-password")
        const newComment = {
            text: body?.text,
            user
        }
        blog.comments.push(newComment)
        
        await blog.save()
        
        // console.log("verifyToken.....new...", blog?.comments?.at(-1))

        return NextResponse.json({
            message: "Comment created successfully!",
            data: blog?.comments?.at(-1)
        },{status: 201})

    }catch(err){
        return NextResponse.json({
            error: err.message
        },{status: 500})
    }
}

export async function DELETE(req) {
    await connect()
    const accessToken = req.headers.get("authorization")
    const token = accessToken?.split(" ")[1]
    const verifyToken = verifyJwtToken(token)
    console.log('accessToken????', accessToken, '...ans....', verifyToken)
    if(!accessToken || !verifyToken){
        return NextResponse.json({
            message: "Unauthorized (wrong or expired token)"
        },{status: 403})
    }
    
    try{
        const body = await req.json()
        const {postId, commentId} = body
        const blog = await Blog.findById(postId).populate("authorId").populate("comments.user")
        
        const comment  = blog?.comments.find(comment=> comment?._id?.toString() === commentId?.toString())
        
        if(!comment){
            return NextResponse.json({
                message: "Comment does not exist"
            },{status: 404})
        }
        
        if(comment?.user?._id?.toString() !== verifyToken?._id?.toString()){
            return NextResponse.json({
                message: "yoy are unauthorised to delete this blog"
            },{status: 403})
        }
        blog.comments = blog.comments?.filter(comment=> comment?._id?.toString() !== commentId.toString()) 
        // console.log("debugging.....1111???new ", blog.comments)

        await blog.save()

        return NextResponse.json({
            message:"Comment deleted successfully!",
            data: blog?.comments
        },{status: 200})
        
    } catch(err){
        return NextResponse.json({
            error: err.message
        },{status: 500})   
    }
}