"use client"
import { useSession } from "next-auth/react"
import { useState, useRef } from "react"
import axios from "axios"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Input } from "@/components/ui/input"
  import { FilePenLine } from "lucide-react"
import { Button } from "./ui/button"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"

import { uploadPhoto } from "@/lib/utils"
import { deletePhoto } from "@/lib/cloudinayAction"

export default function EditProfilePopup({user}){
    const {data: session, status} = useSession()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    
    const [userData, setUserData] = useState({
        email: user?.data?.email || "",
        age: user?.data?.age || "",
        designation: user?.data?.designation || "",
        location: user?.data?.location || "",
        about: user?.data?.about || "",
        image: user?.data?.avatar ||"",
        newImage:""
    })
    const cancelRef = useRef()

    const handleChange = (e)=>{
        const {id,type,value, files} = e.target
        console.log({id,type,value, files})
        if(type === "file"){
            setUserData({...userData, [id]: files[0]})
        } else {
            setUserData({...userData, [id]: value})
        }
    }
    
    const handleUpdateProfile = async (e)=>{
        e.preventDefault()
        // setLoading(true),
        setError("")
        setSuccess("")
        
        
        try{
            if(status !== "authenticated"){
                setError("You are not logedin or token expire")
                return
            }
            
            const {email, age, designation, location, about, image, newImage} = userData

            if(newImage){
                let size = 5 * 1024 * 1025
                if(newImage.size > size){
                    setError("Photo size is too large, size should be under 5MB")
                    return
                }
            }
            
            let photo = ""
            if(newImage){
                photo = await uploadPhoto(newImage)
                if(image?.id) await deletePhoto(image?.id)
            } else {
                photo = image
            }
            let newdata = {
                email, age, designation, location, about, avatar:photo
            }
            console.log('cloudinary????', newdata)
            const response = await axios.patch("/api/users/user", {...newdata}, {
                headers :{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.user?.accessToken}`
                }
            })
            console.log('profile update?????', response)
            if(response?.status == 200){
                setSuccess(response?.data?.message)
                if(response?.data){
                    setTimeout(()=>{
                       cancelRef.current?.click()
                    },1000)
                }
            } else {
                setError(res?.data?.message || "An unexpected error occurred.");
            }
        } catch (err) {
            if (err.response) {
                // Server responded with a status other than 200 range
                setError(err.response.data.message || "Server error occurred.");
            } else if (err.request) {
                // Request was made but no response received
                setError("No response from server. Please try again later.");
            } else {
                // Something else happened while setting up the request
                setError("Error???: " + err.message);
            }
        } finally {
            setLoading(false);
        }
    }
    
    return(<>
        <Dialog>
            <DialogTrigger asChild>
                <FilePenLine className="text-yellow w-[20px]"/>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleUpdateProfile}>
                    <div className="grid gap-4 py-2">
                        <div className="grid w-full items-center gap-4">
                            <Input
                                id="email"
                                className="col-span-3"
                                type="email"
                                value={userData?.email}
                                placeholder="Please your email"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid  w-full gap-4">
                            <Input
                                id="age"
                                value={userData?.age}
                                className="col-span-3"
                                placeholder="Please your age"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid  w-full gap-4">
                            <Input
                                id="designation"
                                value={userData?.designation}
                                className="col-span-3"
                                placeholder="Please your designation"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid  w-full gap-4">
                            <Input
                                id="location"
                                value={userData?.location}
                                className="col-span-3"
                                placeholder="Please type your location"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid  w-full gap-4">
                            <Textarea 
                                id="about"
                                value={userData?.about}
                                className="col-span-3"
                                placeholder="Something about your self"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid w-full items-center gap-4">
                            <Input
                                id="newImage"
                                className="col-span-3"
                                type="file"
                                name="newImage"
                                accept="image/*"
                                onChange={handleChange}
                            />
                            {(userData.image || userData.newImage) && (
                                <div>
                                <Image 
                                    src={userData.newImage ? URL.createObjectURL(userData.newImage) : userData?.image?.url}
                                    priority
                                    alt="Sample image"
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    className="w-32"
                                />
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <DialogFooter>
                        {error && <div className="mt-2 text-xs text-red text-right">{error}</div>}
                        {success && <div className="mt-2 text-xs text-green text-right">{success}</div>}
                        <Button type="submit" disabled={loading}>
                            {loading ? "Loading..." : "Save changes"}
                        </Button>
                        <DialogTrigger asChild>
                            {/* <FilePenLine className="text-yellow w-[20px]"/> */}
                            <Button variant="outline" ref={cancelRef}>Cancel</Button>
                        </DialogTrigger>
                    </DialogFooter>
                    
                </form>
            </DialogContent>
        </Dialog>
    </>)
}