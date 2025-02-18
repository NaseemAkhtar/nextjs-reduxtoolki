import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Loading() {
    return (
      <div className="container">
        <h2 className="mt-7 mb-4 text-center text-xl text-yellow">Loading...</h2>
        <div className="user_blog flex flex-col gap-10">
          <div className="blog">
            <Skeleton height={200} />
            <Skeleton count={3} height={30} />
          </div>
        </div>
      </div>
    );
  }