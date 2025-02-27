import Image from "next/image"
import { unstable_noStore } from 'next/cache';
import { getServerSession } from 'next-auth/next';
import { options } from '../../../api/auth/[...nextauth]/auth';
import { dateFormat } from "@/lib/utils"
import Blockquote from "@/components/blockquote"
import "../blog.css"
import UpdateDeleteBlog from "@/components/updateDeleteBlog"
import Comment from "@/components/comment";
import { store } from "@/store/store";
import { fetchblog, getBlogData } from "@/store/slice/blog.slice";
import avatar from "../../../../../public/img/avatar.png"



const fetchBlog = async (id="")=>{
    unstable_noStore()
    try{
        await store.dispatch(fetchblog(id))
        const getState = store.getState()
        
        // const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/${id}`)
        return  getState?.blogData?.blog//response?.data?.data
    } catch(err){
        console.log('Something went wrong')
    }
}

export default async function Blog({params}){
    const session = await getServerSession(options)

    let blog = await fetchBlog(params?.id) || {}
    if(Object.keys(blog).length === 0) return null

    console.log('Blog data....', blog)

    return(<div className="container">
        <section className="">
            {session?.user && (session?.user?._id?.toString() === blog?.authorId?._id?.toString()) && 
                <UpdateDeleteBlog id={params?.id} photoId={blog?.image?.id}/>
            }
            
            <div className="flex flex-col items-center justify-center  gap-8">
                <div className="blog-content w-full lg:w2/5 text-center">
                    <div className="bird-detail mb-2 text-center text-xs">
                        <span className="text-yellow">{blog?.category}</span>
                        &nbsp; {dateFormat(blog?.createdAt)}
                    </div>
                    <h2 className="mb-2">{blog?.title}</h2>
                    <p className="mb-3">{blog?.excerpt}</p>
                    
                    <div className="author flex flex-row justify-center gap-3">
                        <Image 
                            src={blog?.authorId?.avatar?.url || avatar}
                            alt="Avatar"
                            height={30}
                            width={30}
                            sizes="100vw"
                            className="w-10 h-10 rounded-full cursor-pointer"
                        />
                        <div className="text-xs">
                            <h6>{blog?.authorId?.name}</h6>
                            <p>{blog?.authorId?.designation}</p>
                        </div>
                    </div>
                </div>
                
                <div className="blog-img w-full mb-5 flex flex-col items-center justify-center text-center text-center">
                    <Image
                        src={blog?.image?.url}
                        alt=""
                        width="700"
                        height="150"
                        className="rounded-lg"
                    />
                </div>
            </div>

            <div className="text-start">
                <p className="mb-3">{blog?.description}</p>
                {blog?.quote && <Blockquote quote={blog?.quote}/>}
                
            </div>
            <Comment blogId={params} blogData={blog}/>
        </section>
    </div>)
}