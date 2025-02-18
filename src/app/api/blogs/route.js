import { connect } from "@/db";
import { NextResponse } from "next/server";
import { Blog } from "@/models/blog.model";

export async function GET(req, res){
    await connect()

    const { searchParams } = new URL(req.url);
    const authorId = searchParams.get("userId")
    const blogs = await Blog.find({authorId}).populate({
        path: "authorId",
        select: "-password -__v"
    }).sort({createdAt: -1})

    if(!blogs?.length){
        return NextResponse.json({
            message:"404 blogs not found"
        },{status:403})
    }
    try{
        return NextResponse.json({
            message:"User blogs",
            data: blogs
        },{status:200})
    }catch(err){
        return NextResponse.json({
            error: error.message,
            success: false
        },{status: 500})
    }
}