import classnames from 'classnames/bind'

import styles from './listIcon.module.scss'

const cx = classnames.bind(styles)

function ListIcon() {
    return (<div className={cx('wrapper')}>ListIcon</div>);
}

export default ListIcon;