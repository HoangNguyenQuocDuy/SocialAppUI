import classNames from "classnames/bind";
import Proptypes from 'prop-types'

import styles from "./feature.module.scss";
import Icon from "../Icon/Icon";
import { useSelector } from "react-redux";

const cx = classNames.bind(styles);

Feature.propTypes = {
  icon: Proptypes.any,
  title: Proptypes.string,
  onClick: Proptypes.func,
  className: Proptypes.any
}

function Feature({ icon, title, onClick, className, }) {
  const { theme } = useSelector(state => state.app)

  return (
    <div className={cx("wrapper", className, { light: theme==='light'})} onClick={onClick}>
      <Icon width='20px' noBackground className={cx('icon')} icon={icon} />
      <span className={cx("title")}>{title}</span>
    </div>
  );
}

export default Feature;
