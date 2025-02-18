"use client"
import { FilePenLine, Trash2 } from "lucide-react"
import { Button } from "./ui/button"
import axios from "axios"
import { useRouter } from "next/navigation";
import { useState } from "react"
import { useSession } from "next-auth/react"
import { deletePhoto } from "@/lib/cloudinayAction"
import Link from "next/link";

export default function UpdateDeleteBlog({id, photoId}){
    const {data: session, status} = useSession()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const router = useRouter()

    const handleDelete = async()=>{
    setLoading(true)
    setError("")
    setSuccess("")
    await deletePhoto(photoId)
    try {
        let res = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/${id}`, {
            headers :{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.user?.accessToken                    }`
            }
        });
        
        if (res?.data?.status === 200) {
            setSuccess("Blog deleted successfully!");
            await deletePhoto(photoId)
            router.refresh()
            router.push("/blog")
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
                setError("Error: " + err.message);
            }
        } finally {
            setLoading(false);
        }
    }

    return(<>
        <div className="flex flex-row justify-end mt-5 gap-3">
            <Button disabled={loading} variant="secondary" size="icon">
                <Link href={`/blog/edit/${id}`}><FilePenLine/></Link>
            </Button>
            {loading ? 
                <Button disabled={loading} variant="destructive">Deleting</Button>
                 :
                <Button onClick={handleDelete} disabled={loading} variant="destructive" size="icon"><Trash2/></Button>
            }
        </div>
        <div className="flex flex-row justify-end mt-3 gap-3">
            {success && <span>{success}</span>}
            {error && <span>{error}</span>}

        </div>
    </>)
}
