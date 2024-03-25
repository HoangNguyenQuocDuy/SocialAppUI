// import { useRef } from "react";
import classNames from "classnames/bind";

import styles from "./chatRoom.module.scss";

import ChatWindow from "./ChatWindow";
import Setting from "../Setting";
import Sidebar from "./Sidebar";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserAddRoomVisible, setUserSettingVisible } from "~/store/slice/appSlice";
import AddRoom from "./AddRoom/AddRoom";

const cx = classNames.bind(styles);

function ChatRoom() {
  const personalSettingRef = useRef();
  const personalAddRoomRef = useRef();
  console.log("chatroom re-render");
  const dispatch = useDispatch()

  const { userSettingVisible, userAddRoomVisible } = useSelector(state => state.app)

  useEffect(() => {
    const handleSettingClick = (e) => {
      e.stopPropagation();
      if (e.target === personalSettingRef.current) {
        dispatch(setUserSettingVisible(false))
      }
    };

    const handleAddRoomClick = (e) => {
      e.stopPropagation();
      if (e.target === personalAddRoomRef.current) {
        dispatch(setUserAddRoomVisible(false))
      }
    };

    window.addEventListener("click", handleSettingClick);
    window.addEventListener("click", handleAddRoomClick);

    return () => {
      window.removeEventListener("click", handleSettingClick);
      window.removeEventListener("click", handleAddRoomClick);
    };
  }, [userSettingVisible]);
  const { theme } = useSelector(state => state.app)

  return (
    <div className={cx("wrapper", { overlay: userSettingVisible, light: theme==='light' })}>
      <div className={cx("sidebar")}>
        <Sidebar />
      </div>
      <div className={cx("chatWindow")}>
        <ChatWindow />
      </div>
      <div
        ref={personalSettingRef}
        className={cx("personal-setting", {
          overlay: userSettingVisible,
        })}
      >
        <Setting 
        ref={personalSettingRef}
         />
      </div>

      <div
        ref={personalAddRoomRef}
        className={cx("personal-setting", {
          overlay: userAddRoomVisible,
        })}
      >
        <AddRoom 
        ref={personalAddRoomRef}
         />
      </div>
    </div>
  );
}

export default ChatRoom;
