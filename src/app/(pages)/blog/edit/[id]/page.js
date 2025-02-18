"use client"
import React, {useState, useEffect} from "react"
import { useSession } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import axios from "axios"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { uploadPhoto } from "@/lib/utils"
import { deletePhoto } from "@/lib/cloudinayAction"

const initialState = {
    title: "",
    description:"",
    excerpt: "",
    quote: "",
    category: "",
    photo:"",
    blogId:"",
    newImage:""

}

export default function EditBlog({params}){
    const [state, setState] = useState(initialState)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [isLoading , setLoading] = useState(false)

    const router = useRouter()
    const {data: session, status} = useSession()

    useEffect(()=>{
        (async()=>{
            try{
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/${params?.id}`)
                
                const {title, description, excerpt, quote, category, image, _id} = response?.data?.data
                setState(prev=>({
                    ...prev,
                    title,
                    description,
                    excerpt,
                    quote,
                    category,
                    photo: image,
                    blogId:_id,
                }))
                return  response?.data?.data
            } catch(err){
                console.log('Something went wrong')
            }
        })()
    },[])

    if(status === "loading") return <h1 className="text-white">Loading</h1>
    if(status === "unauthenticated") return <h1 className="text-white">Access Denied</h1>

    const handleChange  = (e)=>{
        const {name, value, type, files} = e.target
        if(type === "file"){
            setState({...state, [name]: files[0]})
        } else {
            setState({...state, [name]: value})
        }
    }
    
    const handleSubmit = async(e)=>{
        e.preventDefault()
        let {newImage, photo, title, category, description, excerpt, quote} = state
        
        if([photo, title, category, description, excerpt, quote].includes("")){
            setError("All field are required")
            return
        }

        if(newImage){
            let size = 5 * 1024 * 1025
            if(newImage.size > size){
                setError("Photo size is too large, size should be under 5MB")
                return
            }
        }

        try{
            setLoading(true)
            setError("")
            setSuccess("")

            let image
            if(newImage){
                image = await uploadPhoto(newImage)
                if(photo?.id) await deletePhoto(photo?.id)
            } else {
                image = photo
            }

            let newPost = {
                title,
                image,
                category,
                description,
                excerpt,
                quote,
                authorId: session?.user?._id
            }

            const res = await axios.post("/api/blog", newPost, {
                headers :{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.user?.accessToken                    }`
                }
            })
            
            if(res?.status == 201){
                setSuccess("Blog Edited succesfully")
                router.push("/blog")
            } else {
                setError("Error occured while creting blog")
            }
        } catch(err){
            setLoading(false)
            setError("Error occur while creating blog")
        }finally{
            setLoading(false)
        }
    }

    return(
        <section className="container max-w-3xl">
            <h2 className="mb-5">
                <span className="special-word">Edit</span> Blog
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                label="Title"
                type="text"
                name="title"
                placeholder="Write you title here..."
                onChange={handleChange}
                value={state.title}
                />

                <Textarea
                label="Description"
                rows="4"
                name="description"
                placeholder="Write you description here..."
                onChange={handleChange}
                value={state.description}
                />

                <Textarea
                label="Excerpt"
                rows="2"
                name="excerpt"
                placeholder="Write you excerpt here..."
                onChange={handleChange}
                value={state.excerpt}
                />

                <Textarea
                label="Quote"
                rows="2"
                name="quote"
                placeholder="Write you quote here..."
                onChange={handleChange}
                value={state.quote}
                />

                <div>
                <label className="block">Select an option</label>
                <Select
                    name="category"
                    onValueChange={(value)=>{
                        setState({...state, category:value})
                    }}
                    value={state.category}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Categories</SelectLabel>
                            <SelectItem value="Songbirds">Songbirds</SelectItem>
                            <SelectItem value="Waterfowl">Waterfowl</SelectItem>
                            <SelectItem value="Parrots">Parrots</SelectItem>
                            <SelectItem value="Seabirds">Seabirds</SelectItem>
                            <SelectItem value="Gamebirds">Gamebirds</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                
                </div>

                <div>
                <label className="block mb-2 text-sm font-medium">
                    Upload Image
                </label>

                <input onChange={handleChange} type="file" name="newImage" accept="image/*" />
                {/* URL.createObjectURL(state.photo) */}
                {(state.photo || state.newImage) && (
                    <div>
                    <Image 
                        src={state.newImage ? URL.createObjectURL(state.newImage) : state.photo?.url}
                        priority
                        alt="Sample image"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-32 mt-5"
                    />
                    </div>
                )}

                
                </div>

                {error && <div className="text-red-700">{error}</div>}

                {success && <div className="text-green-700">{success}</div>}

                <Button type="submit" variant="destructive" className="btn">
                {isLoading ? "Loading..." : "Create"}
                </Button>
            </form>
        </section>
    )
}