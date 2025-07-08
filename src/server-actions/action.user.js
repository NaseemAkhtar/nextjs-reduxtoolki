'use server'
import { connect } from "@/db";
import { verifyJwtToken } from "@/lib/jwt";
import { Blog } from "@/models/blog.model";
import { User } from "@/models/user.model";


export const getUser = async (accessToken) => {
    await connect();
    
    if(!accessToken){
        return {
            message: "Access token is required",
            status: 400,
            success: false
        }
    }

    const verifyToken = verifyJwtToken(accessToken);
    if(!verifyToken || !verifyToken?._id){
        return {
            message: "Unauthorized (wrong or expired token)",
            status: 403,
            success: false
        }
    }

    try {
        // Fetch user by ID and exclude password field
        const user = await User.findById(verifyToken._id).select("-password -__v").lean();
        if (!user) {
            return {
                message: "User not found",
                status: 404,
                success: false
            };
        }
        
        // If user is found, return the user data
        return {
            message: "User fetched successfully",
            data: {
                ...user,
                _id: user._id.toString(),
                createdAt: user.createdAt?.toISOString(),
                updatedAt: user.updatedAt?.toISOString(),
            },
            status: 200,
            success: true
        };
    } catch (error) {
        return {
            error: error.message || "An error occurred while fetching user",
            status: 500,
            success: false
        };
    }   

}

export const getUseBlogs = async (authorId) => {
    await connect();

    if(!authorId) {
        return {
            message: "Author ID is required",
            status: 400,
            success: false
        }
    }

    try{
        // Fetch blogs by authorId and populate authorId field excluding password and __v
        const blogs = await Blog.find({ authorId })
        .select("-authorId -likes -comments -description -quote -__v")
        .sort({ createdAt: -1 })
        .lean();

        // If no blogs are found, it will return a 404 status with a message.
        if (!blogs?.length) {
            return {
                message: "404 blogs not found",
                status: 404,
                success: false
            };
        }

        // If blogs are found, it will return a 200 status with the blogs data.
        // Serialize to make it safe for Next.js
        const serializedBlogs = blogs.map((blog) => ({
        ...blog,
        _id: blog._id.toString(),
        createdAt: blog.createdAt?.toISOString(),
        updatedAt: blog.updatedAt?.toISOString(),
        }));

        return {
            message: "User blogs fetched successfully",
            data: serializedBlogs, //JSON.parse(JSON.stringify(blogs)), // Convert to JSON to remove Mongoose document methods
            status: 200,
            success: true
        };
    
    } catch (error) {
        return {
            error: error.message || "An error occurred while fetching blogs",
            status: 500,
            success: false
        };
    }
}

export const updateUserProfile = async (accessToken, body) => {
    await connect();

    if(!accessToken){
        return {
            message: "Access token is required",
            status: 400,
            success: false
        }
    }   
    const verifyToken = verifyJwtToken(accessToken);
    if(!verifyToken || !verifyToken?._id){
        return {
            message: "Unauthorized (wrong or expired token)",
            status: 403,
            success: false
        }
    }

    try {
        const user = await User.findById(verifyToken._id);
        if (!user) {
            return {
                message: "User not found",
                status: 404,
                success: false
            };
        }

        // Update user with the provided body
        const updatedUser = await User.findByIdAndUpdate(
            verifyToken._id,
            body,
            { new: true }
        ).select("-password -__v").lean();

        if (!updatedUser) {
            return {
                message: "Failed to update user",
                status: 500,
                success: false
            };
        }

        return {
            message: "Profile updated successfully",
            data: {
                ...updatedUser,
                _id: updatedUser._id.toString(),
                createdAt: updatedUser.createdAt?.toISOString(),
                updatedAt: updatedUser.updatedAt?.toISOString(),
            },
            status: 200,
            success: true
        };
    } catch (error) {
        return {
            error: error.message || "An error occurred while updating user",
            status: 500,
            success: false
        };
    }
}