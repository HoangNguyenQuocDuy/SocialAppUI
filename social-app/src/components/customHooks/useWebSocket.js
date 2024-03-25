import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import sockJS from 'sockjs-client/dist/sockjs';
import { over } from 'stompjs';
import { setRoomIdActive, setUserAddRoomVisible } from '~/store/slice/appSlice';
// import { setRoomIdActive } from '~/store/slice/appSlice';
import { fetchMessageByRoomId } from '~/store/slice/messageSlice';
import { fetchRoomByUserId } from '~/store/slice/roomSlice';

function useWebSocket() {
    const [stompClient, setStompClient] = useState(null);
    const [isConnect, setIsConnect] = useState(false);
    const navigate = useNavigate()

    const dispatch = useDispatch()
    const { accessToken } = useSelector(state => state.account)
    const { roomIdActive } = useSelector(state => state.app)

    const onConnect = () => {
        console.log('connect ws successful');
        setIsConnect(true);
        stompClient.subscribe(`/rooms/${roomIdActive}`)
        stompClient.subscribe('/rooms')
    };

    const onError = () => {
        setIsConnect(false);
        console.log('error connect');
    };

    const connect = () => {
        const sock = new sockJS('http://localhost:8089/ws');
        const temp = over(sock);

        setStompClient(temp);
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            // "X-XSRF-TOKEN": getCookie('XSRF-TOKEN')
        };
        temp.connect(headers, onConnect, onError);
    };

    const sendMessage = (chatMessage) => {
        if (stompClient && stompClient.connected) {
            stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage));
            console.log('Message sent:', chatMessage);
        } else {
            console.log('Not connected to WebSocket');
        }
    };

    const receiveMessages = () => {
        if (stompClient && stompClient.connected) {
            const subscription = stompClient.subscribe(`/rooms/${roomIdActive}`, (message) => {
                console.log('Received message:', JSON.parse(message.body));
                dispatch(fetchMessageByRoomId({ roomIdActive, accessToken }));
                dispatch(fetchRoomByUserId(accessToken));
            });

            return () => {
                subscription.unsubscribe();
            };
        }
    }

    const createRoom = (roomData) => {
        if (stompClient && stompClient.connected) {
            stompClient.send('/app/chat.createRoom', {}, JSON.stringify(roomData));
            console.log('Room sent:', roomData);
        } else {
            console.log('Not connected to WebSocket');
        }
    }

    const receiveRoom = () => {
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
    }

    useEffect(() => {
        if (stompClient && !stompClient.isConnect) {
            connect();
        }
        console.log('isConnect: ', isConnect);
        console.log('stompClient: ', stompClient);
        console.log('from useWS')
    }, []);

    return { sendMessage, receiveMessages, createRoom, receiveRoom, connect };
}

export default useWebSocket;
