import mongoose from "mongoose";
import { Product } from "@/models/product.model";
import { NextResponse } from "next/server";
import { connect } from "@/db";


connect()

export async function GET(req){
    try{
        const { searchParams } = new URL(req.url);
        const productID = searchParams.get('id');

        if(!productID){
            return NextResponse.json({
                error: "Product id is required"
            },{status: 400})
        }

        const newProduct = await Product.findOne({_id:productID})
        if(!newProduct){
            return NextResponse.json({
                error: "Product not found"
            },{status: 404})
        }
        
        return NextResponse.json({
            message: "Get product successfully",
            success: true,
            data: newProduct
        })
    } catch(err){
        return NextResponse.json({
            error: err.message,
            success: false
        },{status: 500})
    }
}