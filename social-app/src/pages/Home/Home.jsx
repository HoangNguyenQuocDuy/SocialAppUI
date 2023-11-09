import classnames from 'classnames/bind'
// import InfiniteScroll from 'react-infinite-scroll-component';

import styles from './home.module.scss'
import Stories from '~/components/Stories';
import Post from '~/components/Post';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { fetchPostsData, resetPosts } from '~/store/slice/postSlice';
import Gallery from '~/components/Gallery';
import ConfirmBox from '~/components/ConfirmBox/ConfirmBox';
import Announce from '~/components/Announce/Announce';
import CreatePost from '~/components/CreatePost';
import { setIsOpenConfirmBox, setIsShowAnnounce } from '~/store/slice/appSlice';

const cx = classnames.bind(styles)

function Home() {

  const dispatch = useDispatch()
  const { isOpenGallery, isOpenConfirmBox, postIdWillBeDeleted, isShowAnnounce } = useSelector(state => state.app)
  const containerRef = useRef()

  const messageDeletePostSuccessful = 'This post is deleting ...'
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

  // console.log(posts)
  useEffect(() => {
    // if (posts.length == 0) {
    //   fetchMorePosts()
    // }

    if (isOpenConfirmBox) {
      dispatch(setIsOpenConfirmBox(false))
    }

    if (postIdWillBeDeleted === '') {
      const timer = setTimeout(() => {
        dispatch(setIsShowAnnounce(false))
      }, 3000);

      // Xóa timer khi component unmount hoặc khi thông báo thay đổi
      return () => clearTimeout(timer);
    } else {
      dispatch(resetPosts())
      dispatch(fetchPostsData())
    }
  }, [isShowAnnounce])

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
      {isOpenGallery && <Gallery />}
      {isOpenConfirmBox && <ConfirmBox />}
      {postIdWillBeDeleted === '' && isShowAnnounce && <Announce message={messageDeletePostSuccessful} />}
    </div>
  );
}

export default Home