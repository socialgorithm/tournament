import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Icon, Container } from 'semantic-ui-react';

import ServerContainer from '../../containers/ServerContainer';
import CreateMatch from '../../components/Match/CreateMatch';
import JoinMatch from '../../components/Match/JoinMatch';

export default (props) => {
    if (!props.socket || !props.socket.socket || !props.socket.socket.connected) {
        return (
            <Container textAlign='center'>
                <h1><Icon name='game' /><br /> Match</h1>
                <ServerContainer content="Connect to server" />
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