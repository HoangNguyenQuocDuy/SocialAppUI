import classnames from 'classnames/bind'

import images from '~/assets/images';

import styles from './header.module.scss'
import Image from "~/components/Image/Image";
import { useState } from 'react';
import NavItem from '~/components/NavItem';
import routers from '~/config/routers';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '~/store/slice/accountSlice';
import { clearUser } from '~/store/slice/userSlice';

const cx = classnames.bind(styles)

function Header() {
  const [searchValue, setSearchValue] = useState("")
  const user = useSelector(state => state.user)

  console.log(user)

  const dispatch = useDispatch();

  const handleLogout = (e) => {
    e.preventDefault()
    dispatch(logout())
    dispatch(clearUser())
  }
  return (
    <header className={cx('wrapper')}>
      <Link to='/' className={cx('logo-box')}>
        <span className={cx('logo')}>
          <img src={images.logo} />
        </span>
        <span className={cx('content')}>SocialCat</span>
      </Link>
      <div className={cx('search-box')}>
        <label className={cx('input')}>
          <span className={cx('search-icon')}>
            <i className="isax-search-status-11" />
          </span>
          <span className={cx('input-box')}>
            <input value={searchValue} onChange={(e) => { setSearchValue(e.target.value) }} placeholder="Search something..." />
            {searchValue != "" && <span className={cx('clear-icon')} onClick={() => { setSearchValue("") }}>
              <i className="fa-solid fa-xmark"></i>
            </span>}
          </span>
        </label>
      </div>
      <div className={cx('person-box')}>
        {user.userId!=="" ?
          <>
            <span className={cx('avatar')}>
              <Image mainImg={user.imageUrl!=='' ? user.imageUrl : images.noAvatar} small />
            </span>
            <div className={cx('username')}>
              {user.currentName}
            </div>
            <span className={cx('arrow-down-icon')}>
              <i className='isax-arrow-down1'></i>
            </span>

            <ul className={cx('infomation-login')}>
              <li>
                <NavItem to={routers.profile} icon={<i className='isax-personalcard1'></i>} content='Your account' small />
              </li>
              <li onClick={handleLogout}>
                <NavItem to={routers.home} icon={<i className='isax-logout-11'></i>} content='Log out' small />
              </li>
            </ul>
          </>
          : <div className={cx('login-box')}>
            <span className={cx('login-icon')}>
              <i className='isax-login1'></i>
            </span>
            <Link to={routers.login} className={cx('login-btn')}>Login</Link>
          </div>
        }
      </div>
    </header>
  );
}

export default Header