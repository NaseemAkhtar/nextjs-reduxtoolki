"use client"
import Image from "next/image"
import hero from "../../public/img/bird-06.jpg"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import EditProfilePopup from "@/components/editProfilePopup"

export default function UserProfile({userData}){
    console.log('userData??? new',userData?.user?.avatar)
    return(<>
        <section className="user_banner w-full">
            <AspectRatio ratio={18 / 4}>
                <Image
                    src={hero}
                    alt="avatar image"
                    style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover'
                    }}
                    className="rounded-md object-cover"
                />
            </AspectRatio>
            
            <div className="user_profile flex flex-col items-center">
                <div className="flex flex-row">
                    <Avatar className="w-[60px] h-[60px]">
                        <AvatarImage src={`${userData?.user?.avatar?.url || "https://github.com/shadcn.png"}`} />
                        <AvatarFallback>{userData?.user?.name}</AvatarFallback>
                    </Avatar>
                    <EditProfilePopup user={userData}/>
                </div>
                <div className="flex flex-col gap-1 text-center">
                    <h5>{userData?.user?.name}</h5>
                    <p className="text-xs text-light">{userData?.user?.designation} | {userData?.user?.email}</p>
                    <p>{userData?.user?.about}</p>
                </div>
            </div>
        </section>
    </>)
}