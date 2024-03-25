import { useEffect, useState } from "react";
import AvatarInfo from "../AvatarInfo";
import Proptypes from 'prop-types'
import { useSelector } from "react-redux";


Room.propTypes = {
    roomName: Proptypes.string,
    lastMessage: Proptypes.string,
    users: Proptypes.array,
    onClick: Proptypes.func,
    roomId: Proptypes.string
}

function Room({ roomName, lastMessage, users, onClick, roomId }) {
    const [rName, setRName] = useState(roomName)
    const { roomIdActive } = useSelector(state => state.app)
    useEffect(() => {
        if (!rName) {
            users.forEach(user => {
                setRName(state => state + ", " + user.currentName)
            });
        }
    }, [])
    return (
        <AvatarInfo activeRoom={roomIdActive===roomId} onClick={onClick} name={rName} des={lastMessage} />
    );
}

export default Room;