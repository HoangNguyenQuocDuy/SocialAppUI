import classnames from 'classnames/bind'
// import InfiniteScroll from 'react-infinite-scroll-component';

import CreatePost from "~/components/CreatePost";
import styles from './home.module.scss'
import Stories from '~/components/Stories';
import Post from '~/components/Post';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { fetchPostsData, resetPosts } from '~/store/slice/postSlice';
import Gallery from '~/components/Gallery';
// import LoadBox from '~/components/LoadBox/LoadBox';

const cx = classnames.bind(styles)

function Home() {

  const dispatch = useDispatch()
  const app = useSelector(state => state.app)
  const containerRef = useRef()
  // const [page, setPage] = useState(0)
  // const [hasMore, setHasMore] = useState(true);
  const posts = useSelector(state => state.posts)
  // const fetchMorePosts = () => {
  //   if (hasMore) {
  //     try {
  //       const response = dispatch(fetchPostsData(page));
  //       const newPosts = response.payload;

  //       if (newPosts && newPosts.length === 0) {
  //         setHasMore(false);
  //       } else {
  //         setPage(prevPage => prevPage + 1);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching more posts:', error);
  //     }
  //   }
  // };

  console.log(posts)
  useEffect(() => {
    dispatch(resetPosts())
    // if (posts.length == 0) {
    //   fetchMorePosts()
    dispatch(fetchPostsData())
    // }
  }, [])

  return (
    <div className={cx('wrapper')}>
      <div ref={containerRef} className={cx('container')}>
        <aside className={cx('wrapper-left')}>
          <CreatePost />
          <div className={cx('stories')}>
            <Stories />
          </div>
          <div className={cx('posts')}>
            {/* <InfiniteScroll
              dataLength={posts.length}
              next={fetchMorePosts}
              hasMore={hasMore}
              loader={<LoadBox />}
              endMessage={<p>No more posts</p>}
            > */}
              {posts.map((post, idx) => (
                <div key={idx} className={cx('post')}>
                  <Post post={post} />
                </div>
              ))}
            {/* </InfiniteScroll> */}
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