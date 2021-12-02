import React from 'react';

import SocketContext from '../../components/SocketProvider/provider';
import Tournament from './section';

export default () => {
    return (
        <SocketContext.Consumer>
            {socket => (
                <Tournament socket={ socket } />
            )}
        </SocketContext.Consumer>
    );
};