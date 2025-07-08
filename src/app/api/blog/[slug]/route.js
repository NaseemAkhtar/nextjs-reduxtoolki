import { NextResponse } from "next/server";
import { connect } from "@/db";
import { Blog } from "@/models/blog.model";
import { verifyJwtToken } from "@/lib/jwt";


export async function GET(req, res){
    await connect() 
    const slug = res.params.slug

    try{
        if(!slug){
            return NextResponse.json({
                message: "Blog slug required",
                success: false
            },{status: 404})
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

        if(!blog){
            return NextResponse.json({
                message: "Blog does not exist",
                success: false
            },{status: 404})
        }

        return NextResponse.json({
            success: true,
            data: blog
        },{status: 200})

    } catch(err){
        console.error("Error fetching blog:", err)
        return NextResponse.json({
            error: err.message,
            success: false
        },{status: 500})
    }
}

export async function PUT(req, res){
    await connect()

    const id = res.params.id
    const accessToken = req.headers.get("authorization")
    const token = accessToken?.split(" ")[1]

    const verifyToken =  verifyJwtToken(token)
    if(!accessToken || !verifyToken){
        return NextResponse.json({
            message: "Unauthorized (wrong or expire tooken)"
        },{status: 403})
    }

    try{
        const body = await req.json()
        const blog = await Blog.findById(id).populate("authorId")
        if(blog?.authorId?._id?.toString() !== verifyToken?._id?.toString()){
            return NextResponse.json({
                message: "Only author can edit this blog"
            },{status: 403})
        }
        const updateBlog = await Blog.findByIdAndUpdate(
            id,
            {$set: {...body}},
            {new: true}
        )   
        return NextResponse.json({
            message: "Blog Updated successfully!",
            data: updateBlog
        },{status: 200})
    } catch(err){
        return NextResponse.json({
            error: err.message
        },{status: 500})
    }

}

export async function DELETE(req, res){
    await connect()

    const id = res?.params?.id
    const accessToken = req?.headers?.get("authorization")
    const token = accessToken?.split(" ")[1]
    const verifyToken = verifyJwtToken(token)

    if(!id){
        return NextResponse.json({
            message: "Blog id is required",
            success: false
        },{status: 403})
    }

    if(!accessToken || !verifyToken){
        return NextResponse.json({
            message: "Unauthorized token"
        },{status: 403})
    }

    try{
        const blog = await Blog.findById(id).populate("authorId")
        if(blog?.authorId?._id.toString() !== verifyToken?._id.toString()){
            return NextResponse.json({
                message: "Only Author can delete this blog"
            },{status: 403})
        }

        await Blog.findByIdAndDelete(id)

        return NextResponse.json({
            message: "Blog deleted successfully!",
        },{status: 200})

    } catch(err){
        return NextResponse.json({
            error: err.message
        },{status: 500})
    }
}