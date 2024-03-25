import { useState, useRef, useEffect } from 'react';
import Tippy, { useSingleton } from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css'; // optional
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';

import styles from './messageForm.module.scss';
import { Gif } from '~/assets/icon';
import Icon from '../Icon/Icon';
import sockJS from 'sockjs-client/dist/sockjs'
import { over } from 'stompjs';
import { fetchMessageByRoomId } from '~/store/slice/messageSlice';
import { fetchRoomByUserId } from '~/store/slice/roomSlice';

const cx = classNames.bind(styles);

function MessageForm() {
    const [source, target] = useSingleton();
    const [inputValue, setInputValue] = useState('');
    const [selectedFile, setSelectedFile] = useState();
    const inputFileRef = useRef();
    const inputTextRef = useRef()
    const { userId } = useSelector(state => state.user)

    const { theme } = useSelector(state => state.app)
    const [stompClient, setStompClient] = useState(null);
    const [isConnect, setIsConnect] = useState(false);

    const dispatch = useDispatch()
    const { accessToken } = useSelector(state => state.account)
    const { roomIdActive } = useSelector(state => state.app)

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

    const sendMessage = (chatMessage) => {
        if (stompClient && stompClient.connected) {
            stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage));
            console.log('Message sent:', chatMessage);
        } else {
            console.log('Not connected to WebSocket');
        }
    }

    const handleSendMessage = (e) => {
        if (e.keyCode === 13) {
            if (inputValue.trim() !== '' && selectedFile) {
                // sendMessage('@text', inputValue, null, selectedRoom.id)
                // sendMessage('@image', null, selectedFile.data, selectedRoom.id)
            } else if (inputValue.trim() !== '') {
                console.log('!!')

                sendMessage({ content: inputValue, chatRoomId: roomIdActive, userId })

                // connect()
                // sendMessage('@text', inputValue, null, selectedRoom.id)
            } else if (selectedFile) {
                // sendMessage('@image', null, selectedFile.data, selectedRoom.id)
            }
            setInputValue('');
            setSelectedFile(null)
        }
    };

    const handleSelectedFile = (e) => {
        if (e.target.files[0] && e.target.files[0].type.includes('image')) {
            setSelectedFile({
                type: '@image',
                data: URL.createObjectURL(e.target.files[0]),
            });
        }
        inputTextRef.current.focus()
        // if (e.target.files[0].type.includes('video')) {
        //     setSelectedFile({
        //         type: '@video',
        //         data: URL.createObjectURL(e.target.files[0]),
        //     });
        // }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null)
    }

    useEffect(() => {
        if (!stompClient) {
            connect()
        }
        console.log('isConnect: ', isConnect)
        console.log('stompClient: ', stompClient)
        if (isConnect && stompClient) {
            const subscription = stompClient.subscribe(`/rooms/${roomIdActive}`, (message) => {
                console.log('Received message:', JSON.parse(message.body));
                dispatch(fetchMessageByRoomId({ roomIdActive, accessToken }))
                dispatch(fetchRoomByUserId(accessToken))
            });

            return () => {
                subscription.unsubscribe();
            };
        }
        // console.log(messages)
    }, [isConnect, stompClient, roomIdActive]);

    return (
        <div className={cx('wrapper')}>
            <Tippy
                singleton={source}
                delay={[50, 0]}
                interactive
                render={(attrs, content) => (
                    <div className={cx('tippy-box', { light: theme === 'light' })} tabIndex="-1" {...attrs}>
                        {content}
                    </div>
                )}
            />
            <Tippy singleton={target} content="Đính kèm file">
                <div>
                    <label
                        className={cx('file-btn')}
                        htmlFor="upload-photo"
                        onClick={(e) => {
                            if (e.target !== e.currentTarget) {
                                e.currentTarget.click();
                            }
                        }}
                    >
                        <Icon
                            ref={inputFileRef}
                            onClick={(e) => {
                                e.preventDefault();
                            }}
                            noBackground
                            width="22px"
                            color="#D988B9"
                            className={cx('imgIcon')}
                            icon='isax-image'
                        />
                    </label>
                    <input
                        onChange={handleSelectedFile}
                        type="file"
                        name="file"
                        id="upload-photo"
                        className={cx('input-file')}
                    />
                </div>
            </Tippy>
            <Tippy
                singleton={target}
                content={() => {
                    return <span>Chọn nhãn dán</span>;
                }}
            >
                <Icon
                    noBackground
                    className={cx('stickerIcon')}
                    icon={'isax-sticker'}
                    width="22px"
                    color="#D988B9"
                />
            </Tippy>
            <Tippy
                content={() => {
                    return <span>Chọn file gif</span>;
                }}
                singleton={target}
            >
                <Icon noBackground className={cx('gifIcon')} IconAccess={Gif} height="20" width="20" color="#D988B9" />
            </Tippy>
            <div className={cx('inputMessage')}>
                {selectedFile && (
                    <div className={cx('file-wrapper', { light: theme === 'light' })}>
                        <div className={cx('file-show')}>
                            {selectedFile.type === '@image' && (
                                <img src={selectedFile.data} className={cx('file-image')} />
                            )}
                            {/* {selectedFile.type === '@video' && (
                                <video src={selectedFile.data} className={cx('file-video')}></video>
                            )} */}
                            <span onClick={handleRemoveFile} className={cx('file-close')}>
                                <i className="fa-solid fa-x"></i>
                            </span>
                        </div>
                    </div>
                )}
                <div className={cx('text-box')}>
                    <input
                        onKeyDown={(e) => {
                            handleSendMessage(e);
                        }}
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                        }}
                        className={cx('input', { light: theme === 'light', small: selectedFile })}
                        type="text"
                        placeholder="Aa"
                        ref={inputTextRef}
                    />
                    <div className={cx('wrapperSmileIcon')}>
                        <Tippy singleton={target} noBackground placement="right-start" content="Chọn biểu tượng cảm xúc">
                            <Icon width="22px" color="#D988B9" noBackground className={cx('smileIcon')} icon='isax-magic-star1' />
                        </Tippy>
                    </div>
                </div>
            </div>

            <div className={cx('sendBtnBox')}>
                <Tippy
                    placement="right-start"
                    singleton={target}
                    content={inputValue !== '' ? 'Nhấn Enter để gửi' : 'Gửi lượt thích'}
                >
                    <Icon width="22px" color="#D988B9" noBackground className={cx('likeIcon')} icon={inputValue !== '' ? 'isax-send-2' : 'isax-like-1'} />
                </Tippy>
            </div>
        </div>
    );
}

export default MessageForm;
