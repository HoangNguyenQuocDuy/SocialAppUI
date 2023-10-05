import classNames from "classnames/bind";

import styles from './navbar.module.scss'

const cx = classNames.bind(styles)

function NavBar() {
    return ( 
        <div className={cx('wrapper')}>
            Navbar
        </div>
     );
}

export default NavBar;