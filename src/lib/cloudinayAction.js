"use server"
import cloudinary from "cloudinary"

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDE_NAME,
    api_key: process.env.CLOUDE_API_KEY,
    api_secret: process.env.CLOUDE_API_SECRET
})

export async function deletePhoto(imgId){
    try{
        return await cloudinary.v2.uploader.destroy(imgId) 
    } catch(err){
        return {error: err.message}
    }
}

export async function deleteManyPhoto(imgIds=[]){
    try{
        const deleteResponse = await Promise.all(
            imgIds.map(async (item)=>{
                let img_id = item.id
                try{
                    const result = await cloudinary.v2.uploader.destroy(img_id) 
                    return {img_id, result}
                } catch(err){
                    return {error: err.message}
                }
            })
        )
        return deleteResponse
    }catch(err){
        return {error: err.message}
    }
}
