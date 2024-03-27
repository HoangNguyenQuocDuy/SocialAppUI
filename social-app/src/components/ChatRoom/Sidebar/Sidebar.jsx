import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import {
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./sidebar.module.scss";
import Icon from "~/components/Icon/Icon";
import RoomList from "../RoomList";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoomByUserId } from "~/store/slice/roomSlice";
import { setUserAddRoomVisible, setUserSettingVisible } from "~/store/slice/appSlice";
import ImageChatBox from "~/components/ImageChatBox";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

function Sidebar() {
  const [isFetchedRoom, setIsFetchedRoom] = useState(false)
  const [isSearch, setIsSearch] = useState(false);
  const { theme } = useSelector(state => state.app)

  const dispatch = useDispatch()
  const { accessToken } = useSelector(state => state.account)
  const rooms = useSelector(state => state.rooms)
  const { userSettingVisible, userAddRoomVisible } = useSelector(state => state.app)

  useEffect(() => {
    if (!isFetchedRoom) {
      dispatch(fetchRoomByUserId(accessToken))
      console.log("rooms: ", rooms)
      setIsFetchedRoom(true)
    } else {
      if (!userAddRoomVisible) {
        dispatch(fetchRoomByUserId(accessToken))
      }
    }
  }, [userAddRoomVisible])

  const handleOpenUserSetting = () => {
    dispatch(setUserSettingVisible(!userSettingVisible))
  };

  const handleSearchUser = () => {
    setIsSearch(!isSearch);
  };

  const handleOpenAddRoom = () => {
    dispatch(setUserAddRoomVisible(true))
  }

  return (
    <div className={cx("wrapper", { light: theme === "light" })}>
      <div className={cx("wrapper-header")}>
        <div className={cx("header")}>
          <ImageChatBox onClick={handleOpenUserSetting} className={cx("img")} src="" />
          <Link className={cx('title', { light: theme==='light' })} to={'/'}>Chat App</Link>
          <Icon onClick={handleOpenAddRoom} width="22px" icon='fa-regular fa-pen-to-square' />
        </div>
        <div className={cx("find-box")}>
          <span
            onClick={handleSearchUser}
            className={cx("icon", {
              light: theme === "light",
              searchUser: isSearch,
            })}
          >
            {isSearch ? (
              <Icon icon={faArrowLeft} />
            ) : (
              <i className="isax-search-normal-11" />
            )}
          </span>

          <input
            className={cx({ light: theme === "light", searchUser: isSearch, })}
            type="text"
            placeholder="Tìm kiếm..."
          />
        </div>
      </div>
      <div className={cx("room-list")}>
        {rooms && <RoomList rooms={rooms} />}
      </div>
    </div>
  );
}

export default Sidebar;
