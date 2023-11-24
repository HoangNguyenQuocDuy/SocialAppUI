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
import { setCommentIdIsUpdating, setCommentIdWillBeDeleted, setIsOpenCommentBox, setIsOpenConfirmBox, setIsShowAnnounce, setIsShowCancelBox, setIsShowPostTippy, setIsUpdatingPost, setMessageAnnounce, setPostIdWillBeDeleted, setPostWillBeUpdated } from '~/store/slice/appSlice';
import newRequet from '~/untils/request';
import CommentBox from '~/components/CommentBox/CommentBox';
import { removeComment } from '~/store/slice/commentSlice';

const cx = classnames.bind(styles)

function Home() {

  const dispatch = useDispatch()
  const { isOpenGallery, isOpenConfirmBox, postIdWillBeDeleted, isShowAnnounce,
    isShowCancelBox, isOpenCommentBox }
    = useSelector(state => state.app)
  const containerRef = useRef()
  const { postComment, commentIdWillBeDeleted } = useSelector(state => state.app)

  const messageDeletePostSuccessful = 'This post is deleting ...'
  // const [page, setPage] = useState(0)
  // const [hasMore, setHasMore] = useState(true);
  console.log(postComment)
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
      dispatch(setIsOpenCommentBox(false))
      dispatch(setCommentIdIsUpdating(''))
    }
  }, [isShowAnnounce])


  const { accessToken } = useSelector(state => state.account)

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
          "Authorization": `Bearer ${accessToken}`
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

  const handleDeleteComment = async () => {
    console.log(postComment.postId)
    console.log(commentIdWillBeDeleted)
    await newRequet.delete(`/comments/${postComment.postId}/delete/${commentIdWillBeDeleted}`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    })
      .then(res => {
        console.log(res.data.data)
        dispatch(setCommentIdWillBeDeleted(''))
        dispatch(removeComment(commentIdWillBeDeleted))
        dispatch(setIsOpenConfirmBox(false))
      })
      .catch(err => {
        console.log('FAILED WHEN TRY TO DELETE COMMENT:', err)
      })
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

      {commentIdWillBeDeleted && isOpenConfirmBox && postComment && <ConfirmBox message={'Do you want to delete this comment ?'}
        yesAction={handleDeleteComment} noAction={handleCloseConfirmBox} />}

      {isOpenConfirmBox && postIdWillBeDeleted && <ConfirmBox message={'Do you want to delete this post ?'}

        yesAction={handleDeletePost} noAction={handleCloseConfirmBox} />}

      {isShowCancelBox && <ConfirmBox message={'Do you want to cancel post\'s updations ?'}
        yesAction={handleCloseUpdateBox} noAction={handleCloseCancelBox} />}

      {isShowAnnounce && <Announce />}

      {isOpenCommentBox && <CommentBox />}
    </div>
  );
}

export default Home