import { connect } from "@/db";
import { NextResponse } from "next/server";


connect()

export async function GET(){
    try{
        const response = NextResponse.json({
            message: "Logout successfully!",
            success: true
        })

        response.cookies.set("token","", {
            httpOnly: true,
            expires: new Date(0)
        })

        return response
    } catch(err){
        return NextResponse.json({
            error: err.message
        },{status: 500})
    }
}