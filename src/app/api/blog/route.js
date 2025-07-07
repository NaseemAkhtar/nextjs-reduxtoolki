import { connect } from "@/db";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/jwt";
import { Blog } from "@/models/blog.model";

export async function POST(req){
    await connect()
    const accessToken = await req.headers.get("authorization")
    const token = accessToken.split(" ")[1]

    const decodeToken = verifyJwtToken(token)
// console.log(decodeToken ,"???????", token)
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
        console.error("Error creating blog:", err)
        return NextResponse.json({
            error: err.message
        },{status: 500})
    }
}

export async function GET(req) {
  await connect()
  try {
      const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const total = await Blog.countDocuments({})

    const blogs = await Blog.find({})
      .select('title image slug createdAt authorId')
      .populate({
        path: 'authorId',
        select: 'name email',
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    return NextResponse.json({
        message: 'Fetched blogs successfully',
        success: true,
        data: blogs,
        total,
        page,
        limit
    }, { status: 200 })

  } catch (err) {
    return NextResponse.json({
      error: err.message,
    }, { status: 500 })
  }
}
