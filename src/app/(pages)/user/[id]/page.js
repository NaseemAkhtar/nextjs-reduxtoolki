import Image from "next/image";
// import dynamic from 'next/dynamic';
// import { redirect } from 'next/navigation';
import blogImg from "../../../../../public/img/avatar.png"
import "../profile.css"
import { getServerSession } from 'next-auth/next';
import { options } from '../../../api/auth/[...nextauth]/auth';
// import { store } from "@/store/store";
import { dateFormat } from "@/lib/utils";
import Link from "next/link";
// import { fetchUser } from "@/store/slice/user.slice";
// import { fetchblogList } from "@/store/slice/blog.slice";

import UserProfile from "@/components/profileHero";
// import { fetchUser, userRepo } from "@/store/slice/user.slice";

export default async function Profile(){
    const session = await getServerSession(options);
    let user
    let blogData = []
    if(session?.user){

        // const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/user`, {
        //     headers :{
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${session?.user?.accessToken}`
        //     }
        // })
        // let userData = await response.json()
        // // console.log('userData in profile page>>>>>', userData?.data)

        // // let res = await userRepo(session)
        // user = userData?.data //res?.data?.data
        // store.dispatch(fetchUser(user))


        // const responseBlog = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs?userId=${session?.user?._id}`)
        
        // let blogs = await responseBlog.json()
        // console.log('blogs in profile page>>>>>', blogs?.data)





        const [userRes, blogsRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/user`, {
            headers: {
                'Authorization': `Bearer ${session?.user?.accessToken}`
            },
            cache: 'no-store'
            }),
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs?userId=${session?.user?._id}`, {
            next: { revalidate: 60 }
            })
        ])

         if (!userRes.ok || !blogsRes.ok) {
            throw new Error('Something failed')
        }

        let userResData = await userRes.json()
        let blogsResData = await blogsRes.json()
        user = userResData?.data || {}
        blogData = blogsResData?.data || []

        console.log('user in profile page>>>>>...cache', user)
        console.log('blogs in profile page>>>>>...cache', blogData)
    }

    
    

    
    // try{
    //     if(session){
    //         await Promise.all([
    //             // store.dispatch(fetchUser(session)),
    //             store.dispatch(fetchblogList({userId:session?.user?._id}))
    //         ])
            
    //         const reduxState = await store.getState()
    //         blogData = reduxState?.blogData
    //         // console.log('blogData in profile page', blogData)
    //     }
    // } catch(err){
    //     console.log('Error............new',err)
    // }
    
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
                    <div className="blog">
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