import React from 'react';

import SocketContext from '../../components/SocketProvider/provider';
import MatchSection from './section';

export default () => {
    return (
        <SocketContext.Consumer>
            {socket => (
                <MatchSection socket={ socket } />
            )}
        </SocketContext.Consumer>
    );
};