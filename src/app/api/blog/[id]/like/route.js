import { connect } from "@/db";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/jwt";
import { Blog } from "@/models/blog.model";

export async function PUT(req, res){
    await connect()

    const id = res.params.id
    const accessToken = req.headers.get("authorization")
    const token = accessToken?.split(" ")[1]

    const verifyToken = verifyJwtToken(token)

    if(!accessToken || !verifyToken){
        return NextResponse.json({
            message: "Unauthorized (worng or expired token)"
        },{status: 403})
    }
    
    try{
        const blog  = await Blog.findById(id)

        if(blog?.likes?.includes(verifyToken?._id)){
            blog.likes = blog.likes?.filter(id=> id?.toString() !== verifyToken?._id?.toString())
        } else {
            blog.likes.push(verifyToken?._id)
        }
        
        await blog.save()
        
        return NextResponse.json({
            message: "Like updated!",
            data: blog
        },{status: 200})
    } catch(err){
        return NextResponse.json({
            error: err.message
        },{status: 500})
    }

}