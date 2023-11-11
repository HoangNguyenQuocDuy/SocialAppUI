import classnames from 'classnames/bind'
// import InfiniteScroll from 'react-infinite-scroll-component';

import styles from './home.module.scss'
import Stories from '~/components/Stories';
import Post from '~/components/Post';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { deletePost, fetchPostsData, resetPosts } from '~/store/slice/postSlice';
import Gallery from '~/components/Gallery';
import ConfirmBox from '~/components/ConfirmBox/ConfirmBox';
import Announce from '~/components/Announce/Announce';
import CreatePost from '~/components/CreatePost';
import { setIsOpenConfirmBox, setIsShowAnnounce, setIsShowCancelBox, setIsShowPostTippy, setIsUpdatingPost, setMessageAnnounce, setPostIdWillBeDeleted, setPostWillBeUpdated } from '~/store/slice/appSlice';
import newRequet from '~/untils/request';

const cx = classnames.bind(styles)

function Home() {

  const dispatch = useDispatch()
  const { isOpenGallery, isOpenConfirmBox, postIdWillBeDeleted, isShowAnnounce, 
    isShowCancelBox }
    = useSelector(state => state.app)
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

    // if (isShowCancelBox) <P>'</P>
    
    if (isOpenConfirmBox) {
      dispatch(setIsOpenConfirmBox(false))
    }

    if (isShowAnnounce) {
      const timer = setTimeout(() => {
        dispatch(setIsShowAnnounce(false))
      }, 3000);

      // Xóa timer khi component unmount hoặc khi thông báo thay đổi
      return () => clearTimeout(timer);
    } else {
      dispatch(resetPosts())
      dispatch(fetchPostsData())
      dispatch(setPostWillBeUpdated(null))
      dispatch(setIsUpdatingPost(false))
      dispatch(setIsShowPostTippy(false))
    }
  }, [isShowAnnounce])


  const token = localStorage.getItem('accessToken')

  const handleCloseConfirmBox = () => {
    dispatch(setIsOpenConfirmBox(false))
  }

  const handleCloseCancelBox = () => {
    dispatch(setIsShowCancelBox(false))
    
  }

  const handleDeletePost = async () => {

    await newRequet.delete(`/posts/delete/${postIdWillBeDeleted}`,
      {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      .then(data => {
        dispatch(setMessageAnnounce(messageDeletePostSuccessful))
        dispatch(setIsShowAnnounce(true))
        dispatch(setPostIdWillBeDeleted(''))
        handleCloseConfirmBox()
        setTimeout(() => {
          dispatch(deletePost(data.data.data))
        }, 3000)
      })
      .catch(err => {
        console.log('ERR when delete posst', err)
      })
  }

  const handleCloseUpdateBox = () => {
    dispatch(setIsUpdatingPost(false))
    dispatch(setPostWillBeUpdated(null))
    handleCloseCancelBox()
  }

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
      {isOpenConfirmBox && <ConfirmBox message={'Do you want to delete this post ?'}

        yesAction={handleDeletePost} noAction={handleCloseConfirmBox} />}
      {isShowCancelBox && <ConfirmBox message={'Do you want to cancel post\'s updations ?'}
        yesAction={handleCloseUpdateBox} noAction={handleCloseCancelBox} />}
      {isShowAnnounce && <Announce />}
    </div>
  );
}

export default Home