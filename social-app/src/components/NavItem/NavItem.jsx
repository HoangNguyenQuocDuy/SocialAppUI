import classnames from 'classnames/bind'
import ProTypes from 'prop-types'

import styles from "./navItem.module.scss"
import { Link } from 'react-router-dom';

const cx = classnames.bind(styles)

NavItem.propTypes = {
    to: ProTypes.string,
    icon: ProTypes.node,
    content: ProTypes.string,
    small: ProTypes.bool,
    middle: ProTypes.bool,
    active: ProTypes.bool,
    unTo: ProTypes.bool
}

function NavItem({ to, icon, content, small, middle, active, unTo }) {
    return (
        <div>
            {
                unTo ?
                    (< div className={cx('wrapper', { small, middle, active })} to={to} >
                        <span className={cx('icon')}>{icon}</span>
                        <span className={cx('content')}>{content}</span>
                    </div >) : (<Link className={cx('wrapper', { small, middle, active })} to={to}>
                        <span className={cx('icon')}>{icon}</span>
                        <span className={cx('content')}>{content}</span>
                    </Link>)
            }
        </div>
    );
}

export default NavItem;