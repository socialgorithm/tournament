import React from 'react';
import { Icon, Container, Button, Message } from 'semantic-ui-react';

import SocketProvider from '../../components/SocketProvider';

export default () => {

    console.log('socket', SocketProvider.socket);

    if (!SocketProvider.socket) {
        return (
            <Message>
                Please connect to the server first.
            </Message>
        );
    }

    const createGame = () => {
        SocketProvider.socket.emit('lobby create', (data) => {
            console.log('new lobby', data);
        });
    };

    return (
        <Container textAlign='center'>
            <h1><Icon name='game' /><br /> Create Match</h1>
            <Button
                primary
                icon='add'
                content='Get Started'
                onClick={ createGame }
            />
        </Container>
    );
};