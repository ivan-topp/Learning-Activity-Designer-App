import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Typography } from '@material-ui/core';
import { useSocketState } from '../../contexts/SocketContext';
import { useAuthState } from '../../contexts/AuthContext';
import { formatName, getUserInitials } from '../../utils/textFormatters';

export const DesignPage = () => {

    const { id } = useParams();
    const { authState } = useAuthState();
    const { socket/*, online*/ } = useSocketState();
    const [ users, setUsersList] = useState([]);

    useEffect(() => {
        socket.emit('join-to-design', { user: authState.user, designId: id });
        socket.on('joined', ( users ) => setUsersList(users));
        return () => {
            socket.emit('leave-from-design', { user: authState.user, designId: id });
            socket.off('joined');
        };
    }, [socket, authState.user, id]);

    return (
        <>
            <Typography variant='h4'>DesignPage</Typography>
            <hr/>
            {
                users.map((user, index) => 
                    <Avatar
                        key={user.uid + index}
                        alt={formatName(user.name, user.lastname)}
                        src={user.img ?? ''}
                    >
                        {getUserInitials(user.name, user.lastname)}
                    </Avatar>
                )
            }
        </>
    )
}
