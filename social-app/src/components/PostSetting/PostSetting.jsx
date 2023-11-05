import classnames from 'classnames/bind'
import PropType from 'prop-types'

import styles from './postSetting.module.scss'
import {  useDispatch, useSelector } from 'react-redux'
import newRequet from '~/untils/request'
import { deletePost } from '~/store/slice/postSlice'

const cx = classnames.bind(styles)

PostSetting.propTypes = {
    postId: PropType.string
}

function PostSetting({ postId }) {
    const dispatch = useDispatch()

    const accessToken = useSelector(state => state.account.accessToken)

    const handleDeletePost = async () => {
        await newRequet.delete(`/posts/delete/${postId}`, 
        {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
        .then(data => {
            dispatch(deletePost(data.data.data))
        })
        .catch(err => {
            console.log('ERR when delete posst', err)
        })
    }

    return (
        <div className={cx("wrapper")}>
            <ul className={cx('menu')}>
                <li onClick={() => { console.log('1') }}>
                    <i className='isax-rulerpen111' />
                    Update post
                </li>
                <li onClick={handleDeletePost}>
                    <i className='isax-trash1' />
                    Delete post
                </li>
            </ul>
        </div>
    );
}

export default PostSetting;