// import { unstable_noStore } from 'next/cache';
import SingleBlog from "@/components/singleBlog";
import BlogList from "@/components/blogList";
import { getAllBlogs } from "@/server-actions/action.blog"
import "./blog.css"

// export const dynamic = "force-dynamic";

export default async function Blog() {
    // unstable_noStore()
    let data;

    let serverData = await getAllBlogs({ page: 1, limit: 10 })
    if (serverData?.error) {
        console.log('Error fetching blogs:', serverData.error)
        return <div>Error loading blogs</div>
    }   

    data = serverData?.data || []

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
