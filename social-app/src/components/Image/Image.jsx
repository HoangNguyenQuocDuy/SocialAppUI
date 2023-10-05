import classnames from 'classnames/bind'

import styles from './image.module.scss'

const cx = classnames.bind(styles)

// eslint-disable-next-line react/prop-types, no-unused-vars
function Image({ mainImg, subImg, active }) {
    return (
        <div className={cx('wrapper')}>
            <span>
                <image src={mainImg} />
                <span className={cx('sub-box', { active })}>
                    
                </span>
            </span>

        </div>
    );
}

export default Image;