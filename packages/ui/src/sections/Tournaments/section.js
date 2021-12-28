import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Grid, Icon, Segment } from 'semantic-ui-react';

import ServerContainer from '../../containers/ServerContainer';
import LobbySelector from '../../components/Lobby';
import LobbyAdmin from '../../components/Lobby/Admin';

export default (props) => {

    const connectionScreen = (
    <Grid.Column style={{ paddingTop: '10em' }} textAlign='center' padded stretched>
        <Grid.Row>
            <h1><Icon name='warning circle' /> Disconnected from server</h1>
            <ServerContainer content="Click here to connect" />
        </Grid.Row>
        <Grid.Row style={{ paddingTop: '10em' }}>
            <h2>Need help?</h2>
            <p>You can give <a href="https://socialgorithm.org/docs">our documentation</a> a try!</p>
            <p>Otherwise, join our <a href="https://socialgorithm-slack.herokuapp.com"><Icon name='slack hash' />Slack</a> and ask us there :)</p>
        </Grid.Row>
    </Grid.Column>
    )

    if (!props.socket || !props.socket.socket || !props.socket.socket.connected) {
        return connectionScreen;
    }

    const render = (Component) => {
        return () => (
            <Component { ...props } />
        );
    };

    return (
        <Switch>
            <Route
                path='/tournament/:name'
                render={ render(LobbyAdmin) }
            />
            <Route
                render={ render(LobbySelector) }
            />
        </Switch>
    );
};