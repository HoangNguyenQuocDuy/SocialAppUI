import classnames from "classnames/bind";
import Proptypes from 'prop-types'

import styles from './commentItem.module.scss'
import images from "~/assets/images";
import Image from "../Image/Image";
import { useEffect, useState } from "react";
import newRequet from "~/untils/request";
import { validateTime } from "~/untils/validateTime";

const cx = classnames.bind(styles)

CommentItem.propTypes = {
    comment: Proptypes.object
}

function CommentItem({ comment }) {

    const [user, setUser] = useState({})

    const handleGetUserComment = async () => {
        await newRequet.get(`/users/id/${comment.userId}`)
            .then(response => {
                setUser(response.data.data)
            })
            .catch((err) => {
                console.log('Error when get user for comment:', err)
            })
    }

    useEffect(() => {
        handleGetUserComment()
    }, [])

    return (
        <div className={cx('wrapper')}>
            <span className={cx('image-box')}>
                <Image avatarPost mainImg={images.tanjirou} small circle />
            </span>
            <div className={cx('content-box')}>
                <p className={cx("username")}>
                    {user.currentName}
                </p>
                <p className={cx("comment")}>
                    {comment.content}
                </p>
                <span className={cx('time')}>
                    {validateTime(comment.updatedAt ? comment.updatedAt : comment.createdAt)}
                </span>
            </div>
        </div>
    );
}

export default CommentItem;