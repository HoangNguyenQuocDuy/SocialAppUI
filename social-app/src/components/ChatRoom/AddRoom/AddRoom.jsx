import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { faMagnifyingGlass, faSpinner, faX } from '@fortawesome/free-solid-svg-icons';

import styles from './addRoom.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { setRoomIdActive, setUserAddRoomVisible } from '~/store/slice/appSlice';
import Icon from '~/components/Icon/Icon';
import { useDebounce } from '~/hooks/useDebounce';
import newRequet from '~/untils/request';
import ImageChatBox from '~/components/ImageChatBox';
import sockJS from 'sockjs-client/dist/sockjs'
import { useNavigate } from 'react-router-dom';
import { over } from 'stompjs';
import { fetchRoomByUserId } from '~/store/slice/roomSlice';

const cx = classNames.bind(styles);

function AddRoom() {
    const dispatch = useDispatch()
    const { theme, userAddRoomVisible } = useSelector(state => state.app)
    const [nameValue, setNameValue] = useState('');
    const [membersValue, setMembersValue] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const { accessToken } = useSelector(state => state.account)
    const [listUsers, setListUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const debounced = useDebounce(membersValue, 1000);
    const inputUsersRef = useRef()
    const currentUser = useSelector(state => state.user)
    const navigate = useNavigate()
    const [isConnect, setIsConnect] = useState(false);
    const [stompClient, setStompClient] = useState(null);

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

    const createRoom = (roomData) => {
        if (stompClient && stompClient.connected) {
            stompClient.send('/app/chat.createRoom', {}, JSON.stringify(roomData));
            console.log('Room sent:', roomData);
        } else {
            console.log('Not connected to WebSocket');
        }
    }

    const handleCreateRoom = async (e) => {
        e.preventDefault()
        if (selectedUsers.length > 0) {
            const data = {
                roomName: nameValue,
                usersIds: [currentUser.userId, ...selectedUsers.map(user => user.userId)]
            }
            createRoom(data)
        } else {
            alert('Cần thêm ít nhất 1 thành viên để tạo nhóm.')
        }
    }

    const handleDeleteSelectedUser = (user) => {
        setSelectedUsers((prev) => {
            return prev.filter((value) => value.userId !== user.userId);
        });
    };

    useEffect(() => {
        if (!stompClient) {
            connect()
        }
        console.log('isConnect: ', isConnect)
        console.log('stompClient: ', stompClient)
        if (isConnect && stompClient) {
            const subscription = stompClient.subscribe('/rooms', (room) => {
                const receiveRoom = JSON.parse(room.body)
                console.log('Received room:', JSON.parse(room.body));
                // dispatch(setRoomIdActive(room.body));
                dispatch(fetchRoomByUserId(accessToken));
                dispatch(setRoomIdActive(receiveRoom.id))
                dispatch(setUserAddRoomVisible(false))
                setTimeout(() => {
                    navigate(`/rooms/${receiveRoom.id}`)
                }, 500)
            });

            return () => {
                subscription.unsubscribe();
            };
        }
    }, [isConnect, stompClient])

    useEffect(() => {
        if (!userAddRoomVisible) {
            setNameValue('');
            setMembersValue('');
            setSelectedUsers([]);
        }
    }, [userAddRoomVisible]);

    const handleSelectUser = (user) => {
        if (
            selectedUsers.find((value) => {
                return value.userId === user.userId;
            })
        ) {
            handleDeleteSelectedUser(user);
        } else {
            setSelectedUsers((prev) => {
                return [...prev, user];
            });
        }
    };

    const getUsersSearch = async () => {
        setLoading(true)
        await newRequet.get(`/users/?currentName=${debounced}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(data => {
                console.log(data)
                setListUsers(data.data.data.filter(user => user.userId !== currentUser.userId))
                setLoading(false)
            })
            .catch(err => {
                console.log('Error when get users by currentName ' + err)
            })
    }

    useEffect(() => {
        getUsersSearch()

    }, [debounced]);

    function handleChangeSearchUsers(e) {
        if (!membersValue.startsWith(' ')) {
            setMembersValue(e.target.value);
        }
    }

    const handleCloseForm = (e) => {
        e.preventDefault()
        dispatch(setUserAddRoomVisible(false))
    }

    return (
        <div>
            <form className={cx('wrapper', { light: theme === 'light' })}>
                <p className={cx('title')}>
                    Tạo nhóm chat
                    <Icon
                        onClick={(e) => { handleCloseForm(e) }}
                        className={cx('remove')}
                        icon={'fa-solid fa-x'}
                    />
                </p>
                <div className={cx('box-name')}>
                    <label
                        htmlFor="inputName"
                        className={cx('label', { active: nameValue !== '', light: theme === 'light' })}
                    >
                        Nhập tên nhóm
                    </label>
                    <div className={cx('input-name')}>
                        <input
                            onChange={(e) => {
                                setNameValue(e.target.value);
                            }}
                            value={nameValue}
                            id={'inputName'}
                            placeholder="Tên nhóm..."
                            type="text"
                            className={cx({ light: theme === 'light' })}
                        />
                    </div>
                </div>
                <div className={cx('box-add')}>
                    <label
                        className={cx('label', {
                            active: membersValue !== '' || selectedUsers.length > 0,
                            light: theme === 'light',
                        })}
                        htmlFor="inputUser"
                    >
                        Thêm thành viên
                    </label>

                    <div className={cx('wrapper-members', { active: selectedUsers.length > 0 })}>
                        <div className={cx('members-add')}>
                            {selectedUsers.map((member) => {
                                return (
                                    <div className={cx('member')} key={member.userId}>
                                        <ImageChatBox className={cx('member-img')} src={member.imageUrl} />
                                        <span
                                            onClick={() => {
                                                handleDeleteSelectedUser(member);
                                            }}
                                            className={cx('member-close')}
                                        >
                                            <i className="fa-solid fa-x"></i>
                                        </span>
                                        <div className={cx('member-name')}>{member.currentName}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className={cx('find-box')}>
                        <div className={cx('find-box-wrapper')}>
                            <label htmlFor="inputUser" className={cx('find-icon')}>
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </label>
                            <input
                                ref={inputUsersRef}
                                onChange={handleChangeSearchUsers}
                                value={membersValue}
                                id="inputUser"
                                className={cx({ light: theme === 'light' })}
                                type="text"
                                placeholder="Tìm kiếm..."
                            />
                            {membersValue !== '' && (
                                <span
                                    onClick={() => {
                                        setMembersValue('');
                                        inputUsersRef.current.focus()
                                    }}
                                    className={cx('close-icon', { light: theme === 'light' })}
                                >
                                    {!loading && <FontAwesomeIcon icon={faX} />}
                                </span>
                            )}
                            {loading && (
                                <span className={cx('loading-icon', { light: theme === 'light' })}>
                                    <span>
                                        <FontAwesomeIcon icon={faSpinner} />
                                    </span>
                                </span>
                            )}
                        </div>
                        <ul className={cx('list-users', { show: membersValue !== '' && listUsers.length > 0 })}>
                            {listUsers.map((user) => {
                                return (
                                    <li
                                        key={user.userId}
                                        onClick={() => {
                                            handleSelectUser(user);
                                        }}
                                        className={cx('user', {
                                            light: theme === 'light',
                                            active: selectedUsers.find((selectedUser) => {
                                                selectedUser.userId === user.userId
                                            }) ? true : false
                                        })}
                                    >
                                        <div className={cx('user-info')}>
                                            <ImageChatBox className={cx('img')} src={user.imageUrl} />
                                            <span className={cx('user-name')}>{user.currentName}</span>
                                        </div>
                                        <span className={cx('checkbox', { light: theme === 'light' })}>
                                            <input
                                                checked={
                                                    selectedUsers.find((selectedUser) => selectedUser.userId === user.userId) ? true : false
                                                }
                                                readOnly
                                                className={cx('input-check')}
                                                type="checkbox"
                                            />
                                            <span className={cx('geekmark')}></span>
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
                <div className={cx('add-group', { active: selectedUsers.length > 0 })}>
                    <button onClick={handleCreateRoom} className={cx({ active: selectedUsers.length > 0 })}>
                        Thêm nhóm
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddRoom;
