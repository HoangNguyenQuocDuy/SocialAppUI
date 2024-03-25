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
import Image from "~/components/Image/Image";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { fetchMessageByRoomId } from "~/store/slice/messageSlice";

import images from "~/assets/images";

const cx = classNames.bind(styles);

function ChatWindow() {
  const { roomIdActive } = useSelector(state => state.app)
  const { theme } = useSelector(state => state.app)

  const dispatch = useDispatch()

  const [roomData, setRoomData] = useState()
  const [isOpenOptions, setIsOpenOptions] = useState(false);

  const rooms = useSelector(state => state.rooms)
  const [rName, setRName] = useState('')
  const messages = useSelector(state => state.messages)
  const { accessToken } = useSelector(state => state.account)
  const { userId } = useSelector(state => state.user)
  console.log('message chatwindow: ', messages)
  const roomOptions = [
    // {
    //   id: 0,
    //   leftIcon: faDragon,
    //   title: "Tùy chỉnh đoạn chat",
    //   rightIcon: faChevronRight,
    //   subList: [
    //     {
    //       leftIcon: faCircleDot,
    //       title: "Đổi chủ đề",
    //       onClick: (e) => {
    //         e.stopPropagation();
    //         console.log("duy");
    //       },
    //     },
    //     {
    //       leftIcon: faThumbsUp,
    //       title: "Thay đổi biểu tượng cảm xúc",
    //     },
    //     {
    //       leftIcon: faDragon,
    //       title: "Chỉnh sửa biệt danh",
    //     },
    //     {
    //       leftIcon: faMagnifyingGlass,
    //       title: "Tìm kiếm trong cuộc trò chuyện",
    //     },
    //   ],
    // },
    {
      id: 1,
      title: "Thành viên đoạn chat(150)",
      rightIcon: 'isax-arrow-right-11',
      subList: [
        {
          leftIcon: 'isax-edit-21',
          title: "Chỉnh sửa biệt danh",
        },
        {
          leftIcon: 'isax-search-normal-11',
          title: "Tìm kiếm trong cuộc trò chuyện",
        },
      ],
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

  var tempToggle = [];
  useEffect(() => {
    roomOptions.forEach((item, idx) => {
      tempToggle[idx] = false;
    });

    setRoomData(rooms.find(room => room.id === roomIdActive))
    if (roomData && rName==='') {
      roomData.users.forEach(room => { setRName(state => state + ', ' + room.currentName) })
    }

    if (roomIdActive) {
      console.log('from chat window')
      dispatch(fetchMessageByRoomId({ roomIdActive, accessToken }))
      console.log('roomData ', rooms.find(room => room.id === roomIdActive))
      setRoomData(rooms.find(room => room.id === roomIdActive))
      console.log(roomIdActive)
    }
  }, [roomIdActive, roomData, rooms]);
  const [toggleSubMenu, setToggleSubMenu] = useState(tempToggle);

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

                    //0: user1, 1: user2, (): img=true

                    //0-
                    if (idx === 0) {
                      //0-(0)
                      if (nextMes && nextMes.userId === message.userId) {
                        return (
                          <div key={message.id} className={cx("messageItem", { self: userId === message.userId })}>
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
                          <div key={message.id} className={cx("messageItem", { self: userId === message.userId })}>
                            <Image className={cx("imgUser-chat")} src={images.tanjirou} />
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
                          <div key={message.id} className={cx("messageItem", { self: userId === message.userId })}>
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
                            <div key={message.id} className={cx("messageItem", { self: userId === message.userId })}>
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
                            <div key={message.id} className={cx("messageItem", { self: userId === message.userId })}>
                              <Image className={cx("imgUser-chat")} src={images.tanjirou} />
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
                          <div key={message.id} className={cx("messageItem", { self: userId === message.userId })}>
                            <Image className={cx("imgUser-chat")} src={images.tanjirou} />
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
                            <div key={message.id} className={cx("messageItem", { self: userId === message.userId })}>
                              <Image className={cx("imgUser-chat")} src={images.tanjirou} />
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
                      <div key={message.id} className={cx("messageItem", { self: userId === message.userId })}>
                        <Image className={cx("imgUser-chat")} src={images.tanjirou} />
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
            <Image className={cx("img")} src="" />
          </div>
          <div className={cx("box-name")}>
            <p className={cx("name")}>Dung Ne</p>
            <p className={cx("des")}>Đang hoạt động</p>
          </div>
          <div className={cx("quick-item")}>
            <div className={cx("user")}>
              <Icon width="22px" icon='isax-user1' />
              <p>Trang cá nhân</p>
            </div>
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
                  onClick={() => {
                    let toggle = [...toggleSubMenu];
                    toggle[idx] = !toggle[idx];
                    setToggleSubMenu(toggle);
                  }}
                >
                  <RoomOptions
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
                    <></>
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
