import classnames from "classnames/bind";

import styles from './announce.module.scss'
import { useSelector } from "react-redux";

const cx = classnames.bind(styles)

function Announce() {
    const { messageAnnounce } = useSelector(state => state.app)

    return ( 
        <section className={cx('wrapper')}>
            {messageAnnounce}
        </section>
     );
}

export default Announce;