import Image from "next/image";
import { redirect } from 'next/navigation';
import UserProfile from "@/components/profileHero";
import blogImg from "../../../../../public/img/avatar.png"
import "../profile.css"
import { getServerSession } from 'next-auth/next';
import { options } from '../../../api/auth/[...nextauth]/auth';
import axios from "axios";
import { store } from "@/store/store";
import { dateFormat } from "@/lib/utils";
import Link from "next/link";
import { fetchUser } from "@/store/slice/user.slice";
import { fetchblogList } from "@/store/slice/blog.slice";

export default async function Profile(){
    const session = await getServerSession(options);
    if(!session){
        redirect("/login") 
    }
    let userData  = null
    let blogData = null

    
    try{
        if(session){
            await Promise.all([
                store.dispatch(fetchUser(session)),
                store.dispatch(fetchblogList({userId:session?.user?._id}))
            ])

            const reduxState = await store.getState()
            userData = reduxState?.userData
            blogData = reduxState?.blogData
            
        }
    } catch(err){
        console.log('Error............new',err)
    }
    
    return (<>
        <UserProfile userData={userData}/>
        <div className="container">
            <h2 className="mt-7 mb-4 text-center text-xl text-yellow">User Posts</h2>
            {!blogData?.blogList?.length ? 
                <div className="w-full h-[300px] flex items-center justify-center">
                    <div>
                        <h1>Data not found</h1>
                        <p>You haven't posted any blogs.</p>
                    </div>
                </div>
                :
                <div className="user_blog flex flex-col gap-10">
                    <div className="blog">
                        {blogData?.blogList?.map((blog,ind)=>(
                            <div key={ind} className="flex flex-row justify-center gap-5">
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
                                        <Link href={`/blog/${blog?._id}`}>{blog?.title}</Link>
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