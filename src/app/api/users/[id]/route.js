import { connect } from "@/db";
import { verifyJwtToken } from "@/lib/jwt";
import { User } from "@/models/user.model";
import { Blog } from "@/models/blog.model";
import { NextResponse } from "next/server";

export async function GET(req, res) {
    await connect()
    
}