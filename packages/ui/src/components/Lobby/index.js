import React from 'react';
import { Icon, Container, Button, Message, Grid, Segment } from 'semantic-ui-react';

export default (props) => {
    if (!props.socket) {
        return (
            <Message>
                Please connect to the server first.
            </Message>
        );
    }

    const createTournament = () => {
        props.socket.emit('lobby create');
    };

    const dividerStyle = {
        marginTop: '10em',
    };

    return (
        <Container textAlign='center' style={ dividerStyle }>
            <h1><Icon name='game'/> Tournaments</h1>
            <Grid columns={ 2 } textAlign='left' style={ dividerStyle }>
                <Grid.Row>
                    <Grid.Column>
                        <div textAlign='center'>
                            <Button
                                primary
                                icon='add'
                                content='Create'
                                onClick={ createTournament }
                            />
                        </div>
                        <h2>Creating a Tournament</h2>
                        <p>Players play against each other by connecting to Tournaments.</p>
                        <p>When you create one, you'll be the <b>admin</b> for that tournament, which allows you to configure it, manage the list of players, and choose when it starts.</p>
                        <p>Once you've created a tournament, you can just send the url to the other players to have them connect to it.</p>
                        <p>This can also be used to play games between different versions of your own algorithm.</p>
                    </Grid.Column>
                    <Grid.Column>
                        <h2>Joining a Tournament</h2>
                        <p>If you want to join someone else's tournament, just ask them for the tournament url.</p>
                        <p>Tournaments are typically identified with any two random words, so it will be something like "amazing-building".</p>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Segment style={ dividerStyle }>
                <h2>Need help?</h2>
                <p>You can give <a href="https://socialgorithm.org/docs">our documentation</a> a try!</p>
                <p>Otherwise, join our <a href="https://socialgorithm-slack.herokuapp.com"><Icon name='slack hash' />Slack</a> and ask us there :)</p>
            </Segment>
        </Container>
    );
};