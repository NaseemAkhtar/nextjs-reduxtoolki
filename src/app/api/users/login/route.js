import { connect } from "@/db";
import { User } from "@/models/user.model";
import bcryptjs from "bcryptjs"
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

connect()

export async function POST(request){
    try{

        const reqBody = await request.json()
        const { email, password } = reqBody
    
        const user = await User.findOne({email})
    
        if(!user){
            return NextResponse.json({
                error: "User does't exist"
            },{status:400})
        }
    
        const validPassword = await bcryptjs.compare(password, user.password)
        if(!validPassword){
            return NextResponse.json({
                error:"Invalid password"
            },{status: 400})
        }
    
        const tokenData = {
            id: user._id,
            name: user.name,
            email: user.email,
        }
    console.log('login testing???? ',user)
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {expiresIn: "1d"})
    
        const response = NextResponse.json({
            message: "Login successfully",
            success: true,
            data: {name:user.name, email:user.email}
        })
        response.cookies.set("token", token, {
            httpOnly: true
        })
    
        return response
    } catch(err){
        return NextResponse.json({
            error: err.message
        },{status: 500})
    }
}