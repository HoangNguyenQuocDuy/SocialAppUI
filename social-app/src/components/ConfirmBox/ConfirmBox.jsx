import classnames from "classnames/bind";

import styles from './confirmBox.module.scss'
import { setIsOpenConfirmBox, setIsShowAnnounce, setPostIdWillBeDeleted } from "~/store/slice/appSlice";
import { useDispatch, useSelector } from "react-redux";
import newRequet from "~/untils/request";
import { deletePost } from "~/store/slice/postSlice";

const cx = classnames.bind(styles)

function ConfirmBox() {
    const dispatch = useDispatch()
    const token = localStorage.getItem('accessToken')

    const handleCloseConfirmBox = () => {
        dispatch(setIsOpenConfirmBox(false))
    }

    const { postIdWillBeDeleted } = useSelector(state => state.app)

    const handleDeletePost = async () => {

        await newRequet.delete(`/posts/delete/${postIdWillBeDeleted}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            .then(data => {
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

    return (
        <section className={cx('confirm-box')}>
            <div className={cx('wrapper')}>
                <p className={cx('title')}>Do you want to delete this post ?</p>
                <div className={cx('button-box')}>
                    <button onClick={handleDeletePost} className={cx('yes-btn')}>Yes</button>
                    <button onClick={handleCloseConfirmBox} className={cx('no-btn')}>No</button>
                </div>
                <span onClick={handleCloseConfirmBox} className={cx('close-icon')}>
                    <i className="fa-solid fa-x"></i>
                </span>
            </div>
        </section>
    );
}

export default ConfirmBox;