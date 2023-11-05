import classnames from "classnames/bind";

import styles from './loadBox.module.scss'

const cx = classnames.bind(styles)

function LoadBox() {
    return (
        <div className={cx('wrapper')}><i className="fa-solid fa-spinner"></i></div>
    );
}

export default LoadBox;
