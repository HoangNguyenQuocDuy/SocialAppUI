import classnames from 'classnames/bind'

import styles from './post.module.scss'
import images from '~/assets/images';
import Image from '../Image/Image';

const cx = classnames.bind(styles)

function Post() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <header className={cx('header')}>
                    <div className={cx('info')}>
                        <span className={cx('img-box')}>
                            <Image avatarPost mainImg={images.tanjirou} small circle />
                        </span>
                        <span className={cx('username')}>Tanhirouuu</span>
                    </div>
                    <div className={cx('detail')}>
                        <i className="fa-solid fa-ellipsis"></i>
                    </div>
                </header>
                <p className={cx('content')}>
                    The Empire State Building, it’s a must when in New York, so excited to go visit with my team this year!
                </p>
                <div className={cx('pics')}>
                    <div className={cx('pic')}>
                        <img src={images.cat1} />

                    </div>
                </div>
                <footer className={cx('footer')}>
                    <span>
                        <span className={cx('like-box')}>
                            <i className={cx('isax-heart1')}></i>
                            <span className={cx('likes-count')}>123</span>
                        </span>
                        <span className={cx('comment-box')}>
                            <i className="fa-regular fa-comment"></i>
                            <span className={cx('comment-count')}>12</span>
                        </span>
                    </span>
                    <span className={cx('time-post')}>
                        4h ago
                    </span>
                </footer>
            </div>
        </div>
    );
}

export default Post;