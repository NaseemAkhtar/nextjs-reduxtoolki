import { NextRequest } from "next/server";
import jwt from "jsonwebtoken"

export const getDataFromToken = (request)=>{
    try{
        const token = request.cookies.get("token")?.value || ""
        const decodeToken = jwt.verify(token, process.env.TOKEN_SECRET)
        return decodeToken.id
    } catch(err){
        throw new Error(err.message)
    }
}