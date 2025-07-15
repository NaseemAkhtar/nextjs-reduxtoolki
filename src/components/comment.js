"use client"
import { useCallback, useState, useOptimistic, startTransition } from "react";
import { AiFillHeart, AiOutlineHeart, AiOutlineComment, AiTwotoneCalendar } from "react-icons/ai";
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "next-auth/react";
import avatar from "../../public/img/avatar.png"
import Image from "next/image";
import { addComment, deleteComment, likeBlog } from "@/server-actions/action.blog";

export default function Comment({blogId, blogData}){
    const {data:session, status} = useSession()
    const [likes, setLikes] = useState(blogData?.likes)
    const [comments, setComments] = useState(blogData?.comments)
    const [isCommentDeleting, setIsCommentDeleting] = useState(false)
    const [commentText, setCommentText] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const [optimisticComments, addOptimisticComments] = useOptimistic(
        comments,
        (state, newComment) => [newComment, ...state]
    )

    
    const handleLike = useCallback(async ()=>{
        if(!session?.user) {
            alert("Login required")
            return
        }
        let res = await likeBlog(blogId.slug, session?.user?.accessToken)
        if(res?.status !== 200){
            setError(res?.data?.message || "An unexpected error occurred.");
            return
        }
        setSuccess("Blog liked successfully!");
        if(res?.likes?.length === 0){
            setLikes([])
            return
        }
        setLikes(res?.likes)
    }, [session, blogId.slug]);

    const handleComment = useCallback(async (e)=>{
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")
        if(commentText.length <  10){
            setError("Minimum 10 charecters are required") 
            setLoading(false)
            return
        }

        startTransition(()=>{
            addOptimisticComments({
                _id: Date.now(),
                text: commentText,
                user: {
                    _id: session?.user?._id,
                    name: session?.user?.name
                }
            })
        })
        
        try{
            const res = await addComment(blogId.slug, {text:commentText}, session?.user?.accessToken)
            if (res?.status === 201) {
                setSuccess("Blog Addes successfully!");
                setComments(prev => [res?.data, ...prev])
                setCommentText("")
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
    }, [blogId.slug, session?.user?.accessToken, commentText]);

    const hendleDeleteComment = async (commentId)=>{
        setIsCommentDeleting(true)
        try {
            let res = await deleteComment(blogId.slug, {postId: blogId?.slug, commentId: commentId}, session?.user?.accessToken)
            if (res?.status === 200) {
                setSuccess("Blog deleted successfully!");
                setComments(prev => prev.filter(comment => comment._id !== commentId))

            } else {
                setError(res.message || "Server error occurred.");
            }
        } catch(err){
            console.error("Error deleting comment:", err);
            setError(err.message || "Something went wrong while deleting the comment.");
            return;
        } finally{
            setIsCommentDeleting(false)
        }
    };

    return(
        <div className="">
           <div className="py-12">
                <div className="flex gap-10 items-center text-xl justify-center">
                    <div className="flex items-center gap-1">
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
                <Textarea
                    onChange={(e) => {
                        setCommentText(e.target.value)
                        setError("")
                    }}
                    value={commentText}
                    name="comment"
                    type="text"
                     rows="4"
                    placeholder="Type message..."
                />

                <Button disabled={(loading || !commentText)} type="submit" className="btn">
                    {loading ? "Loading..." : "Comment"}
                </Button>
                {error && <div>{error}</div>}
            </form>
            )}

            {!comments?.length && (
                <div className="h-[100px] flex justify-center items-center">
                    <h4 className="text-xl">No comments</h4>
                </div>
            )}

            {console.log('optimisticCommentsnew', optimisticComments)}
            {optimisticComments && !!optimisticComments.length && ( 
            <>
                {optimisticComments?.map((comment) => (
                <div key={comment._id} className="flex gap-3 py-5 items-top">
                    <Image
                        src={comment?.user?.avatar?.url || avatar}
                        alt="avatar image"
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full shrink-0"
                    />

                    <div>
                    <p className="text-whiteColor">{comment?.user?.name}</p>
                    <p className="text-sm text-light">{comment.text}</p>
                    </div>

                    {session?.user?._id === comment?.user?._id && (
                        <button className={`ml-10 shrink-0 ${isCommentDeleting ? 'opacity-50' : ''}`}
                            disabled={isCommentDeleting}
                            onClick={() => hendleDeleteComment(comment?._id)}
                        >
                            <Trash2
                                cursor="pointer"
                                className={`text-red-500`}
                            />
                        </button>
                    )}

                </div>
                ))}
            </>
            )}
        </div>
    </div>
    )
}