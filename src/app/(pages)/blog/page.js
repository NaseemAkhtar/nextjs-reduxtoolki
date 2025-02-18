import { unstable_noStore } from 'next/cache';
// import dynamic from 'next/dynamic';
import { lazy, Suspense } from 'react';
import { fetchAllBlogList } from "@/store/slice/blog.slice";
import { store } from "@/store/store";
import "./blog.css"

// const SingleBlog = dynamic(() => import('@/components/singleBlog'), {ssr: true});
// const BlogList = dynamic(() => import('@/components/blogList'), {ssr: true});
const SingleBlog = lazy(() => import('@/components/singleBlog'), {ssr: true});
const BlogList = lazy(() => import('@/components/blogList'), {ssr: true});

const Blog = async ()=>{
    unstable_noStore()
    let data;
    
    try {
        await store.dispatch(fetchAllBlogList())
        const blogList = await store.getState()
        data = blogList?.blogData?.allBlogs
    } catch (error) {
        console.log('Error fetching data:', error.message);
        data = { error: error.message };
    }

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
        {!!data?.length &&
        <Suspense fallback={<h1>Loading....</h1>}>
            <SingleBlog data={data}/>
            {data?.length > 1 && <BlogList data={data}/>}
        </Suspense>}
    </div>
    </>)
}

export default Blog