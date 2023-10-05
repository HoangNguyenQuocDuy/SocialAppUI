import logo from "~/assets/images/logo.png";
import classnames from 'classnames/bind'

import styles from './header.module.scss'

const cx = classnames.bind(styles)

function Header() {
  return (
    <header className={cx('wrapper')}>
      <div className={cx('logo-box')}>
        <span className={cx('logo')}>
          <img src={logo} />
        </span>
        <span className={cx('content')}>SocialCat</span>
      </div>
      <div className={cx('search-box')}>
        <span className={cx('search-icon')}>
          <i className="isax-search-status-11" />
        </span>
        <span className={cx('content')}>
          <input placeholder="Search something..." />
        </span>
      </div>

      <div className={cx('person-box')}>
        <span className={cx('search-icon')}>
          <i className="isax-search-status-11" />
        </span>
        <span className={cx('content')}>
          <input placeholder="Search something..." />
        </span>
      </div>
    </header>
  );
}

export default Header