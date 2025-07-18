"use client"
import React, {useState} from "react"
import { useSession } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
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

import { createPost } from "@/server-actions/action.blog"

const initialState = {
    title: "",
    description:"",
    excerpt: "",
    quote: "",
    category: "",
    photo:""
}

export default function CreateBlog(){
    const [state, setState] = useState(initialState)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [isLoading , setLoading] = useState(false)

    const router = useRouter()
    const {data: session, status} = useSession()

    const handleChange  = (e)=>{
        const {name, value, type, files} = e.target
        console.log({name, value, type, files})
        if(type === "file"){
            setState({...state, [name]: files[0]})
        } else {
            setState({...state, [name]: value})
        }
    }
    
    const handleSubmit = async(e)=>{
        e.preventDefault()
        let {photo, title, category, description, excerpt, quote} = state
        
        if([photo, title, category, description, excerpt, quote].includes("")){
            setError("All field are required")
            return
        }

        if(photo){
            let size = 5 * 1024 * 1025
            if(photo.size > size){
                setError("Photo size is too large, size should be under 5MB")
                return
            }
        }

        try{
            setLoading(true)
            setError("")
            setSuccess("")

            const image = await uploadPhoto(photo)
            let newPost = {
                title,
                image,
                category,
                description,
                excerpt,
                quote,
                authorId: session?.user?._id
            }

            const res = await createPost(newPost, session?.user?.accessToken)
            console.log('res in create blog', res)
            setLoading(false)
            if(res?.error){
                setError(res?.error || "Something went wrong")
                return
            }   
            if(res?.status == 201){
                setSuccess("Blog created successfully")
                router.push("/blog")
            } else {
                setError("Error occurred while creating blog")
            }
        } catch(err) {
            setLoading(false)
            setError("Error occur while creating blog")
        }finally{
            setLoading(false)
        }
    }
    
    return(
        <section className="container max-w-3xl">
            <h2 className="mb-5">
                <span className="special-word">Create</span> Blog
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
                {/* <select
                    name="category"
                    onChange={handleChange}
                    value={state.category}
                    className="block rounded-lg w-full p-3 bg-primaryColorLight"
                >
                    <option value="Songbirds">Songbirds</option>
                    <option value="Waterfowl">Waterfowl</option>
                    <option value="Parrots">Parrots</option>
                    <option value="Seabirds">Seabirds</option>
                    <option value="Gamebirds">Gamebirds</option>
                </select> */}
                </div>

                <div>
                <label className="block mb-2 text-sm font-medium">
                    Upload Image
                </label>

                <input onChange={handleChange} type="file" name="photo" accept="image/*" />

                {state.photo && (
                    <div>
                    <Image 
                        src={URL.createObjectURL(state.photo)}
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