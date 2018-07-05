import React from 'react';

export const SocketContext = React.createContext({
    socket: null,
    emit: () => {},
});

export default SocketContext;