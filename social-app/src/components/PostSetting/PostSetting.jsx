import classnames from 'classnames/bind'
import PropType from 'prop-types'

import styles from './postSetting.module.scss'
import { useDispatch } from 'react-redux'
import { setIsOpenConfirmBox, setIsShowPostTippy, setPostIdWillBeDeleted } from '~/store/slice/appSlice'

const cx = classnames.bind(styles)

PostSetting.propTypes = {
    postId: PropType.string
}

function PostSetting({ postId }) {
    const dispatch = useDispatch()

    const handleDeleteOption = async () => {
        dispatch(setPostIdWillBeDeleted(postId))
        dispatch(setIsShowPostTippy(false))
        dispatch(setIsOpenConfirmBox(true))
    }

    return (
        <>
            <div className={cx("wrapper")}>
                <ul className={cx('menu')}>
                    <li onClick={() => { console.log('1') }}>
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