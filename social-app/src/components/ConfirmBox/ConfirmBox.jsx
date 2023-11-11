import classnames from "classnames/bind";
import Proptypes from 'prop-types'

import styles from './confirmBox.module.scss'

const cx = classnames.bind(styles)

ConfirmBox.propTypes = {
    message: Proptypes.string,
    yesAction: Proptypes.func,
    noAction: Proptypes.func
}

function ConfirmBox({ message, yesAction, noAction }) {

    return (
        <section className={cx('confirm-box')}>
            <div className={cx('wrapper')}>
                <p className={cx('title')}>{ message }</p>
                <div className={cx('button-box')}>
                    <button onClick={yesAction} className={cx('yes-btn')}>Yes</button>
                    <button onClick={noAction} className={cx('no-btn')}>No</button>
                </div>
                <span onClick={noAction} className={cx('close-icon')}>
                    <i className="fa-solid fa-x"></i>
                </span>
            </div>
        </section>
    );
}

export default ConfirmBox;