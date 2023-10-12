import Proptypes from 'prop-types'
import classnames from 'classnames/bind'

import styles from './storyItem.module.scss'
import images from '~/assets/images';
import Image from '../Image/Image';

const cx = classnames.bind(styles)

StoryItem.propTypes = {
    addItem: Proptypes.bool
}

function StoryItem({ addItem }) {
    return (
        <div className={cx('wrapper')}>
            {addItem ?
                <div className={cx('story')}>
                    <img src={images.tanjirou} />
                    <span className={cx('plus-icon-box')}>
                        <i className="fa-solid fa-plus"></i>
                    </span>
                </div> :
                <div className={cx('story')}>
                    <img src={images.cat2} />
                    <span className={cx('catLeg-icon-box')}>
                        <i className="fa-solid fa-paw"></i>
                    </span>
                    <span className={cx('avatar-box')}>
                        <Image mainImg={images.tanjirou} small circle />
                    </span>
                </div>
            }

        </div>
    );
}

export default StoryItem;