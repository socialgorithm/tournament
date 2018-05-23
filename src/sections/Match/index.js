import React from 'react';
import { Icon, Container, Message } from 'semantic-ui-react';

export default () => {
    return (
        <Container textAlign='center'>
            <h1><Icon name='game' /><br /> Create Match</h1>
            <Message warning compact>
                Match Making is not available yet.
            </Message>
        </Container>
    );
};