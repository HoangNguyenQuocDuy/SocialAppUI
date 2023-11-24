import classnames from "classnames/bind";

import styles from './commentBox.module.scss'
import Image from "../Image/Image";
import images from "~/assets/images";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { setCommentIdIsUpdating, setGalleryImgs, setImgShowSlider, setIsOpenCommentBox, setPostComment, toggleOpenGallery } from "~/store/slice/appSlice";
import newRequet from "~/untils/request";
import { disLike, like } from "~/store/slice/postSlice";
import CommentItem from "../CommentItem/CommentItem";
import { addComment, updateComment } from "~/store/slice/commentSlice";
import { validateTime } from "~/untils/validateTime";

const cx = classnames.bind(styles)

function CommentBox() {
    const dispatch = useDispatch()
    const { userId } = useSelector(state => state.user)
    const { isOpenConfirmBox, isUpdatingPost, postComment, commentIdIsUpdating } = useSelector(state => state.app)
    const comments = useSelector(state => state.comments)
    const [isLike, setIsLike] = useState(false)
    const token = localStorage.getItem('accessToken')
    const [commentText, setcommentText] = useState('')
    const [updateCommentText, setUpdateCommentText] = useState('')
    const commentTxtRef = useRef()
    const updateTxtRef = useRef()

    const handleOpenGallery = () => {
        dispatch(toggleOpenGallery())
    }

    const handleClickLeftImg = () => {
        handleOpenGallery()
        dispatch(setGalleryImgs(postComment.postImageUrls))
        dispatch(setImgShowSlider(0))
    }

    const handleClickRightImg = () => {
        handleOpenGallery()
        dispatch(setGalleryImgs(postComment.postImageUrls))
        dispatch(setImgShowSlider(1))
    }

    const handleLikePost = async () => {
        setIsLike(!isLike)
        console.log('token: ', token)
        console.log('post: ', postComment.postId)
        await newRequet.put(`/posts/update/${postComment.postId}/like`, {}, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(data => {
                console.log(data.data.data)
                if (!isLike) {
                    dispatch(like(postComment))
                } else {
                    dispatch(disLike(postComment))
                }
            })
            .catch(e => {
                console.log("Error when like this post: ", e)
            })
    }

    const handleCheckLikeByUser = () => {
        if (postComment.likedByUser) {
            for (let i = 0; i < postComment.likedByUser.length; i++) {
                if (postComment.likedByUser[i].userId === userId) {
                    setIsLike(true)
                    break
                }
            }
        }
    }

    const handleCloseCommentBox = () => {
        dispatch(setPostComment(null))
        dispatch(setIsOpenCommentBox(false))
    }

    const handleCreateComment = async () => {
        if (commentText !== '') {
            console.log(commentText)
            await newRequet.post(`/comments/save/${postComment.postId}`,
                {
                    content: commentText
                },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                .then(response => {
                    dispatch(addComment(response.data.data))
                    setcommentText('')
                    commentTxtRef.current.focus()
                })
                .catch(err => {
                    console.log('ERROR when create comment:', err)
                })
        }
    }

    const handleUpdateComment = async (commentId) => {
        await newRequet.patch(`/comments/${postComment.postId}/update/${commentId}`,
            {
                content: updateCommentText
            },
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            .then(res => {
                dispatch(setCommentIdIsUpdating(''))
                dispatch(updateComment(res.data.data))

            })
            .catch(err => {
                console.log('ERROR when update comment:', err)
            })
    }

    useEffect(() => {
        handleCheckLikeByUser()

        if (updateTxtRef && commentIdIsUpdating !== '') {
            updateTxtRef.current.focus()
            const updatingComment = comments.find(comment => comment.commentId === commentIdIsUpdating)

            setUpdateCommentText(updatingComment.content)
        }

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                handleCloseCommentBox()
            }
        })

    }, [isOpenConfirmBox, isUpdatingPost, commentIdIsUpdating])

    return (
        <section className={cx('wrapper')}>
            <div className={cx('container')}>
                <header className={cx('header')}>
                    <div className={cx('info')}>
                        <span className={cx('img-box')}>
                            <Image avatarPost mainImg={images.tanjirou} small circle />
                        </span>
                        <span className={cx('username')}>Tanhirouuu</span>
                    </div>
                    <span onClick={handleCloseCommentBox} className={cx('close-icon')}>
                        <i className="fa-solid fa-x"></i>
                    </span>
                </header>
                <section className={cx('box-scroll')}>
                    <p className={cx('content')}>
                        {postComment.postDescription}
                    </p>
                    <div className={cx('pics')}>
                        <div className={cx('pic')}>
                            <div onClick={handleClickLeftImg} className={cx('img-box', { partly: postComment.postImageUrls.length > 1 })}>
                                <img src={postComment.postImageUrls[0]} />
                            </div>

                            {
                                postComment.postImageUrls.length > 1 &&
                                (
                                    <div onClick={handleClickRightImg} className={cx('img-box', { partly: postComment.postImageUrls.length > 1 })}>
                                        <img src={postComment.postImageUrls[1]} />
                                        <span className={cx({ 'layer': postComment.postImageUrls.length > 2 })}>
                                            {postComment.postImageUrls.length > 2 && `+${postComment.postImageUrls.length - 2}`}
                                        </span>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <footer className={cx('footer')}>
                        <div className={cx('wrapper-likeBox')}>
                            <span className={cx('like-box')}>
                                <i onClick={handleLikePost} className={cx('isax-heart1', { isLike })}></i>
                                <span className={cx('likes-count')}>{postComment.likes}</span>
                            </span>
                            <span className={cx('comment-icon')}>
                                <i className="fa-regular fa-comment"></i>
                                <span className={cx('comment-count')}>{comments.length}</span>
                            </span>
                        </div>
                        <div className={cx('comment-box')}>
                            {
                                comments && comments.map(comment => {
                                    return (
                                        commentIdIsUpdating !== '' && comment.commentId === commentIdIsUpdating ?
                                            <section key={comment.commentId} className={cx('user-comment', 'update')}>
                                                <span className={cx('avatar')}>
                                                    <Image avatarPost mainImg={images.tanjirou} small circle />
                                                </span>
                                                <span className={cx('txt-box')}>
                                                    <input value={updateCommentText} ref={updateTxtRef} onChange={e => { setUpdateCommentText(e.target.value) }} className={cx('txt-comment')} />
                                                    <span onClick={() => { handleUpdateComment(comment.commentId) }} className={cx("send-icon", { active: updateComment !== '' })}>
                                                        <i className="fa-solid fa-paper-plane"></i>
                                                    </span>
                                                    <span className={cx('time')}>
                                                        {validateTime(comment.updatedAt ? comment.updatedAt : comment.createdAt)}
                                                    </span>
                                                </span>
                                            </section> :
                                            <CommentItem key={comment.commentId} comment={comment} />
                                    )
                                }
                                )
                            }
                        </div>
                    </footer>
                </section>
                <section className={cx('user-comment')}>
                    <span className={cx('avatar')}>
                        <Image avatarPost mainImg={images.tanjirou} small circle />
                    </span>
                    <span className={cx('txt-box')}>
                        <input value={commentText} ref={commentTxtRef} onChange={e => { setcommentText(e.target.value) }} placeholder="Write your comment..." className={cx('txt-comment')} />
                        <span onClick={handleCreateComment} className={cx("send-icon", { active: commentText !== '' })}>
                            <i className="fa-solid fa-paper-plane"></i>
                        </span>
                    </span>
                </section>
            </div>
        </section>
    );
}

export default CommentBox;