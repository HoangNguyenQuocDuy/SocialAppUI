import { memo } from 'react'
import classNames from "classnames/bind";

import styles from "./avatarInfo.module.scss";
import Proptypes from 'prop-types'
import Icon from '../Icon/Icon';
import Image from '../Image/Image';
import images from '~/assets/images';
import { useSelector } from 'react-redux';

const cx = classNames.bind(styles);

AvatarInfo.propTypes = {
  name: Proptypes.string,
  des: Proptypes.string,
  photoUrl: Proptypes.string,
  active: Proptypes.bool,
  className: Proptypes.any,
  rightIcon: Proptypes.any,
  medium: Proptypes.bool,
  onClick: Proptypes.func,
  room: Proptypes.any,
  maxName: Proptypes.number,
  activeRoom: Proptypes.bool,
  lastMessage: Proptypes.string
}

function AvatarInfo({ name, photoUrl, active, className, rightIcon, medium, onClick, room, maxName, activeRoom, lastMessage }) {
  const { theme } = useSelector(state => state.app)

  return (

    <div onClick={onClick} className={cx("wrapper", className, { light: theme === 'light', medium: medium, activeRoom })}>
      <div className={cx("sub-wrapper")}>
        <div className={cx('box-img')}>
          <Image circleBox={false} active={active} middle circle mainImg={photoUrl || images.noAvatar} />
        </div>
        <div className={cx("info", { room: room })}>
          <div className={cx("name", { maxName: maxName })}>{name}</div>
          <p className={cx("des")}>{lastMessage}</p>
        </div>
      </div>
      {rightIcon && <Icon active={true} className={cx('icon-primary', 'iconTheme')} icon={rightIcon} />}
    </div>
  );
}

export default memo(AvatarInfo);
