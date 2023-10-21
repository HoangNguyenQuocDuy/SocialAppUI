import classnames from 'classnames/bind'

import styles from './postSetting.module.scss'

const cx = classnames.bind(styles)

function PostSetting() {
    return (
        <div className={cx("wrapper")}>
            <ul className={cx('menu')}>
                <li onClick={() => { console.log('1') }}>
                    <i className='isax-rulerpen111' />
                    Update post
                </li>
                <li onClick={() => { console.log('2') }}>
                    <i className='isax-trash1' />
                    Delete post
                </li>
            </ul>
        </div>
    );
}

export default PostSetting;