"use client"

import { AiFillHeart, AiOutlineHeart, AiOutlineComment, AiTwotoneCalendar } from "react-icons/ai";
import { Trash2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "next-auth/react";
import avatar from "../../public/img/avatar.png"
import Image from "next/image";
import axios from "axios";
import { useState } from "react";

export default function Comment({blogId, blogData}){
    const {data:session, status} = useSession()
    const [likes, setLikes] = useState(blogData?.likes)
    const [comments, setComments] = useState(blogData?.comments)
    const [commentText, setCommentText] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

console.log(session,'blogData comm', comments)
    const handleLike = async ()=>{
        if(!session?.user) {
            alert("Login required")
            return
        }
        const res = await axios.put(`/api/blog/${blogId.id}/like`, {}, {
            headers :{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.user?.accessToken}`
            }
        })
        console.log('like res...', res?.data?.data)
        setLikes(res?.data?.data?.likes)
    }

    const handleComment = async (e)=>{
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")
        if(commentText.length <  10){
            setError("Minimum 10 charecters are required") 
            return
        }
        console.log('comment tetx', commentText)
        try{
            const res = await axios.post(`/api/blog/${blogId.id}/comment`, {text:commentText}, {
                headers :{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.user?.accessToken}`
                }
            })

            
            if (res?.status === 201) {
                setSuccess("Blog Addes successfully!");
                console.log('comment response....', res?.data?.data)
                setComments(res?.data?.data?.comments)
            } else {
                setError(res?.data?.message || "An unexpected error occurred.");
            }
        }catch(err){
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
        }finally{
            setLoading(false)
        }
    }

    const hendleDeleteComment = async (commentId)=>{
        console.log('blogId.id', blogId.id)
        const res = await axios.delete(`/api/blog/${blogId.id}/comment`, {
            data: {
                postId: blogId?.id,
                commentId: commentId
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.user?.accessToken}`
            }
        });
        if (res?.status === 200) {
            setSuccess("Blog deleted successfully!");
            console.log('comment response delete....', res?.data?.data)
            setComments(res?.data?.data)

        } else {
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
        }
    }

    return(
        <div className="">
           <div className="py-12">
            <div className="flex gap-10 items-center text-xl justify-center">
                <div className="flex items-center gap-1">
                    {console.log('likes?.length',likes)}
                    <p>{likes?.length}</p>

                    {likes?.length ? (
                    <AiFillHeart
                        onClick={handleLike}
                        size={20}
                        color="#ed5784"
                        cursor="pointer"
                    />
                    ) : (
                    <AiOutlineHeart onClick={handleLike} size={20} cursor="pointer" />
                    )}
                </div>

                <div className="flex items-center gap-1">
                    <p>{comments && comments?.length}</p>

                    <AiOutlineComment size={20} />
                </div>
            </div>
        </div>

        <div>
            
            {!session?.user && (
            <h3 className="text-red-500">Kindly login to leave a comment.</h3>
            )}

            {session?.user && (
            <form onSubmit={handleComment} className="space-y-2">
                <Input
                    onChange={(e) => setCommentText(e.target.value)}
                    value={commentText}
                    name="comment"
                    type="text"
                    placeholder="Type message..."
                />

                <Button disabled={loading} type="submit" className="btn">
                    {loading ? "Loading..." : "Comment"}
                </Button>
                {error && <div>{error}</div>}
            </form>
            )}

            {!comments?.length && (
                <p>No comments</p>
            )}

            {comments && !!comments.length && ( 
            <>
                {comments?.map((comment) => (
                <div key={comment._id} className="flex gap-3 py-5 items-center">
                    <Image
                    src={comment?.user?.avatar?.url ? comment?.user?.avatar?.url : avatar}
                    alt="avatar image"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-10 h-10 rounded-full"
                    />

                    <div>
                    <p className="text-whiteColor">{comment?.user?.name}</p>
                    <p>{comment.text}</p>
                    </div>

                    {session?.user?._id === comment?.user?._id && (
                        <Trash2
                            onClick={() => hendleDeleteComment(comment?._id)}
                            cursor="pointer"
                            className="text-red-500 ml-10"
                        />
                    )}

                </div>
                ))}
            </>
            )}
        </div>
    </div>
    )
}