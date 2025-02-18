import { connect } from "@/db";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from 'next-auth';
// import { options } from "../../auth/[...nextauth]/auth";
import { verifyJwtToken } from "@/lib/jwt";

export async function GET(req, res){
    try{
        await connect()
        // let url = await req?.url
        // let query = new URL(url)
        const accessToken = req.headers.get("authorization")
        const token = accessToken?.split(" ")[1]

        const verifyToken =  verifyJwtToken(token)
        // const session = await getServerSession(options);
        console.log("session route......??? new",  verifyToken)
        // console.log(session.user,"Req params.....", query?.searchParams.get('uid'))
        const user = await User.findOne({_id:verifyToken?._id}).select("-password")
       
        if(!user){
            return NextResponse.json({
                success: false,
                message: "Your are not loggedin"
            },{status:400})
        }
        return NextResponse.json({
            success: true,
            message: "User found",
            data: user
        })
    } catch(err){
        return NextResponse,json({
            error: err.message
        },{status: 400})
    }
}

export async function PATCH(req, res){
    await connect()

    const accessToken = req.headers.get("authorization")
    const token = accessToken?.split(" ")[1]
    const verifyToken = verifyJwtToken(token)

    if(!accessToken || !verifyToken){
        return NextResponse.json({
            message: "Unauthorized (wrong or expire tooken)"
        },{status:403})
    }

    try{
        const body = await req.json()
        const user = await User.findById(verifyToken?._id)
        const id = user?._id?.toString()
        if(id !== verifyToken?._id?.toString()){
            return NextResponse.json({
                message: "Only user can update his/her profile"
            },{status: 403})
        }

        const updateUser = await User.findByIdAndUpdate(
            id,
            body,
            { new: true }
        ).select("-passwod -__v")
        if (!updateUser) {
            throw new Error('User not found');
        }
console.log('updateUser???????...', updateUser)
        return NextResponse.json({
            message: "Profile updated successfully!",
            data:updateUser
        },{status: 200})
        
    } catch(err){
        throw {
            status: 500,
            message: 'Internal Server Error',
            details: err.message
        };
        // return NextResponse.json({
        //     error: err.message
        // },{status: 500})
    }
}