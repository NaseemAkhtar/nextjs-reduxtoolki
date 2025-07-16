import Link from "next/link";
import axios from "axios";
import dynamic from 'next/dynamic';
// import { useEffect, useState} from "react";
// import { useDispatch, useSelector } from "react-redux";
import avatar from "../../public/img/avatar.png"
import Image from "next/image";
import { useSession, signOut} from "next-auth/react";

import {
    LogOut,
    User,
  } from "lucide-react"
   
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
 
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/auth";
// import { store } from "@/store/store"; 
import { fetchUser, userRepo } from "@/store/slice/user.slice";
const LogoutButton = dynamic(() => import('@/components/logoutButton'), {
    ssr: false
})

export async function Header(){
    const serverSession = await getServerSession(options)
    let user = {}
    if(serverSession?.user){
        // console.log('serverSession header>>>>>', serverSession)
        try{
            let res = await userRepo(serverSession)
            if(res.status === 401){
                console.log('res?.data.....repo status', res.status)
            }
            console.log('res?.data.....repo status new', res?.data?.data)
            user = res?.data?.data
        } catch(err){
            console.log('USER API CATCH ERROR', err)
        }
        
        
        // await store.dispatch(fetchUser(user))
        // response.data?.data
        // console.log('serverSession......',serverSession)
        //   await store.dispatch(user.data?.data)
        //   user = store.getState()
    }

    // const {data: session, status} = useSession()
    // const dispach = useDispatch()
    // const {user, loading:userLoading, userError} = useSelector(state=> state?.userData)
// console.log('session header? state', user, userLoading)

    // useEffect(()=>{
        
    //     (async()=>{
    //         if(status == "authenticated"){
    //             dispach(fetchUser(session))
    //             // const response = await axios.get("/api/users/user", {
    //             //     headers :{
    //             //         'Content-Type': 'application/json',
    //             //         'Authorization': `Bearer ${session?.user?.accessToken}`
    //             //     }
    //             // })
    //             // setUser(response?.data?.data)
    //         }
    //     })()
    // },[status])

    return(
        <header>
            <div className="container py-2 h-16 flex item-center justify-between">
                <div className="flex items-center logo"><Link href="/"><span className="text-yellow">Rare</span> Birds</Link></div>
                <ul className="flex items-center gap-3">
                    <li><Link href="/blog">Blog</Link></li>
                    {user?._id ? (<>
                        <li><Link href="/create-blog">Create</Link></li>
                        <li>
                            <div className="relative">
                                
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Image 
                                        src={user?.avatar?.url || avatar}
                                        alt="Avatar"
                                        height={40}
                                        width={40}
                                        className="w-10 h-10 rounded-full cursor-pointer"
                                />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <Link className="cursor-pointer" href={`/user/${user?._id}`}>
                                                <DropdownMenuItem>
                                                    <User />
                                                    <span>Profile</span>
                                                </DropdownMenuItem>
                                            </Link>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                         {/* onClick={()=>signOut()} */}
                                        <LogoutButton/>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </li>

                    </>) : (<>
                        <li><Link href="/login">Login</Link></li>
                        <li><Link href="/signup">Signup</Link></li>
                    </>)}
                </ul>
            </div>
        </header>
    )
}