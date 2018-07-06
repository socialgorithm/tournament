import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Icon, Message } from 'semantic-ui-react';

import CreateMatch from '../../components/CreateMatch';
import JoinMatch from '../../components/JoinMatch';

export default (props) => {
    if (!props.socket || !props.socket.socket) {
        return (
            <div>
                <h1><Icon name='game' /><br /> Match</h1>
                <Message>
                    Please connect to the server first.
                </Message>
            </div>
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