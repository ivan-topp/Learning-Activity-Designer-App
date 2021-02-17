import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Typography } from '@material-ui/core';
import { useSocketState } from '../../contexts/SocketContext';
import { useAuthState } from '../../contexts/AuthContext';
import { formatName, getUserInitials } from '../../utils/textFormatters';

export const DesignPage = () => {

    const { id } = useParams();
    const { authState } = useAuthState();
    const { socket, online } = useSocketState();
    const [ users, setUsersList] = useState([]);

    useEffect(() => {
        socket.emit('join-to-design', { user: authState.user, design: id });
        socket.on('joined', ( users ) => setUsersList(users));
        return () => socket.off('joined');
    }, [socket, authState.user, id]);

    console.log(users);
    console.log(online);

    return (
        <>
            <Typography variant='h4'>DesignPage</Typography>
            <hr/>
            {
                users.map((user) => 
                    <Avatar
                        key={user.uid}
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
