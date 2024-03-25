import { forwardRef } from "react";
import classNames from "classnames/bind";
import Proptypes from 'prop-types'

import styles from "./icon.module.scss";
import { useSelector } from "react-redux";

const cx = classNames.bind(styles);

const Icon = forwardRef(
  ({ icon, onClick, IconAccess, width, height, color, noBackground, className }, ref) => {
    const { theme } = useSelector(state => state.app)

    return (
      <button
    
        ref={ref}
        onClick={onClick}
        className={cx("wrapper", className, {
          noBackground: noBackground,
          light: theme === "light",
        })}
      >
        {IconAccess ? (
          <IconAccess width={width} height={height} color={color} />
        ) : (
          <i className={icon} style={{ fontSize:`${width}`, color }} />
        )}
      </button>
    );
  }
);

Icon.displayName = 'Icon'

Icon.propTypes = {
  icon: Proptypes.any,
  onClick: Proptypes.func,
  IconAccess: Proptypes.any,
  width: Proptypes.any,
  height: Proptypes.any,
  color: Proptypes.string,
  noBackground: Proptypes.bool,
  className: Proptypes.any
}

export default Icon;
