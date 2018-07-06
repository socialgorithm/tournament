import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Icon, Message, Container } from 'semantic-ui-react';

import CreateMatch from '../../components/CreateMatch';
import JoinMatch from '../../components/JoinMatch';

export default (props) => {
    if (!props.socket || !props.socket.socket || !props.socket.socket.connected) {
        return (
            <Container textAlign='center'>
                <h1><Icon name='game' /><br /> Match</h1>
                <Message compact warning>
                    Please connect to the server first (top right button in the header)
                </Message>
            </Container>
        );
    }

    const render = (Component) => {
        return () => (
            <Component { ...props } />
        );
    };

    return (
        <Switch>
            <Route
                path='/match/:name'
                render={ render(JoinMatch) }
            />
            <Route
                render={ render(CreateMatch) }
            />
        </Switch>
    );
};