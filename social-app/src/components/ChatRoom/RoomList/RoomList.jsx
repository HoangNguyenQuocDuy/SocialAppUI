import Proptypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';

import Room from '~/components/Room'
import { setRoomIdActive } from '~/store/slice/appSlice';

RoomList.propTypes = {
    rooms: Proptypes.array
}

function RoomList({ rooms }) {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    
    const handleActiveRoom = (id) => {
        dispatch(setRoomIdActive(id))
        navigate(`/rooms/${id}`)
    }
    return ( 
        <>
        {rooms.map(({ roomName, lastMessage, id, users }) => (
            <Room onClick={() => {handleActiveRoom(id)}} roomName={roomName} roomId={id} lastMessage={lastMessage} key={id} users={users}  />
        ))}
        </>  
    );
}

export default RoomList;