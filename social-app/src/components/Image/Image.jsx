import classnames from 'classnames/bind'
import ProTypes from "prop-types"

import styles from './image.module.scss'

const cx = classnames.bind(styles)

Image.propTypes = {
    mainImg: ProTypes.string,
    subImg: ProTypes.string,
    active: ProTypes.bool,
    small: ProTypes.bool,
    middle: ProTypes.bool,
    circle: ProTypes.bool,
    circleBox: ProTypes.bool,
    viewed: ProTypes.bool,
    avatarPost: ProTypes.bool,
    styles: ProTypes.any
};

function Image({ mainImg, subImg, active, small, middle, circleBox, circle, viewed, avatarPost }) {
    return (
        <div className={cx('wrapper', { small, middle, circleBox, viewed, avatarPost, circle})}>
            <span className={cx('box')}>
                <img className={cx('mainImg')} src={mainImg} />
                <span className={cx('sub-box', { active })}>
                    <img className={cx('subImg')} src={subImg} />
                </span>
            </span>
            <span className={cx('', { active })}></span>
        </div>
    );
}

export default Image;