import { useEffect, useState } from "react";
import Tippy from "@tippyjs/react/headless";
import "tippy.js/dist/tippy.css";
import classNames from "classnames/bind";

import styles from "./chatWindow.module.scss";
import AvatarInfo from "~/components/AvatarInfo";
import RoomOptions from "~/components/RoomOptions";
import Feature from "~/components/Feature";
import MessageForm from "~/components/MessageForm/MessageForm";
import Icon from "~/components/Icon/Icon";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { fetchMessageByRoomId } from "~/store/slice/messageSlice";

import ImageChatBox from "~/components/ImageChatBox";
import newRequet from "~/untils/request";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faTrash } from '@fortawesome/free-solid-svg-icons';
import { setUserAddRoomVisible, setUserAddUserToRoom, setUserRoomOptionActive } from "~/store/slice/appSlice";
import { over } from "stompjs";
import sockJS from 'sockjs-client/dist/sockjs'
import { fetchRoomByUserId } from "~/store/slice/roomSlice";

const cx = classNames.bind(styles);

function ChatWindow() {
  const { roomIdActive } = useSelector(state => state.app)
  const { theme, userRoomOptionActive } = useSelector(state => state.app)

  const dispatch = useDispatch()

  const [roomData, setRoomData] = useState()
  const [isOpenOptions, setIsOpenOptions] = useState(false);
  const [isShowOptionsUserSetting, setIsShowOptionsUserSetting] = useState(false)

  const rooms = useSelector(state => state.rooms)
  const [rName, setRName] = useState('')
  const messages = useSelector(state => state.messages)
  const { accessToken } = useSelector(state => state.account)
  const { userId } = useSelector(state => state.user)
  const [stompClient, setStompClient] = useState(null);
  const [isConnect, setIsConnect] = useState(false);
  const [isDeleteUser, setIsDeleteUser] = useState(false)

  const roomOptions = [
    {
      id: 1,
      title: `Thành viên đoạn chat(${roomData && roomData.users.length})`,
      rightIcon: 'isax-arrow-right-11',
    },
    {
      id: 2,
      title: "File phương tiện, File và liên kết",
      rightIcon: 'isax-arrow-right-11',
      subList: [
        {
          leftIcon: 'isax-record-circle',
          title: "Đổi chủ đề",
        },
        {
          leftIcon: 'isax-search-normal-11',
          title: "Tìm kiếm trong cuộc trò chuyện",
        },
      ],
    },
    {
      id: 3,
      title: "Quyền riêng tư và hỗ trợ",
      rightIcon: 'isax-arrow-right-11',
      subList: [
        {
          leftIcon: 'isax-record-circle',
          title: "Đổi chủ đề",
        },
        {
          leftIcon: 'isax-like-1',
          title: "Thay đổi biểu tượng cảm xúc",
        },
      ],
    },
  ];

  const onConnect = () => {
    console.log('connect ws successful')
    setIsConnect(true)
  }

  const onError = () => {
    setIsConnect(false)
    console.log('error connect')
  }

  const connect = () => {
    const sock = new sockJS('http://localhost:8089/ws');
    const temp = over(sock)

    setStompClient(temp)
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      // "X-XSRF-TOKEN": getCookie('XSRF-TOKEN')
    }
    temp.connect(headers, onConnect, onError)
  }

  const handleDeleteUserFromRoom = (userId) => {
    if (stompClient && stompClient.connected) {
      let data = {
        roomId: roomIdActive,
        userId
      }
      stompClient.send('/app/chat.deleteUserFromRoom', {}, JSON.stringify(data));
      setIsDeleteUser(true)
      console.log('Room delete sent:', data);
    } else {
      console.log('Not connected to WebSocket');
    }
  }

  var tempToggle = [];
  useEffect(() => {
    roomOptions.forEach((item, idx) => {
      tempToggle[idx] = false;
    });

    setRoomData(rooms.find(room => room.id === roomIdActive))
    if (roomData && rName === '') {
      roomData.users.forEach(room => { setRName(state => state + ', ' + room.currentName) })
    }

    if (roomIdActive) {
      dispatch(fetchMessageByRoomId({ roomIdActive, accessToken }))
      setRoomData(rooms.find(room => room.id === roomIdActive))
    }

  }, [roomIdActive, roomData, rooms]);
  const [toggleSubMenu, setToggleSubMenu] = useState(tempToggle);

  const getUserById = async (userId) => {
    const response = await newRequet.get(`/users/id/${userId}`)

    return response.data.data
  }

  useEffect(() => {
    if (!stompClient && !isConnect) {
      connect()
    }
    if (isConnect && stompClient && isDeleteUser) {
      const subscriptionUserToRoom = stompClient.subscribe(`/rooms/${roomIdActive}/deleteUser`, (room) => {
        console.log('Received room delete user:', JSON.parse(room.body));
        dispatch(fetchRoomByUserId(accessToken))
        setIsDeleteUser(false)
      });

      return () => {
        subscriptionUserToRoom.unsubscribe();
      };
    }
  }, [stompClient, isDeleteUser])

  return (
    <div className={cx("wrapper")}>
      {/* Header */}
      <div className={cx("main", { openOption: isOpenOptions })}>
        <div className={cx("header", { minimize: isOpenOptions })}>
          {roomData && <AvatarInfo
            name={!roomData.roomName ? rName : roomData.roomName}
            des="Đang hoạt động"
            medium
            className={cx("person-title")}
          />}
          <Icon
            width="22px"
            noBackground
            onClick={() => {
              setIsOpenOptions(!isOpenOptions);
            }}
            className={cx("icon")}
            icon='isax-export-1'
          />
        </div>

        <div className={cx('wrapper-body', { minimize: isOpenOptions })}>
          <div className={cx("body", { minimize: isOpenOptions })}>
            <div className={cx('wrapper-message-box')}>
              <div className={cx("messages", { minimize: isOpenOptions })}>
                {
                  messages && messages.map((message, idx) => {
                    let prevMes = idx > 0 ? messages[idx - 1] : "";
                    let nextMes = idx < messages.length - 1 ? messages[idx + 1] : "";
                    const user = getUserById(message.userId)
                    let isUser = userId === message.userId
                    //0: user1, 1: user2, (): img=true

                    //0-
                    if (idx === 0) {
                      //0-(0)
                      if (nextMes && nextMes.userId === message.userId) {
                        return (
                          <div key={message.id} className={cx("messageItem", "noAvatar", { self: isUser })}>
                            <Tippy
                              delay={[500, 200]}
                              placement="left-start"
                              render={(attrs) => (
                                <div
                                  className={cx("tippy-message", {
                                    light: theme === "light",
                                  })}
                                  tabIndex="-1"
                                  {...attrs}
                                >
                                  <span>{moment(message.createdAt).format("mm:HH DD-MM-YYYY")}</span>
                                </div>
                              )}
                            >
                              <span
                                className={cx("message", "start", {
                                  light: theme === "light"
                                })}
                              >
                                {message.content}
                              </span>
                            </Tippy>
                          </div>)
                      }
                      //(0)-1
                      else {
                        return (
                          <div key={message.id} className={cx("messageItem", { self: isUser })}>
                            {!isUser && <ImageChatBox className={cx("imgUser-chat")} src={user.imageUrl} />}
                            <Tippy
                              delay={[500, 200]}
                              placement="left-start"
                              render={(attrs) => (
                                <div
                                  className={cx("tippy-message", {
                                    light: theme === "light",
                                  })}
                                  tabIndex="-1"
                                  {...attrs}
                                >
                                  <span>{moment(message.createdAt).format("mm:HH DD-MM-YYYY")}</span>
                                </div>
                              )}
                            >
                              <span
                                className={cx("message", "between", {
                                  light: theme === "light",
                                })}
                              >
                                {message.content}
                              </span>
                            </Tippy>
                          </div>
                        )
                      }
                    } else if (nextMes) {
                      //0-0-0
                      if (
                        message.userId === prevMes.userId &&
                        message.userId === nextMes.userId
                      ) {
                        return (
                          <div key={message.id} className={cx("messageItem", "noAvatar", { self: isUser })}>
                            <Tippy
                              delay={[500, 200]}
                              placement="left-start"
                              render={(attrs) => (
                                <div
                                  className={cx("tippy-message", {
                                    light: theme === "light",
                                  })}
                                  tabIndex="-1"
                                  {...attrs}
                                >
                                  <span>{moment(message.createdAt).format("mm:HH DD-MM-YYYY")}</span>
                                </div>
                              )}
                            >
                              <span
                                className={cx("message", "between", {
                                  light: theme === "light",
                                })}
                              >
                                {message.content}
                              </span>
                            </Tippy>
                          </div>
                        )
                      }
                      //0-1-
                      else if (message.userId !== prevMes.userId) {
                        //0-1-1
                        if (nextMes.userId === message.userId)
                          return (
                            <div key={message.id} className={cx("messageItem", "noAvatar", { self: isUser })}>
                              <Tippy
                                delay={[500, 200]}
                                placement="left-start"
                                render={(attrs) => (
                                  <div
                                    className={cx("tippy-message", {
                                      light: theme === "light",
                                    })}
                                    tabIndex="-1"
                                    {...attrs}
                                  >
                                    <span>{moment(message.createdAt).format("mm:HH DD-MM-YYYY")}</span>
                                  </div>
                                )}
                              >
                                <span
                                  className={cx("message", "start", {
                                    light: theme === "light",
                                  })}
                                >
                                  {message.content}
                                </span>
                              </Tippy>
                            </div>
                          );
                        //0-(1)-0
                        else
                          return (
                            <div key={message.id} className={cx("messageItem", { self: isUser })}>
                              {!isUser && <ImageChatBox className={cx("imgUser-chat")} src={user.imageUrl} />}
                              <Tippy
                                delay={[500, 200]}
                                placement="left-start"
                                render={(attrs) => (
                                  <div
                                    className={cx("tippy-message", {
                                      light: theme === "light",
                                    })}
                                    tabIndex="-1"
                                    {...attrs}
                                  >
                                    <span>{moment(message.createdAt).format("mm:HH DD-MM-YYYY")}</span>
                                  </div>
                                )}
                              >
                                <span
                                  className={cx("message", "between", {
                                    light: theme === "light",
                                  })}
                                >
                                  {message.content}
                                </span>
                              </Tippy>
                            </div>
                          );
                      }
                      //0-(0)-1
                      else if (
                        message.userId === prevMes.userId &&
                        message.userId !== nextMes.userId
                      )
                        return (
                          <div key={message.id} className={cx("messageItem", { self: isUser })}>
                            {!isUser && <ImageChatBox className={cx("imgUser-chat")} src={user.imageUrl} />}
                            <Tippy
                              delay={[500, 200]}
                              placement="left-start"
                              render={(attrs) => (
                                <div
                                  className={cx("tippy-message", {
                                    light: theme === "light",
                                  })}
                                  tabIndex="-1"
                                  {...attrs}
                                >
                                  <span>{moment(message.createdAt).format("mm:HH DD-MM-YYYY")}</span>
                                </div>
                              )}
                            >
                              <span
                                className={cx("message", "end", {
                                  light: theme === "light",
                                })}
                              >
                                {message.content}
                              </span>
                            </Tippy>
                          </div>
                        );
                      //-0
                      else {
                        //1-(0)
                        if (message.userId !== prevMes.userId)
                          return (
                            <div key={message.id} className={cx("messageItem", "noAvatar", { self: isUser })}>
                              <Tippy
                                delay={[500, 200]}
                                placement="left-start"
                                render={(attrs) => (
                                  <div
                                    className={cx("tippy-message", {
                                      light: theme === "light",
                                    })}
                                    tabIndex="-1"
                                    {...attrs}
                                  >
                                    <span>{moment(message.createdAt).format("mm:HH DD-MM-YYYY")}</span>
                                  </div>
                                )}
                              >
                                <span
                                  className={cx("message", "between", {
                                    light: theme === "light",
                                  })}
                                >
                                  {message.content}
                                </span>
                              </Tippy>
                            </div>
                          );
                        //0-0
                        // else
                      }
                    }
                    return (
                      <div key={message.id} className={cx("messageItem", { self: isUser })}>
                        {!isUser && <ImageChatBox className={cx("imgUser-chat")} src={user.imageUrl} />}
                        <Tippy
                          delay={[500, 200]}
                          placement="left-start"
                          render={(attrs) => (
                            <div
                              className={cx("tippy-message", {
                                light: theme === "light",
                              })}
                              tabIndex="-1"
                              {...attrs}
                            >
                              <span>{moment(message.createdAt).format("mm:HH DD-MM-YYYY")}</span>
                            </div>
                          )}
                        >
                          <span
                            className={cx("message", "end", {
                              light: theme === "light",
                            })}
                          >
                            {message.content}
                          </span>
                        </Tippy>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          </div>
          <div className={cx("footer", { minimize: isOpenOptions })}>
            <div className={cx("message-wrapper")}>
              <MessageForm />
            </div>
          </div>
        </div>
      </div>
      {/* Body */}
      {/* <div className={cx("body")}>
        
      </div> */}

      {/* Message form */}
      {isOpenOptions && (
        <div
          className={cx("option", {
            light: theme === "light",
            open: isOpenOptions,
          })}
        >
          <div>
            <ImageChatBox className={cx("img")} src="" />
          </div>
          <div className={cx("box-name")}>
            <p className={cx("name")}>{roomData.roomName}</p>
          </div>
          <div className={cx("quick-item")}>
            {/* <div className={cx("user")}>
              <Icon width="22px" icon='isax-user1' />
              <p>Trang cá nhân</p>
            </div> */}
            <div className={cx("user")}>
              <Icon width="22px" icon='isax-call-calling' />
              <p>Tắt thông báo</p>
            </div>
            <div className={cx("user")}>
              <Icon width='22px' icon='isax-search-normal-11' />
              <p>Tìm kiếm</p>
            </div>
          </div>
          <ul className={cx("roomOption")}>
            {roomOptions.map((item, idx) => {
              return (
                <li
                  key={idx}
                >
                  <RoomOptions
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      let toggle = [...toggleSubMenu];
                      toggle[idx] = !toggle[idx];
                      setToggleSubMenu(toggle);
                    }}
                    leftIcon={item.leftIcon}
                    title={item.title}
                    rightIcon={item.rightIcon}
                    rotateRightIcon={toggleSubMenu[idx]}
                  />
                  {item.subList ? (
                    <ul className={cx("subMenu", { open: toggleSubMenu[idx] })}>
                      {item.subList.map((subItem, idx) => {
                        return (
                          <Feature
                            key={idx}
                            onClick={subItem.onClick}
                            icon={subItem.leftIcon}
                            title={subItem.title}
                          />
                        );
                      })}
                    </ul>
                  ) : (
                    <ul className={cx('list-users', { show: toggleSubMenu[idx] })}>
                      {
                        roomData.users.map(user => {
                          return (
                            <li
                              key={user.userId}
                              className={cx('user', {
                                light: theme === 'light',
                                owner: roomData.owner.userId === user.userId
                              })}
                            >
                              <div className={cx('user-info')}>
                                <ImageChatBox className={cx('img')} src={user.imageUrl} />
                                <span className={cx('user-name')}>
                                  <div>{user.currentName}</div>
                                  {roomData.owner.userId === user.userId && <div className={cx('subTitle')}>Chủ phòng</div>}
                                </span>
                              </div>
                              {
                                roomData.owner.userId !== user.userId &&
                                <Tippy
                                  render={attrs => (
                                    <div
                                      onClick={() => {handleDeleteUserFromRoom(user.userId)}}
                                      className={cx('tippyUserInRoom')} {...attrs}>
                                      <span className={cx('icon')}>
                                        <FontAwesomeIcon icon={faTrash} />
                                      </span>
                                      <span>
                                        Xóa thành viên
                                      </span>
                                    </div>
                                  )}
                                  placement="bottom"
                                  content='duy'
                                  onClickOutside={() => { setIsShowOptionsUserSetting(false) }}
                                  interactive={true}
                                  visible={(isShowOptionsUserSetting && user.userId === userRoomOptionActive)}
                                >
                                  <span onClick={() => {
                                    dispatch(setUserRoomOptionActive(user.userId))
                                    setIsShowOptionsUserSetting(prev => !prev)
                                  }}
                                    className={cx('checkbox', { light: theme === 'light' })}
                                  >
                                    <FontAwesomeIcon icon={faEllipsis} />
                                  </span>
                                </Tippy>
                              }
                            </li>
                          )
                        })
                      }
                      <li onClick={() => {
                        dispatch(setUserAddUserToRoom(true))
                        dispatch(setUserAddRoomVisible(true))
                      }} className={cx('user', 'addUser', { light: theme === 'light' })}>
                        <span className={cx('icon')}>
                          <Icon icon='fa-solid fa-plus' />
                        </span>
                        <span className={cx('content')}>
                          Thêm người
                        </span>
                      </li>
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ChatWindow;
