import classnames from 'classnames/bind'

import CreatePost from "~/components/CreatePost";
import styles from './home.module.scss'
import Stories from '~/components/Stories';

const cx = classnames.bind(styles)

function Home() {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('container')}>
        <aside className={cx('wrapper-left')}>
          <CreatePost />
          <div className={cx('stories')}>
            <Stories />
          </div>
        </aside>
        <aside className={cx('wrapper-right')}>

        </aside>
      </div>
    </div>
  );
}

export default Home