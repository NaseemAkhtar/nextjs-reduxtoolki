import mongoose from "mongoose";
import { Product } from "@/models/product.model";
import { NextResponse } from "next/server";
import { connect } from "@/db";


connect()

export async function POST(req){
    try{
        const {title, description, category, stock, price} = await req.json()
        const newProduct = new Product({
            title,
            description,
            category,
            stock,
            price
        })

        if(!title && !description && !category){
            return NextResponse.json({
                message: "Please provide all parameters",
                success: false,
            },{status:400})
        }
    
        const saveProduct = await newProduct.save()
        
        return NextResponse.json({
            message: "Product created successfully",
            success: true,
            product: saveProduct
        },{status:201})
    } catch(err){
        return NextResponse.json({
            error: err.message,
            success: false
        },{status: 500})
    }
}

export async function GET(req){
    try{
        const products = await Product.find({})

        return NextResponse.json({
            message: "Product list",
            success: true,
            count: products.length,
            data: products
        })
    } catch(err){
        return NextResponse.json({
            error: err.message,
            success: false
        },{status: 500})
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get('id');
        
        if(!productId){
            return NextResponse.json({
                error: "Product id is required"
            },{status: 400})
        }

        const result = await Product.deleteOne({ _id: productId });
        
        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}