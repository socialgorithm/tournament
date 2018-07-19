import React from 'react';
import { Icon, Container, Button, Message, Divider, Grid, Segment } from 'semantic-ui-react';

export default (props) => {
    if (!props.socket) {
        return (
            <Message>
                Please connect to the server first.
            </Message>
        );
    }

    const createGame = () => {
        props.socket.emit('lobby create');
    };

    const dividerStyle = {
        marginTop: '10em',
    };

    return (
        <Container textAlign='center' style={ dividerStyle }>
            <h1><Icon name='game' /><br /> Create Match</h1>
            <Button
                primary
                icon='add'
                content='Get Started'
                onClick={ createGame }
            />
            <Grid columns={ 2 } textAlign='left' style={ dividerStyle }>
                <Grid.Row>
                    <Grid.Column>
                        <h2>Create a Match</h2>
                        <p>Matches are private "lobbies" where players can connect to play against each other.</p>
                        <p>When you create one, you'll be the <b>admin</b> for that lobby, which allows you to configure it how you want, manage the list of players, and choose when it starts.</p>
                        <p>Once you've created a lobby, you can just send the url to the other players to have them connect to it.</p>
                        <p>This can also be used to play games between different versions of your own algorithm.</p>
                    </Grid.Column>
                    <Grid.Column>
                        <h2>Join Existing Matches</h2>
                        <p>If you want to join someone else's lobby, just ask them for the lobby url.</p>
                        <p>Lobbies are typically identified with any two random words, so it will be something like "amazing-building".</p>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Segment style={ dividerStyle }>
                <h2>Need help?</h2>
                <p>You can give <a href="https://socialgorithm.org/ultimate-ttt-docs">our documentation</a> a try!</p>
                <p>Otherwise, join our <a href="https://socialgorithm-slack.herokuapp.com"><Icon name='slack hash' />Slack</a> and ask us there :)</p>
            </Segment>
        </Container>
    );
};