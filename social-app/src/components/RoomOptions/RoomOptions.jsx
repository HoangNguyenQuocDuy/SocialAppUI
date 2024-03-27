import classNames from "classnames/bind";
import Proptypes from 'prop-types'

import styles from "./roomOptions.module.scss";
import { useSelector } from "react-redux";

const cx = classNames.bind(styles);

RoomOptions.propTypes = {
  title: Proptypes.string,
  list: Proptypes.array,
  leftIcon: Proptypes.any,
  rightIcon: Proptypes.any,
  className: Proptypes.any,
  rotateRightIcon: Proptypes.bool,
  onClick: Proptypes.func
}

function RoomOptions({ title, list, leftIcon, rightIcon, className, rotateRightIcon, onClick }) {
  const { theme } = useSelector(state => state.app)
  return (
    <div onClick={onClick} className={cx("wrapper", className, { light: theme==='light' })}>
      <p className={cx("title")}>
        {leftIcon && (
          <span className={cx("leftIcon")}>
            <i className={leftIcon} />
          </span>
        )}
        {title}
        {list && (
          <ul>
            {list.map((item, idx) => {
              return (
                <li key={idx}>
                  {item.leftIcon && (
                    <div className={cx("subLeftIcon")}>{item.leftIcon}</div>
                  )}
                  {item.title}
                  {item.rightIcon && (
                    <div className={cx("subRightIcon")}>{item.RightIcon}</div>
                  )}
                  {item.subList && (
                    <ul>
                      {/* {item.subList.map((item, idx) => {
                        <li key={idx}>{

                        }</li>;
                      })} */}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </p>
      {rightIcon && (
        <div className={cx("rightIcon", { open: rotateRightIcon })}>
          <i className={rightIcon} />
        </div>
      )}
    </div>
  );
}

export default RoomOptions;
