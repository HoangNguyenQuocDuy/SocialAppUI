import classnames from "classnames/bind";
import Proptype from 'prop-types'

import styles from './announce.module.scss'

const cx = classnames.bind(styles)

Announce.propTypes = {
    message: Proptype.string
}

function Announce({ message }) {
    return ( 
        <section className={cx('wrapper')}>
            {message}
        </section>
     );
}

export default Announce;