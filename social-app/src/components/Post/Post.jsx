import classnames from 'classnames/bind'
import PropType from 'prop-types'

import styles from './post.module.scss'
import images from '~/assets/images';
import Image from '../Image/Image';
import Tippy from '@tippyjs/react/headless';
import { useEffect, useState } from 'react';
import PostSetting from '../PostSetting';
import { useDispatch, useSelector } from 'react-redux';
import { setGalleryImgs, setImgShowSlider, setIsOpenCommentBox, setIsShowPostTippy, setPostComment, toggleOpenGallery } from '~/store/slice/appSlice';
import newRequet from '~/untils/request';
import { disLike, like } from '~/store/slice/postSlice';
import { fetchCommentByPostId, resetComments } from '~/store/slice/commentSlice';
import { validateTime } from '~/untils/validateTime';

const cx = classnames.bind(styles)

Post.propTypes = {
    post: PropType.any
}

function Post({ post }) {
    const dispatch = useDispatch()
    const { userId } = useSelector(state => state.user)
    const { isShowPostTippy, isOpenConfirmBox, isUpdatingPost } = useSelector(state => state.app)
    const [ commentsCount, setCommentsCount] = useState([])

    const [isShowTippy, setIsShowTippy] = useState(isShowPostTippy)

    const [timeSet, setTimeSet] = useState('')
    const [isLike, setIsLike] = useState(false)
    const token = localStorage.getItem('accessToken')

    const handleOpenGallery = () => {
        dispatch(toggleOpenGallery())
    }

    const handleClickLeftImg = () => {
        handleOpenGallery()
        dispatch(setGalleryImgs(post.postImageUrls))
        dispatch(setImgShowSlider(0))
    }

    const handleClickRightImg = () => {
        handleOpenGallery()
        dispatch(setGalleryImgs(post.postImageUrls))
        dispatch(setImgShowSlider(1))
    }

    const handleLikePost = async () => {
        setIsLike(!isLike)
        await newRequet.put(`/posts/update/${post.postId}/like`, {}, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(data => {
                console.log(data.data.data)
                if (!isLike) {
                    dispatch(like(post))
                } else {
                    dispatch(disLike(post))
                }
            })
            .catch(e => {
                console.log("Error when like this post: ", e)
            })
    }

    const handleCheckLikeByUser = () => {
        if (post.likedByUser) {
            for (let i = 0; i < post.likedByUser.length; i++) {
                if (post.likedByUser[i].userId === userId) {
                    setIsLike(true)
                    break
                }
            }
        }
    }

    const handleGetComments = async () => {
        try {
            const response = await newRequet.get(`/comments/${post.postId}`);
            setCommentsCount(response.data.data.length)
        } catch (error) {
            console.log('Error when get comments by postId:', error);
            throw error;
        }
    }

    const handleShowComment = async () => {
        dispatch(setPostComment(post))
        dispatch(resetComments())
        dispatch(setIsOpenCommentBox(true))
        dispatch(fetchCommentByPostId(post.postId))
    }

    useEffect(() => {
        setTimeSet(validateTime(post.createdAt))
        
        handleCheckLikeByUser()

        if (!isOpenConfirmBox || isUpdatingPost) {
            setIsShowTippy(false)
        }
        handleGetComments()
        
    }, [isOpenConfirmBox, isUpdatingPost])


    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <header className={cx('header')}>
                    <div className={cx('info')}>
                        <span className={cx('img-box')}>
                            <Image avatarPost mainImg={images.tanjirou} small circle />
                        </span>
                        <span className={cx('username')}>Tanhirouuu</span>
                    </div>
                    {post.userId === userId &&
                        <Tippy
                            render={attrs => (
                                <PostSetting post={post} {...attrs} />
                            )}
                            content='duy'
                            onClickOutside={() => { dispatch(setIsShowPostTippy(false)) }}
                            interactive={true}

                            visible={(isShowTippy && !isOpenConfirmBox) || (isShowTippy && isUpdatingPost)}
                        >
                            <div onClick={() => { setIsShowTippy(prev => !prev) }} className={cx('detail')}>
                                <i className="fa-solid fa-ellipsis"></i>
                            </div>
                        </Tippy>}

                </header>
                <p className={cx('content')}>
                    {post.postDescription}
                </p>
                <div className={cx('pics')}>
                    <div className={cx('pic')}>
                        <div onClick={handleClickLeftImg} className={cx('img-box', { partly: post.postImageUrls.length > 1 })}>
                            <img src={post.postImageUrls[0]} />
                        </div>

                        {
                            post.postImageUrls.length > 1 &&
                            (
                                <div onClick={handleClickRightImg} className={cx('img-box', { partly: post.postImageUrls.length > 1 })}>
                                    <img src={post.postImageUrls[1]} />
                                    <span className={cx({ 'layer': post.postImageUrls.length > 2 })}>
                                        {post.postImageUrls.length > 2 && `+${post.postImageUrls.length - 2}`}
                                    </span>
                                </div>
                            )
                        }
                    </div>
                </div>
                <footer className={cx('footer')}>
                    <span>
                        <span className={cx('like-box')}>
                            <i onClick={handleLikePost} className={cx('isax-heart1', { isLike })}></i>
                            <span className={cx('likes-count')}>{post.likes}</span>
                        </span>
                        <span onClick={handleShowComment} className={cx('comment-box')}>
                            <i className="fa-regular fa-comment"></i>
                            <span className={cx('comment-count')}>{ commentsCount && commentsCount }</span>
                        </span>
                    </span>
                    <span className={cx('time-post')}>
                        {timeSet}
                    </span>
                </footer>
            </div>
        </div>
    );
}

export default Post;

