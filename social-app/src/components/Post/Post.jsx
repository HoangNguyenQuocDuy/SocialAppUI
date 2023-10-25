import classnames from 'classnames/bind'

import styles from './post.module.scss'
import images from '~/assets/images';
import Image from '../Image/Image';
import Tippy from '@tippyjs/react/headless';
import { useState } from 'react';
import PostSetting from '../PostSetting';
import { useDispatch } from 'react-redux';
import { setImgShowSlider, toggleOpenGallery } from '~/store/slice/appSlice';

const cx = classnames.bind(styles)

function Post() {
    const [showTippy, setShowTippy] = useState(false)
    const dispatch = useDispatch()

    const posts = [
        { postImageUrls: [images.catFat, images.tanjirou, images.logo] },
    ]

    const handleOpenGallery = () => {
        dispatch(toggleOpenGallery(true))
    }

    const handleClickLeftImg = () => {
        handleOpenGallery()
        dispatch(setImgShowSlider(0))
    }

    const handleClickRightImg = () => {
        handleOpenGallery()
        dispatch(setImgShowSlider(1))
    }


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
                        <div onClick={handleClickLeftImg} className={cx('img-box', { partly: posts[0].postImageUrls.length > 1 })}>
                            <img src={posts[0].postImageUrls[0]} />
                        </div>

                        {
                            posts[0].postImageUrls.length > 1 &&
                            (
                                // posts[0].postImageUrls.map((item, idx) => (
                                <div onClick={handleClickRightImg} className={cx('img-box', { partly: posts[0].postImageUrls.length > 1 })}>
                                    <img src={posts[0].postImageUrls[1]} />
                                    <span className={cx('layer')}>
                                        +2
                                    </span>
                                </div>
                            )
                        }
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