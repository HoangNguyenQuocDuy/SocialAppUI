import classnames from 'classnames/bind'
import PropType from 'prop-types'

import styles from './postSetting.module.scss'
import { useDispatch } from 'react-redux'
import { setIsOpenConfirmBox, setIsShowPostTippy, setIsUpdatingPost, setPostIdWillBeDeleted, setPostWillBeUpdated } from '~/store/slice/appSlice'

const cx = classnames.bind(styles)

PostSetting.propTypes = {
    post: PropType.object
}

function PostSetting({ post }) {
    const dispatch = useDispatch()

    const handleDeleteOption = async () => {
        dispatch(setPostIdWillBeDeleted(post.postId))
        dispatch(setIsShowPostTippy(false))
        dispatch(setIsOpenConfirmBox(true))
    }

    const handleUpdateOption = () => {
        dispatch(setIsUpdatingPost(true))
        dispatch(setPostWillBeUpdated(post))
        dispatch(setIsShowPostTippy(false))
    }

    return (
        <>
            <div className={cx("wrapper")}>
                <ul className={cx('menu')}>
                    <li onClick={handleUpdateOption}>
                        <i className='isax-rulerpen111' />
                        Update post
                    </li>
                    <li onClick={handleDeleteOption}>
                        <i className='isax-trash1' />
                        Delete post
                    </li>
                </ul>
            </div>
        </>
    );
}

export default PostSetting;