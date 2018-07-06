import React from 'react';
import { withRouter } from 'react-router-dom';
import { Icon, Container, Message } from 'semantic-ui-react';

class JoinMatch extends React.PureComponent {
    componentDidMount() {
        console.log('joining lobby');
        this.props.socket.emit('lobby join', {
            token: this.token(),
        });
    }

    componentWillUnmount() {
        
    }

    token = () => this.props.match.params.name;

    render() {
        if (!this.props.socket) {
            return (
                <Message>
                    Please connect to the server first.
                </Message>
            );
        }
    
        return (
            <Container textAlign='center'>
                <h1><Icon name='game' /><br /> Joined Match</h1>
                <p>
                    Available players: 1
                </p>
            </Container>
        );
    }
};

export default withRouter(JoinMatch);