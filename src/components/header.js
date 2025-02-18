"use client"
import Link from "next/link";
import axios from "axios";
import { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { fetchUser } from "@/store/slice/user.slice";


export function Header(){
    const {data: session, status} = useSession()
    const dispach = useDispatch()
    const {user, loading:userLoading, userError} = useSelector(state=> state?.userData)
console.log('session header? state', user, userLoading)
    useEffect(()=>{
        
        (async()=>{
            if(status == "authenticated"){
                dispach(fetchUser(session))
                // const response = await axios.get("/api/users/user", {
                //     headers :{
                //         'Content-Type': 'application/json',
                //         'Authorization': `Bearer ${session?.user?.accessToken}`
                //     }
                // })
                // setUser(response?.data?.data)
            }
        })()
    },[status])

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
                                    sizes="100vw"
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
                                        
                                        <DropdownMenuItem onClick={()=>signOut()} className="cursor-pointer">
                                            <LogOut />
                                            <span>Log out</span>
                                        </DropdownMenuItem>
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