import classnames from "classnames/bind";
import Proptypes from 'prop-types'

import styles from './commentItem.module.scss'
import images from "~/assets/images";
import Image from "../Image/Image";
import { useEffect, useState } from "react";
import newRequet from "~/untils/request";
import { validateTime } from "~/untils/validateTime";
import Tippy from "@tippyjs/react/headless";
import { useDispatch, useSelector } from "react-redux";
import { setCommentIdIsUpdating, setCommentIdWillBeDeleted, setIsOpenConfirmBox, setPostIdWillBeDeleted } from "~/store/slice/appSlice";

const cx = classnames.bind(styles)

CommentItem.propTypes = {
    comment: Proptypes.object
}

function CommentItem({ comment }) {

    const [user, setUser] = useState({})
    const { username } = useSelector(state => state.account)
    const [isOpenTippy, setIsOpenTippy] = useState(username === user.username)
    const time = validateTime(comment.updatedAt ? comment.updatedAt : comment.createdAt)

    const dispatch = useDispatch()

    const handleGetUserComment = async () => {
        try {
            const response = await newRequet.get(`/users/id/${comment.userId}`)
            setUser(response.data.data)
            setIsOpenTippy(username === response.data.data.username)
        }
        catch (err) {
            console.log('Error when get user for comment:', err)
        }
    }

    const handleUpdateOption = () => {
        dispatch(setCommentIdIsUpdating(comment.commentId))
    }

    const handleDeleteOption = () => {
        dispatch(setPostIdWillBeDeleted())
        dispatch(setCommentIdWillBeDeleted(comment.commentId))
        dispatch(setIsOpenConfirmBox(true))
    }

    useEffect(() => {
        dispatch(setIsOpenConfirmBox(false))
        handleGetUserComment()
    }, [])

    return (
        <div className={cx('wrapper')}>
            <span className={cx('image-box')}>
                <Image avatarPost mainImg={images.tanjirou} small circle />
            </span>
            <Tippy
                render={attrs => (
                    <Tippy
                        {...attrs}
                        render={attrs => (

                            isOpenTippy ? <ul {...attrs} className={cx('tools')}>
                                <li onClick={handleUpdateOption}>
                                    <i className='isax-rulerpen111' />
                                    Update
                                </li>
                                <li onClick={handleDeleteOption}>
                                    <i className='isax-trash1' />
                                    Delete
                                </li>
                            </ul> : <></>

                        )}
                        interactive={true}
                        placement="right"
                        trigger="click"
                    >
                        <div {...attrs} className={cx('details')}>
                            <i className="fa-solid fa-ellipsis"></i>
                        </div>
                    </Tippy>
                )}
                interactive={true}
                placement={"right"}
            >
                <div className={cx('content-box')}>
                    <p className={cx("username")}>
                        {user.currentName}
                    </p>
                    <p className={cx("comment")}>
                        {comment.content}
                    </p>
                    <span className={cx('time')}>
                        {time}
                    </span>
                </div>
            </Tippy>

        </div>
    );
}

export default CommentItem;