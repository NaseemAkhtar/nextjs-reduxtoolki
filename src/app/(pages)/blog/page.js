// import { unstable_noStore } from 'next/cache';
import axios from 'axios';
import SingleBlog from "@/components/singleBlog";
import BlogList from "@/components/blogList";
import "./blog.css"

export default async function Blog() {
    // unstable_noStore()
    let data;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog`, {
        next: { revalidate: 60 } // ⏰ Revalidate every 60s
    })

    if (!res.ok) {
        console.log('Error fetching blogs:', res.statusText)
        return <div>Error loading blogs</div>
    }

    const json = await res.json()
    data = json.data


    if(data && !data?.length){
        return (
            <div className="container w-full h-[400px] flex items-center justify-center">
                <h1>Blogs not found</h1>
            </div>
        )
    }
    
    return(<>
    <div className="container">
        <h1 className="flex justify-center w-full my-5">Trending &nbsp;
            <span className="text-yellow text-center"> Blog</span>
        </h1>
        {!!data?.length &&<>
            <SingleBlog data={data}/>
            {data?.length > 1 && <BlogList data={data}/>}
        </>}
        
    </div>
    </>)
}
