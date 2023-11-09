import classnames from 'classnames/bind'
import PropType from 'prop-types'

import styles from './post.module.scss'
import images from '~/assets/images';
import Image from '../Image/Image';
import Tippy from '@tippyjs/react/headless';
import { useEffect, useState } from 'react';
import PostSetting from '../PostSetting';
import { useDispatch, useSelector } from 'react-redux';
import { setGalleryImgs, setImgShowSlider, toggleOpenGallery } from '~/store/slice/appSlice';
import moment from 'moment/moment';
import newRequet from '~/untils/request';
import { disLike, like } from '~/store/slice/postSlice';

const cx = classnames.bind(styles)

Post.propTypes = {
    post: PropType.any
}

function Post({ post }) {
    const dispatch = useDispatch()
    const { userId } = useSelector(state => state.user)
    const { isShowPostTippy, isOpenConfirmBox } = useSelector(state => state.app)

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

    const validateTime = (time) => {
        const now = moment()
        const createAtMoment = moment(time)

        const duration = moment.duration(now.diff(createAtMoment))

        const days = duration._data.days;
        const hours = duration._data.hours;
        const minutes = duration._data.minutes;
        const seconds = duration._data.seconds;

        if (days > 0) {
            if (days > 1) {
                setTimeSet(`${days} days ago`)
            } else {
                setTimeSet(`${days} day ago`)
            }
        } else if (hours > 0) {
            if (hours > 1) {
                setTimeSet(`${hours} hours ago`)
            } else {
                setTimeSet(`${hours} hour ago`)
            }
        } else if (minutes > 0) {
            if (minutes > 1) {
                setTimeSet(`${minutes} minutes ago`)
            } else {
                setTimeSet(`${minutes} minite ago`)
            }
        } else {
            if (seconds > 1) {
                setTimeSet(`${seconds} seconds ago`)
            } else {
                setTimeSet(`${seconds} second ago`)
            }
        }
    }

    const handleLikePost = async () => {
        setIsLike(!isLike)
        console.log('token: ', token)
        console.log('post: ', post.postId)
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

    useEffect(() => {
        validateTime(post.createdAt)
        handleCheckLikeByUser()

        if (!isOpenConfirmBox) {
            setIsShowTippy(false)
        } 
    }, [isOpenConfirmBox])


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
                                <PostSetting postId={post.postId} {...attrs} />
                            )}
                            content='duy'
                            // onClickOutside={() => { dispatch(setIsShowPostTippy(false)) }}
                            interactive={true}

                            visible={isShowTippy && !isOpenConfirmBox}
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
                        <span className={cx('comment-box')}>
                            <i className="fa-regular fa-comment"></i>
                            <span className={cx('comment-count')}>12</span>
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

