import classnames from 'classnames/bind'

import styles from './post.module.scss'
import images from '~/assets/images';
import Image from '../Image/Image';
import Tippy from '@tippyjs/react/headless';
import { useState } from 'react';
import PostSetting from '../PostSetting';

const cx = classnames.bind(styles)

function Post() {
    const [showTippy, setShowTippy] = useState(false)


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
                    <Tippy
                        render={attrs => (
                            <PostSetting {...attrs} />
                        )}
                        content='duy'
                        onClickOutside={() => setShowTippy(false)}
                        interactive={true}
                        
                        visible={showTippy}
                    >
                        <div onClick={() => { setShowTippy((prev) => !prev) }} className={cx('detail')}>
                            <i className="fa-solid fa-ellipsis"></i>
                        </div>
                    </Tippy>

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