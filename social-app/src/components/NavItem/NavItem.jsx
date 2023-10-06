import classnames from 'classnames/bind'
import ProTypes from 'prop-types'

import styles from "./navItem.module.scss"
import { Link } from 'react-router-dom';

const cx = classnames.bind(styles)

NavItem.propTypes = {
    to: ProTypes.string,
    icon: ProTypes.string,
    content: ProTypes.string,
    small: ProTypes.bool,
    middle: ProTypes.bool,
    active: ProTypes.bool
}

function NavItem({ to, icon, content, small, middle, active }) {
    return ( 
        <Link className={cx('wrapper', { small, middle, active })} to={to}>
            <span className={cx('icon')}>{icon}</span>
            <span className={cx('content')}>{content}</span>
        </Link>
     );
}

export default NavItem;