import classnames from "classnames/bind";


import styles from './PostUpdate.module.scss'

const cx = classnames.bind(styles)

function PostUpdate() {
    return ( 
    <section className={cx('wrapper')}>
        <div className={cx("post-update")}>

        </div>
    </section> );
}

export default PostUpdate;