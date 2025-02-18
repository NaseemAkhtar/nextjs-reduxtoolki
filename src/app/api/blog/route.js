import { connect } from "@/db";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/jwt";
import { Blog } from "@/models/blog.model";

export async function POST(req){
    await connect()
    const accessToken = await req.headers.get("authorization")
    const token = accessToken.split(" ")[1]

    const decodeToken = verifyJwtToken(token)
console.log(decodeToken ,"???????", token)
    if(!accessToken || !decodeToken){
        return NextResponse.json({
            error: "Unauthorised user found"
        },{status: 403})
    }

    try{
        const body = await req.json()
        const newBlog = await Blog.create(body)

        return NextResponse.json({
            success: true,
            message: "Blog create successfully",
            data: newBlog
        },{status: 201})
    } catch(err){
        return NextResponse.json({
            error: err.message
        },{status: 500})
    }
}

export async function GET(req){
    await connect()
    try{
        const blogs = await Blog.find({})
        .populate({
            path: "authorId",
            // strictPopulate: false,
            select: "-password"
        }).sort({createdAt: -1})

        return NextResponse.json({
            message: "Fetched All blog succesfully",
            success: true,
            data: blogs
        },{status: 200})
    } catch(err){
        return NextResponse.json({
            error: err.message,
            
        },{status: 500})
    }
}