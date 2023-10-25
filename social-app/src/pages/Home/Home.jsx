import classnames from 'classnames/bind'
import InfiniteScroll from 'react-infinite-scroll-component';

import CreatePost from "~/components/CreatePost";
import styles from './home.module.scss'
import Stories from '~/components/Stories';
import Post from '~/components/Post';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { fetchPostsData, resetPosts } from '~/store/slice/postSlice';
import Gallery from '~/components/Gallery';

const cx = classnames.bind(styles)

function Home() {

  const dispatch = useDispatch()
  const app = useSelector(state => state.app)
  const containerRef = useRef()
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true);

  const fetchMorePosts = async () => {
    try {
      const response = await dispatch(fetchPostsData(page));
      console.log(response)
      const newPosts = response.payload;

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching more posts:', error);
    }
  };

  const posts = useSelector(state => state.posts)
  useEffect(() => {
    dispatch(resetPosts())
    if (posts.length === 0) {
      dispatch(fetchPostsData(page))
    }

    fetchMorePosts();
  }, [])

  console.log(posts)

  console.log(app.imgGalleryRef)

  return (
    <div className={cx('wrapper')}>
      <div ref={containerRef} className={cx('container')}>
        <aside className={cx('wrapper-left')}>
          <CreatePost />
          <div className={cx('stories')}>
            <Stories />
          </div>
          <div className={cx('posts')}>
            {/* {
              posts.map((post, idx) => (
                <div key={idx} className={cx('post')}>
                  <Post />
                </div>
              ))
            } */}

            <InfiniteScroll
              dataLength={posts.length}
              next={fetchMorePosts}
              hasMore={hasMore}
              loader={<h1>Loading...</h1>}
              endMessage={<p>No more posts</p>}
            >
              {posts.map((post, idx) => (
                <div key={idx} className={cx('post')}>
                  <Post />
                </div>
              ))}
            </InfiniteScroll>
          </div>
        </aside>
        <aside className={cx('wrapper-right')}>

        </aside>
      </div>
      {app.isOpenGallery && <Gallery />}

    </div>
  );
}

export default Home