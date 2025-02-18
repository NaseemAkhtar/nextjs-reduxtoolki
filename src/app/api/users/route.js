import { connect } from "@/db";
import { NextResponse } from "next/server";
import { User } from "@/models/user.model";

export async function GET(req) {
    await connect()

    try{
        const users = await User.find({})
    }catch(err){

    }
}