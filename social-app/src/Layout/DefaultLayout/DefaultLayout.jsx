import ProTypes from "prop-types"
import classnames from "classnames/bind"

import Header from "../Components/Header";
import styles from './defaultLayout.module.scss'
import NavBar from "../Components/NavBar";

DefaultLayout.propTypes = {
  children: ProTypes.node.isRequired
};

const cx = classnames.bind(styles)

function DefaultLayout({ children }) {
  return (
    <div className={cx('wrapper')}>
        <Header />
        <div className={cx("container")}>
          <NavBar />
          <div>{ children }</div>
        </div>
    </div>
  );
}

export default DefaultLayout
