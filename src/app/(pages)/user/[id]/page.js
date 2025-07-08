import Image from "next/image";
import blogImg from "../../../../../public/img/avatar.png"
import "../profile.css"
import { getServerSession } from 'next-auth/next';
import { options } from '../../../api/auth/[...nextauth]/auth';
import { dateFormat } from "@/lib/utils";
import Link from "next/link";
import UserProfile from "@/components/profileHero";
import { getUseBlogs, getUser } from "@/server-actions/action.user";

export default async function Profile(){
    const session = await getServerSession(options);
    let user = {}
    let blogData = []
    if(session?.user){
        const [userData, userBlog] = await Promise.all([
            getUser(session?.user?.accessToken),
            getUseBlogs(session?.user?._id)
        ])
        user = userData?.data || {}
        blogData = userBlog?.data || []

        console.log("blogData>>>>>>>.", user)
    }
    
    return (<>
        <UserProfile userData={user}/>
        <div className="container">
            <h2 className="mt-7 mb-4 text-center text-xl text-yellow">User Posts</h2>
            {!blogData?.length ? 
                <div className="w-full h-[300px] flex items-center justify-center">
                    <div>
                        <h1>Data not found</h1>
                        <p>You haven't posted any blogs.</p>
                    </div>
                </div>
                :
                <div className="user_blog flex flex-col gap-10">
                    <div className="blog flex flex-col gap-5">
                        {blogData?.map((blog)=>(
                            <div key={blog._id} className="flex flex-row justify-center gap-5">
                                <div className="w-[170px] blog-img mb-5 flex flex-col text-center text-center">
                                    <Image
                                        src={blog?.image?.url || blogImg}
                                        alt=""
                                        width="140"
                                        height="90"
                                        className="rounded-lg"
                                    />
                                </div>
                                <div className="blog-content w-full lg:w2/5">
                                    <h2 className="mb-2">
                                        <Link 
                                            href={`/blog/${blog?.slug ? blog?.slug : blog?._id}`}
                                        >{blog?.title}</Link>
                                    </h2>
                                    <p className="mb-3">{blog?.excerpt}</p>
                                    <div className="bird-detail mb-2 text-xs">
                                        <span className="text-yellow">{blog?.category}</span>
                                        &nbsp; {dateFormat(blog?.createdAt)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    </>)
}