 
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import bird from "../../public/img/rare-bird-02.jpg"
import Image from "next/image"
import avatar from "../../public/img/avatar.png"
import { dateFormat } from "@/lib/utils"
import Link from "next/link"

export default function BlogList({data}){
    console.log('data blogs....', data[2])
    return(
        <div className="blog-list grid grid-cols-1 md:grid-cols-3 gap-3 mt-10">
            {data?.map((blog, ind)=>(
                ind != 0 &&
                <Card key={blog._id} className="w-[350px] black-bg mb-3">
                    
                    <CardHeader className="p-3">
                        <Image
                            // src={blog?.image?.url}
                            src={blog?.image?.url} 
                            alt={blog.title}
                            width={300}
                            height={170}
                            className="w-full rounded-lg"
                            // placeholder="blur"
                            // quality={100}
                            // fill
                            // sizes="100vw"
                            // blurDataURL={`data:${blog?.image?.url}`}
                            // style={{
                            //     objectFit: "cover"
                            // }}
                        />
                    </CardHeader>
                    <CardContent className="p-3 text-white">
                        <div className="bird-detail flex gap-1 mb-2 text-xs">
                            <span className="text-yellow">{blog?.category}</span>
                            {dateFormat(blog?.createdAt, 'MMM Do YY')}
                            
                            
                        </div>
                        <CardTitle className="mb-2">
                            <Link href={`/blog/${blog?.slug ? blog?.slug : blog?._id}`}>{blog?.title}</Link>
                        </CardTitle>
                        <CardDescription>{blog.excerpt}</CardDescription>

                        <div className="author flex items-center mt-3 gap-3">
                            <Image 
                                src={blog?.authorId?.avatar?.url || avatar}
                                alt="Avatar"
                                height={50}
                                width={50}
                                className="w-10 h-10 rounded-full cursor-pointer"
                            />
                            <div className="text-xs">
                                <h6>{blog?.authorId?.name}</h6>
                                <p>{blog?.authorId?.designation}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}