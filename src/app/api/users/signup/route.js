import { NextRequest ,NextResponse } from "next/server";
import { connect } from "@/db";
import { User } from "@/models/user.model";
import bcryptjs from "bcryptjs";



export async function POST(request) {
    try{
        await connect()
        const reqBody = await request.json()
        const {name, email, password} = reqBody
        const user = await User.findOne({email})
        
        
        if(user) {
            return NextResponse.json(
                {error: "User already axist"},
                {status: 400}
            )
        }
        
        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password, salt)
        
        console.log("body data??....", {name, email, password})
        const newUser = await User.create({
            name,
            email,
            password: hashPassword
        })
        
        // const saveUser = await newUser.save()
    
        return NextResponse.json({
            message: "User created successfully",
            success: true,
            data: newUser
        },{status:201})

    } catch(err){
        console.log("error???? ",err.message)
        return NextResponse.json(
            {error: `${err.message}`},
            {status: 500}
        )
    }

}