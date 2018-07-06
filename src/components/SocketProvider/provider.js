import React from 'react';

export const SocketContext = React.createContext({
    socket: null,
    uuid: null,
    emit: () => {},
});

export default SocketContext;