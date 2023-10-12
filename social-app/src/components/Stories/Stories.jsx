import classnames from 'classnames/bind'

import styles from './stories.module.scss'
import StoryItem from '../StoryItem';

const cx = classnames.bind(styles)

function Stories() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('title')}>Stories</div>
            <div className={cx('stories')}>
                <div className={cx('storyItem')}>
                    <StoryItem addItem />
                </div>
                <div className={cx('storyItem')}>
                    <StoryItem />
                </div>
                <div className={cx('storyItem')}>
                    <StoryItem />
                </div>
                <div className={cx('storyItem')}>
                    <StoryItem />
                </div>
                <div className={cx('storyItem')}>
                    <StoryItem />
                </div>
                <div className={cx('storyItem')}>
                    <StoryItem />
                </div>
            </div>
        </div>
    );
}

export default Stories;