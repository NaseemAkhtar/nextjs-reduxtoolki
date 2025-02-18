"use client"
import Image from "next/image"
import bird from "../../public/img/rare-bird-02.jpg"
import avatar from "../../public/img/avatar.png"
import { dateFormat } from "@/lib/utils"
import Link from "next/link"

export default function SingleBlog({data}){
    console.log('client data', data)
    const singleBlog = data[0]
    return(<section className="flex flex-col md:flex-row item-center gap-8">
    {singleBlog && <>  
        <div className="blog-img w-full lg:w-3/5 space-y-5">
            <Image
                src={singleBlog?.image?.url}
                alt={singleBlog.title}
                width={300}
                height={170}
                className="w-full rounded-lg"
            />
        </div>
        <div className="blog-content w-full lg:w2/5">
            <div className="bird-detail flex gap-1 mb-2">
                <span className="text-yellow">{singleBlog?.category}</span>
                {dateFormat(singleBlog?.createdAt)}
            </div>
            <h2 className="mb-2">
                <Link href={`/blog/${singleBlog?._id}`}>{singleBlog?.title}</Link>
            </h2>
            <p className="mb-3">{singleBlog?.description}</p>
            
            <div className="author flex items-center gap-3">
                <Image 
                    src={singleBlog?.authorId?.avatar?.url ||avatar}
                    alt="Avatar"
                    height={30}
                    width={30}
                    sizes="100vw"
                    className="w-10 h-10 rounded-full cursor-pointer"
                />
                <div className="text-xs">
                    <h6>{singleBlog?.authorId?.name}</h6>
                    <p>{singleBlog?.authorId?.designation}</p>
                </div>
            </div>
        </div>
    </>}
        
        
    </section>)
}