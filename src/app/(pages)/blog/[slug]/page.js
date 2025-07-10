import Image from "next/image"
import { getServerSession } from 'next-auth/next';
import { options } from '../../../api/auth/[...nextauth]/auth';
import { dateFormat } from "@/lib/utils"
import Blockquote from "@/components/blockquote"
import UpdateDeleteBlog from "@/components/updateDeleteBlog"
import Comment from "@/components/comment";
import { getBlogBySlug } from "@/server-actions/action.blog";
import avatar from "../../../../../public/img/avatar.png"
import "../blog.css"

// export const dynamic = "force-dynamic";

export default async function Blog({params}){
    const session = await getServerSession(options)
    let singleBlog = await getBlogBySlug(params?.slug)

    if(!singleBlog.success) {
        console.log('Blog not found or empty:', singleBlog)
        return <div className="container w-full h-[400px] flex items-center justify-center">
            <h1>Blog not found</h1>
        </div>
    }

    let blog  = singleBlog?.data || {}

    if(Object.keys(blog).length === 0) return null


    return(<div className="container">
        <section className="">
            {session?.user && (session?.user?._id?.toString() === blog?.authorId?._id?.toString()) && 
                <UpdateDeleteBlog id={params?.slug} photoId={blog?.image?.id}/>
            }
            
            <div className="flex flex-col items-center justify-center  gap-8">
                <div className="blog-content w-full lg:w2/5 text-center">
                    <div className="bird-detail mb-2 text-center text-xs">
                        <span className="text-yellow">{blog?.category}</span>
                        &nbsp; {dateFormat(blog?.createdAt)}
                    </div>
                    <h2 className="mb-2">{blog?.title}</h2>
                    <p className="mb-3">{blog?.excerpt}</p>
                    
                    <div className="author flex flex-row justify-center items-center gap-3">
                        <Image 
                            src={blog?.authorId?.avatar?.url || avatar}
                            alt="Avatar"
                            height={40}
                            width={40}
                            className="w-10 h-10 rounded-full cursor-pointer"
                        />
                        <div className="text-xs text-left">
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