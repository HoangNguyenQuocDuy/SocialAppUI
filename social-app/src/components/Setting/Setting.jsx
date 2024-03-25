import {
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";

import styles from "./setting.module.scss";
import AvatarInfo from "~/components/AvatarInfo";
import Feature from "~/components/Feature";
import Icon from "../Icon/Icon";
import { useDispatch, useSelector } from "react-redux";
import { setTheme, setUserSettingVisible } from "~/store/slice/appSlice";

const cx = classNames.bind(styles);

function Setting() {
  const dispatch = useDispatch()

  const { theme } = useSelector(state => state.app)

  const changeTheme = () => {
    if (theme === "dark") {
      dispatch(setTheme("light"))
    } else {
      dispatch(setTheme("dark"))
    }
  };

  const handleClose = () => {
    dispatch(setUserSettingVisible(false))

  }


  const listSetting = [
    {
      icon: 'fa-solid fa-moon',
      title: `Chế độ tối: ${theme === "dark" ? "Đang bật" : "Đang tắt"
        } `,
      onClick: changeTheme,
    },
  ];

  return (
    <div className={cx("wrapper", { light: theme === "light" })}>
      <p className={cx("title")}>
        Tùy chọn
          <Icon
            onClick={handleClose}
            noBackground={true}
            icon={'fa-solid fa-x'}
            className={cx('remove', { light: theme === "light" })}
          />
      </p>
      <p className={cx("intro")}>Tài khoản</p>
      <div className={cx("avt")}>
        <AvatarInfo name='Duy' des='Sửa tên và ảnh đại diện' rightIcon={faUserPen} />
      </div>
      <ul className={cx("setting")}>
        {listSetting.map((item, idx) => {
          return (
            <li key={idx}>
              <Feature
                icon={item.icon}
                title={item.title}
                onClick={item.onClick}
              />
            </li>
          );
        })}
      </ul>
      <div className={cx("log-out")}>
        <Feature onClick={() => { }} icon={'fa-solid fa-arrow-right-from-bracket'} title="Đăng xuất" />
      </div>
    </div>
  );
}

export default Setting;
